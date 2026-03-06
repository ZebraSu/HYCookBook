const DISHES = [
  {
    id: 1,
    category: "signature",
    name: "Truffle Risotto",
    description: "Arborio rice, black truffle, rich parmesan cheese",
    price: "$24.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0BlUs3IJI-2tX6w8bd2e44uQZ_L1wwQJ3h3TCPZuJbeVICYsQBZiluIcKQlEgVuiCtY_WNtLYtAZW2AwsAP_MNfEm484oLK1ln0lV03ELxGF1w5gL31HkqJXmp0IhBtA_XjQEk0hz__qnkeQs3p0mPdJZbkZMO2HDn-Tp88vlqVlkOz0bMYBfC0p_dQcw4pQu-fX2stNAcbJR9R7qYgPdA4SuHqmgCOR2TtNDDH175Ni6UeqRukLY-uyQ6WRaIVULD7ldeiUacg",
  },
  {
    id: 2,
    category: "desserts",
    name: "Matcha Mille Crepe",
    description: "20 delicate layers with fresh Hokkaido cream",
    price: "$12.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-U3XX0-RrU8mRxBWuT2sF-xU3lwnwiNAxbFgOWBbO3fX1VBzs-HKMsWlg4npHebIae9J7w9BeM1bVUPLSghabv0t3LK2xPDpjrpItLGdH4dL7nyH17vwKcnlTE0b_HHkQ3QqnZJyeV7EaL9aHE1P7yFDA7yK88JdzNSs1_O0tj53FYjY9JUZpahPX8TfVcqPbI7C4L-9TxvrqCnyOLFUPiKJPjBOFKGK6Gcf4cWGNahrvLKH7o0catZDz0KfL7hKpSV1SwimpKQ",
  },
  {
    id: 3,
    category: "signature",
    name: "Rose Latte",
    description: "Premium espresso, steamed milk, delicate rose syrup",
    price: "$7.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKFacFgPY-svHn6y1IADkIp6dvWzjuTGgxspcmZ3lts6Us95qRGNDhMQgcPnczLUwE-XbkDu21q17OaO0VriOrS5p4SXJQeC3U_i1SO7ZOnXmLIxumbk0MYnJ_Bq2cjERHp17tvd50ABxFsvvR0fCtFWuk1QKYUxAZ3k7uAZLz0PYlH1HD-oZ3Rmm5yccY0AKY5urla9P_oFaUoXUQNY2_ypwDUVyaNAvyAyKFh2Z6wjoO239VezjGDtLKlz3zE1DaKMIf7BZfdg",
  },
  {
    id: 4,
    category: "appetizers",
    name: "Citrus Burrata",
    description: "Creamy burrata, citrus pearls, olive oil sourdough",
    price: "$14.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0BlUs3IJI-2tX6w8bd2e44uQZ_L1wwQJ3h3TCPZuJbeVICYsQBZiluIcKQlEgVuiCtY_WNtLYtAZW2AwsAP_MNfEm484oLK1ln0lV03ELxGF1w5gL31HkqJXmp0IhBtA_XjQEk0hz__qnkeQs3p0mPdJZbkZMO2HDn-Tp88vlqVlkOz0bMYBfC0p_dQcw4pQu-fX2stNAcbJR9R7qYgPdA4SuHqmgCOR2TtNDDH175Ni6UeqRukLY-uyQ6WRaIVULD7ldeiUacg",
  },
  {
    id: 5,
    category: "mains",
    name: "Brown Butter Salmon",
    description: "Pan-seared salmon, whipped potato, caper butter",
    price: "$28.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKFacFgPY-svHn6y1IADkIp6dvWzjuTGgxspcmZ3lts6Us95qRGNDhMQgcPnczLUwE-XbkDu21q17OaO0VriOrS5p4SXJQeC3U_i1SO7ZOnXmLIxumbk0MYnJ_Bq2cjERHp17tvd50ABxFsvvR0fCtFWuk1QKYUxAZ3k7uAZLz0PYlH1HD-oZ3Rmm5yccY0AKY5urla9P_oFaUoXUQNY2_ypwDUVyaNAvyAyKFh2Z6wjoO239VezjGDtLKlz3zE1DaKMIf7BZfdg",
  },
  {
    id: 6,
    category: "desserts",
    name: "Velvet Chocolate Tart",
    description: "Dark cocoa ganache with creme fraiche and berries",
    price: "$13.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-U3XX0-RrU8mRxBWuT2sF-xU3lwnwiNAxbFgOWBbO3fX1VBzs-HKMsWlg4npHebIae9J7w9BeM1bVUPLSghabv0t3LK2xPDpjrpItLGdH4dL7nyH17vwKcnlTE0b_HHkQ3QqnZJyeV7EaL9aHE1P7yFDA7yK88JdzNSs1_O0tj53FYjY9JUZpahPX8TfVcqPbI7C4L-9TxvrqCnyOLFUPiKJPjBOFKGK6Gcf4cWGNahrvLKH7o0catZDz0KfL7hKpSV1SwimpKQ",
  },
];

const CATEGORIES = [
  { key: "signature", label: "Signature", icon: "star", heading: "Signature Dishes" },
  { key: "appetizers", label: "Appetizers", icon: "utensils", heading: "Appetizers" },
  { key: "mains", label: "Mains", icon: "utensils", heading: "Mains" },
  { key: "desserts", label: "Desserts", icon: "cake", heading: "Desserts" },
];

Page({
  data: {
    categories: CATEGORIES,
    activeCategory: "signature",
    sectionTitle: "Signature Dishes",
    dishes: [],
    cartCount: 2,
    navMetrics: {
      statusBarHeight: 20,
      navBarHeight: 44,
      totalHeight: 64,
      capsuleReservedWidth: 120,
      horizontalPadding: 16,
    },
  },

  onLoad() {
    this.setData({
      navMetrics: this.getNavMetrics(),
    });
    this.syncDishes("signature");
  },

  getNavMetrics() {
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const menuButton = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : null;

    const statusBarHeight = systemInfo.statusBarHeight || 20;
    const fallbackGap = 8;
    const fallbackHeight = 32;
    const menuTop = menuButton?.top || statusBarHeight + fallbackGap;
    const menuHeight = menuButton?.height || fallbackHeight;
    const verticalGap = menuTop - statusBarHeight;
    const navBarHeight = verticalGap * 2 + menuHeight;

    return {
      statusBarHeight,
      navBarHeight,
      totalHeight: statusBarHeight + navBarHeight,
      capsuleReservedWidth: menuButton ? systemInfo.windowWidth - menuButton.left + 16 : 120,
      horizontalPadding: 16,
    };
  },

  syncDishes(categoryKey) {
    const currentCategory = CATEGORIES.find((item) => item.key === categoryKey) || CATEGORIES[0];
    this.setData({
      activeCategory: currentCategory.key,
      sectionTitle: currentCategory.heading,
      dishes: DISHES.filter((item) => item.category === currentCategory.key),
    });
  },

  selectCategory(event) {
    const { key } = event.currentTarget.dataset;
    if (!key || key === this.data.activeCategory) {
      return;
    }
    this.syncDishes(key);
  },

  addToCart() {
    const nextCount = this.data.cartCount + 1;
    this.setData({ cartCount: nextCount });
    wx.showToast({
      title: "Added",
      icon: "success",
    });
  },

  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.reLaunch({
          url: "/pages/index/index",
        });
      },
    });
  },

  previewCart() {
    wx.showToast({
      title: `Cart ${this.data.cartCount}`,
      icon: "none",
    });
  },
});
