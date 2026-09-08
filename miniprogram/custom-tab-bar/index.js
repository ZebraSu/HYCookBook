Component({
  data: {
    selected: 0,
    tabs: [
      { path: '/pages/index/index', text: '首页', icon: '/images/handdrawn/home.svg' },
      { path: '/pages/menu/index', text: '菜品', icon: '/images/handdrawn/menu.svg' },
      { path: '/pages/profile/index', text: '我的', icon: '/images/handdrawn/user.svg' }
    ]
  },
  pageLifetimes: { show() { this.syncSelected(); } },
  lifetimes: { attached() { this.syncSelected(); } },
  methods: {
    syncSelected() {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const selected = this.data.tabs.findIndex(tab => page && tab.path === '/' + page.route);
      if (selected >= 0) this.setData({ selected });
    },
    switchTab(event) {
      const index = Number(event.currentTarget.dataset.index);
      const tab = this.data.tabs[index];
      if (!tab || index === this.data.selected) return;
      wx.switchTab({ url: tab.path, fail() { wx.showToast({ title: '暂时无法打开，请重试', icon: 'none' }); } });
    }
  }
});
