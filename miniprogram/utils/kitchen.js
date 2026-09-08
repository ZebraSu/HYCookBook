const catalog = require("../data/catalog");
const STORAGE_KEY = "hy-cookbook.cart.v1";

function sanitizeCart(value) {
  const result = {};
  if (!value || typeof value !== "object" || Array.isArray(value))
    return result;
  catalog.dishes.forEach((dish) => {
    const quantity = value[dish.id];
    if (
      typeof quantity === "number" &&
      Number.isFinite(quantity) &&
      quantity > 0
    ) {
      result[dish.id] = Math.min(99, Math.floor(quantity));
      if (!result[dish.id]) delete result[dish.id];
    }
  });
  return result;
}

function changeQuantity(cart, id, delta) {
  const next = sanitizeCart(cart);
  if (!catalog.dishes.some((dish) => dish.id === id)) return next;
  if (delta !== 1 && delta !== -1) return next;
  const quantity = Math.max(0, Math.min(99, (next[id] || 0) + delta));
  if (quantity) next[id] = quantity;
  else delete next[id];
  return next;
}

function summarize(cart) {
  const clean = sanitizeCart(cart);
  const items = catalog.dishes
    .filter((dish) => clean[dish.id])
    .map((dish) => ({
      ...dish,
      quantity: clean[dish.id],
    }));
  return {
    items,
    count: items.reduce((sum, dish) => sum + dish.quantity, 0),
    kinds: items.length,
  };
}

function filterDishes(category, query, cart) {
  const term = String(query || "")
    .trim()
    .toLowerCase();
  const clean = sanitizeCart(cart);
  // Searching spans the entire kitchen; category selection resumes when cleared.
  return catalog.dishes
    .filter((dish) =>
      term
        ? [dish.name, dish.description, ...dish.ingredients]
            .join(" ")
            .toLowerCase()
            .includes(term)
        : dish.categories.includes(category),
    )
    .map((dish) => ({ ...dish, quantity: clean[dish.id] || 0 }));
}

function loadCart() {
  try {
    return sanitizeCart(wx.getStorageSync(STORAGE_KEY));
  } catch (error) {
    return {};
  }
}

function saveCart(cart) {
  const clean = sanitizeCart(cart);
  try {
    wx.setStorageSync(STORAGE_KEY, clean);
    return true;
  } catch (error) {
    wx.showToast({ title: "暂时没能保存，请再试一次", icon: "none" });
    return false;
  }
}

function syncTab(page, selected) {
  const tab = typeof page.getTabBar === "function" && page.getTabBar();
  if (tab && typeof tab.setData === "function") tab.setData({ selected });
}

function menuText(cart) {
  return "今天的菜单\n" + summarize(cart).items.map(dish => `${dish.name} × ${dish.quantity}`).join("\n");
}

module.exports = {
  catalog,
  sanitizeCart,
  changeQuantity,
  summarize,
  filterDishes,
  loadCart,
  saveCart,
  syncTab,
  menuText,
};
