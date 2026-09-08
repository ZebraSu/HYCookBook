const kitchen = require('../../utils/kitchen');
const posters = kitchen.catalog.dishes.filter(dish => dish.poster);
Page({
  data: { posters, current: 0, featured: posters[0], autoplay: false },
  onShow() { kitchen.syncTab(this, 0); this.setData({ autoplay: true }); },
  onHide() { this.setData({ autoplay: false }); },
  onPosterChange(event) {
    const current = event.detail.current;
    if (!Number.isInteger(current) || !this.data.posters[current]) return;
    const patch = { current, featured: this.data.posters[current] };
    // Keep a manually chosen poster still long enough to read.
    if (event.detail.source === 'touch') patch.autoplay = false;
    this.setData(patch);
  },
  selectPoster(event) {
    const current = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(current) || !this.data.posters[current]) return;
    this.setData({ current, featured: this.data.posters[current], autoplay: false });
  },
  openMenu() { wx.switchTab({ url: '/pages/menu/index' }); },
  onShareAppMessage() { return { title: '今天也要好好吃饭 · HY CookBook', path: '/pages/index/index' }; }
});
