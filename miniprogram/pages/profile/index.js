const kitchen = require('../../utils/kitchen');
Page({
  data: { dishes: kitchen.catalog.dishes.filter(dish => dish.monster), count: 0, kinds: 0 },
  onShow() {
    kitchen.syncTab(this, 2);
    const summary = kitchen.summarize(kitchen.loadCart());
    this.setData({ count: summary.count, kinds: summary.kinds });
  },
  openSavedMenu() {
    if (this.data.count) this.openCart();
    else this.openMenu();
  },
  openCart() { wx.navigateTo({ url: '/pages/basket/index' }); },
  openMenu() { wx.switchTab({ url: '/pages/menu/index' }); }
});
