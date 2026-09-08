const kitchen = require('../../utils/kitchen');
Page({
  data: {
    categories: kitchen.catalog.categories, activeCategory: 'signature', query: '',
    sectionTitle: '招牌好味', sectionNote: '厨房认真推荐', dishes: [],
    cart: {}, cartCount: 0, cartKinds: 0, showPrices: kitchen.catalog.showPrices, scrollTop: 0
  },
  onShow() { kitchen.syncTab(this, 1); this.refresh(kitchen.loadCart()); },
  refresh(cart) {
    const summary = kitchen.summarize(cart);
    const category = kitchen.catalog.categories.find(item => item.id === this.data.activeCategory) || kitchen.catalog.categories[0];
    const dishes = kitchen.filterDishes(category.id, this.data.query, cart);
    this.setData({ cart, dishes, cartCount: summary.count, cartKinds: summary.kinds,
      sectionTitle: this.data.query.trim() ? '找到的好味' : category.title,
      sectionNote: this.data.query.trim() ? `共找到 ${dishes.length} 道菜` : category.note });
  },
  resetScroll() {
    // Change the binding even when the previous requested position was zero.
    this.setData({ scrollTop: 1 }, () => this.setData({ scrollTop: 0 }));
  },
  selectCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.id, query: '' });
    this.refresh(this.data.cart); this.resetScroll();
  },
  search(event) { this.setData({ query: event.detail.value }); this.refresh(this.data.cart); this.resetScroll(); },
  clearSearch() { this.setData({ query: '' }); this.refresh(this.data.cart); this.resetScroll(); },
  resetMenu() { this.setData({ activeCategory: 'signature', query: '' }); this.refresh(this.data.cart); this.resetScroll(); },
  updateQuantity(event) {
    const { id, delta } = event.detail;
    const next = kitchen.changeQuantity(this.data.cart, id, Number(delta));
    if (kitchen.saveCart(next)) this.refresh(next);
  },
  openCart() { wx.navigateTo({ url: '/pages/basket/index' }); }
});
