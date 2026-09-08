const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const kitchen = require("../miniprogram/utils/kitchen");

test("cart restores known dishes only and handles corrupt saved data", () => {
  assert.deepEqual(kitchen.sanitizeCart(null), {});
  assert.deepEqual(kitchen.sanitizeCart([]), {});
  assert.deepEqual(
    kitchen.sanitizeCart({
      "basil-squid": 2.8,
      "steamed-patty": "3",
      "bitter-melon-eggs": Infinity,
      unknown: 2,
    }),
    { "basil-squid": 2 },
  );
  assert.deepEqual(kitchen.sanitizeCart({ "basil-squid": 500 }), {
    "basil-squid": 99,
  });
});

test("quantity is immutable, capped at 99 and removes a dish at zero", () => {
  const original = { "basil-squid": 1 };
  assert.deepEqual(kitchen.changeQuantity(original, "basil-squid", -1), {});
  assert.deepEqual(original, { "basil-squid": 1 });
  assert.deepEqual(kitchen.changeQuantity(original, "missing", 1), original);
  assert.deepEqual(
    kitchen.changeQuantity(original, "basil-squid", 20),
    original,
  );
  assert.equal(
    kitchen.changeQuantity({ "basil-squid": 99 }, "basil-squid", 1)[
      "basil-squid"
    ],
    99,
  );
});

test("search spans categories and includes ingredients; clear restores category", () => {
  assert.equal(kitchen.filterDishes("signature", "", {}).length, 4);
  assert.equal(
    kitchen.filterDishes("vegetables", "", {})[0].id,
    "bitter-melon-eggs",
  );
  assert.equal(
    kitchen.filterDishes("vegetables", " 蒜 ", {})[0].id,
    "basil-squid",
  );
  assert.equal(kitchen.filterDishes("signature", "不存在", {}).length, 0);
});

test("summary derives count and distinct dishes from valid quantities", () => {
  const summary = kitchen.summarize({ "basil-squid": 2, "steamed-patty": 1 });
  assert.equal(summary.count, 3);
  assert.equal(summary.kinds, 2);
  assert.equal(summary.items[0].quantity, 2);
});

function runtimeHarness() {
  const storage = {};
  const calls = { copied: "", navigation: [], notices: [], confirm: true };
  const wx = {
    getStorageSync: key => storage[key],
    setStorageSync: (key, value) => { storage[key] = value; },
    showToast: value => calls.notices.push(value),
    switchTab: value => calls.navigation.push({ type: "tab", ...value }),
    navigateTo: value => calls.navigation.push({ type: "page", ...value }),
    setClipboardData: value => { calls.copied = value.data; if (calls.copyFails) value.fail(); },
    showModal: value => value.success({ confirm: calls.confirm }),
  };
  const utilsModule = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../miniprogram/utils/kitchen.js"), "utf8"), {
    module: utilsModule, require: () => kitchen.catalog, wx,
  });
  function page(name) {
    let definition;
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, `../miniprogram/pages/${name}/index.js`), "utf8"), {
      Page: value => { definition = value; }, require: () => utilsModule.exports, wx,
    });
    const tab = { data: {}, setData(patch) { Object.assign(this.data, patch); } };
    return { ...definition, data: JSON.parse(JSON.stringify(definition.data)), tab,
      getTabBar: () => tab,
      setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    };
  }
  return { page, calls, storage };
}

test("menu -> basket -> tab return keeps quantities and the user's filter", () => {
  const h = runtimeHarness(); const menu = h.page("menu");
  menu.onShow(); assert.equal(menu.tab.data.selected, 1);
  menu.updateQuantity({ detail: { id: "basil-squid", delta: 1 } });
  menu.search({ detail: { value: "鱿" } });
  menu.openCart(); assert.equal(h.calls.navigation[0].url, "/pages/basket/index");
  const basket = h.page("basket"); basket.onShow();
  assert.equal(basket.data.cartCount, 1);
  basket.updateQuantity({ detail: { id: "steamed-patty", delta: 1 } });
  basket.copyMenu();
  assert.match(h.calls.copied, /砂煲九层塔焗鱿鱼 × 1/);
  assert.match(h.calls.copied, /鲜鱿干菇蒸肉饼 × 1/);
  menu.onShow(); assert.equal(menu.data.cartCount, 2); assert.equal(menu.data.query, "鱿");
  const profile = h.page("profile"); profile.onShow();
  assert.equal(profile.data.count, 2); assert.equal(profile.tab.data.selected, 2);
});

