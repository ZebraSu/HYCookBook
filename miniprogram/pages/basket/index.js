const kitchen = require('../../utils/kitchen');
Page({
  data: { cart: {}, cartItems: [], cartCount: 0, cartKinds: 0 },
  onShow() { this.refresh(kitchen.loadCart()); },
  refresh(cart) {
    const summary = kitchen.summarize(cart);
    this.setData({ cart, cartItems: summary.items, cartCount: summary.count, cartKinds: summary.kinds });
  },
  updateQuantity(event) {
    const { id, delta } = event.detail;
    const next = kitchen.changeQuantity(this.data.cart, id, Number(delta));
    if (kitchen.saveCart(next)) this.refresh(next);
  },
  clearCart() {
    if (!this.data.cartCount) return;
    wx.showModal({ title: '清空已选菜品？', content: '清空后可以重新挑选。', confirmText: '清空', confirmColor: '#527A4B',
      success: result => { if (result.confirm && kitchen.saveCart({})) this.refresh({}); } });
  },
  copyMenu() {
    if (!this.data.cartCount) return;
    wx.setClipboardData({ data: kitchen.menuText(this.data.cart),
      fail() { wx.showToast({ title: '复制失败，请再试一次', icon: 'none' }); } });
  },
  openMenu() { wx.switchTab({ url: '/pages/menu/index' }); }
});
