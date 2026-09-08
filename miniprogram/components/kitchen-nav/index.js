Component({
  properties: { active: { type: String, value: "home" } },
  methods: {
    go(event) {
      const key = event.currentTarget.dataset.key;
      if (key === this.data.active) return;
      const routes = {
        home: "/pages/index/index",
        menu: "/pages/menu/index",
        profile: "/pages/profile/index",
      };
      wx.redirectTo({ url: routes[key] });
    },
  },
});