test("clear cancellation preserves selections; confirmation persists empty state", () => {
  const h = runtimeHarness(); const basket = h.page("basket"); basket.onShow();
  basket.updateQuantity({ detail: { id: "basil-squid", delta: 1 } });
  h.calls.confirm = false; basket.clearCart(); assert.equal(basket.data.cartCount, 1);
  h.calls.confirm = true; basket.clearCart(); assert.equal(basket.data.cartCount, 0);
  basket.onShow(); assert.equal(basket.data.cartCount, 0);
});

test("copy failure reports failure and retains the menu", () => {
  const h = runtimeHarness(); const basket = h.page("basket"); basket.onShow();
  basket.updateQuantity({ detail: { id: "basil-squid", delta: 1 } });
  h.calls.copyFails = true; basket.copyMenu();
  assert.match(h.calls.notices[0].title, /复制失败/); assert.equal(basket.data.cartCount, 1);
});

test("home and profile use tab routing while basket uses the native page stack", () => {
  const h = runtimeHarness();
  for (const name of ["index", "profile", "basket"]) h.page(name).openMenu();
  assert.ok(h.calls.navigation.every(call => call.type === "tab" && call.url === "/pages/menu/index"));
  h.page("profile").openCart(); assert.equal(h.calls.navigation[3].type, "page");
});

test("profile's saved-menu entry goes directly to picking when empty", () => {
  const h = runtimeHarness(); const profile = h.page("profile");
  profile.onShow(); profile.openSavedMenu();
  assert.equal(h.calls.navigation[0].type, "tab");
  assert.equal(h.calls.navigation[0].url, "/pages/menu/index");
  profile.setData({ count: 1 }); profile.openSavedMenu();
  assert.equal(h.calls.navigation[1].type, "page");
  assert.equal(h.calls.navigation[1].url, "/pages/basket/index");
});

test("carousel keeps captions in sync, pauses after manual selection and stops when hidden", () => {
  const h = runtimeHarness(); const home = h.page("index");
  home.onShow(); assert.equal(home.data.autoplay, true);
  home.onPosterChange({ detail: { current: 1, source: "autoplay" } });
  assert.equal(home.data.featured.id, "steamed-patty");
  assert.equal(home.data.autoplay, true);
  home.onPosterChange({ detail: { current: 2, source: "touch" } });
  assert.equal(home.data.featured.id, "bitter-melon-eggs");
  assert.equal(home.data.autoplay, false);
  home.selectPoster({ currentTarget: { dataset: { index: "3" } } });
  assert.equal(home.data.current, 3); assert.equal(home.data.featured.id, "beef-tofu");
  home.onPosterChange({ detail: { current: 99 } });
  assert.equal(home.data.current, 3);
  home.onShow(); home.onHide(); assert.equal(home.data.autoplay, false);
});

test("beef tofu is searchable, selectable and restored in the saved menu", () => {
  assert.ok(kitchen.filterDishes("homestyle", "", {}).some(dish => dish.id === "beef-tofu"));
  assert.equal(kitchen.filterDishes("seafood", "豆腐", {})[0].id, "beef-tofu");
  const h = runtimeHarness(); const menu = h.page("menu"); menu.onShow();
  menu.updateQuantity({ detail: { id: "beef-tofu", delta: 1 } });
  const basket = h.page("basket"); basket.onShow(); basket.copyMenu();
  assert.match(h.calls.copied, /牛肉烧豆腐 × 1/);
  menu.onShow(); assert.equal(menu.data.cart["beef-tofu"], 1);
  basket.updateQuantity({ detail: { id: "beef-tofu", delta: -1 } });
  assert.equal(basket.data.cartCount, 0);
});

test("a failed save does not pretend the selection was persisted", () => {
  let notified = false;
  const module = { exports: {} };
  vm.runInNewContext(
    fs.readFileSync(
      path.join(__dirname, "../miniprogram/utils/kitchen.js"),
      "utf8",
    ),
    {
      module,
      require: () => kitchen.catalog,
      wx: {
        setStorageSync() {
          throw Error("quota");
        },
        showToast() {
          notified = true;
        },
      },
    },
  );
  assert.equal(module.exports.saveCart({ "basil-squid": 1 }), false);
  assert.equal(notified, true);
});

test("dish photos and posters exist; approved monsters stay distinct and ingredient-linked", () => {
  const withMonsters = kitchen.catalog.dishes.filter(dish => dish.monster);
  assert.equal(
    new Set(withMonsters.map((dish) => dish.monster.image)).size,
    withMonsters.length,
  );
  for (const dish of kitchen.catalog.dishes) {
    if (dish.monster) assert.ok(
      dish.monster.ingredients.every((ingredient) =>
        dish.ingredients.includes(ingredient),
      ),
    );
    for (const asset of [dish.image, dish.poster, ...(dish.monster ? [dish.monster.image] : [])])
      assert.ok(fs.existsSync(path.join(__dirname, "../miniprogram", asset)));
  }
});
