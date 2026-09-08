# HY CookBook · 好好吃饭

番石榴绿 × 果肉粉的蜡笔手绘美食小程序。原生微信页面在 `miniprogram/`，以微信开发者工具中的运行效果为准。

已实现首页轮换推荐、菜名与食材搜索、分类筛选、选菜加减、购物袋、本地保存、菜单复制与“我的小厨房”。当前是本地选菜体验，不含订单提交、支付和服务端业务。价格尚未提供，默认不展示。

当前版本使用纯白背景、清晰功能字体与手绘按钮。首页为四道菜的[轮播海报](docs/implementation/home-carousel/README.md)，搭配[不同动作的手绘小人](docs/implementation/poster-poses/README.md)；菜单与已选清单统一使用[白底完整菜品图](docs/implementation/clean-food/README.md)。

## 运行

在微信开发者工具中导入仓库根目录，使用已有项目配置编译。首页入口为 `pages/index/index`。无须部署云函数；配置云环境前不会初始化云开发。

首页、菜单和“我的”使用微信官方自定义 tabBar 机制；购物袋是独立页面，支持系统返回。顶部保留微信原生导航栏与胶囊。菜单采用左侧分类、右侧原生 `scroll-view` 菜品列表，加减数量使用独立组件，底部按钮适配安全区。

`cozy-digital-menu/` 保留上一轮浏览器视觉实验。它的组件桥接器未同步本轮原生组件和路由，不作为当前功能预览或验收入口。

## 增加菜品

编辑 `miniprogram/data/catalog.js`。每道菜包含稳定 id、分类、菜单图片 `image`、首页海报 `poster` 和食材列表。当前包含砂煲九层塔焗鱿鱼、鲜鱿干菇蒸肉饼、苦瓜炒鸡蛋和牛肉烧豆腐。可选的 `monster` 配置用于“我的小厨房”食材小伙伴展示。

菜单图片位于 `miniprogram/images/food/`，轮播海报位于 `miniprogram/images/posters/`；手绘控件与三只食材小怪兽位于 `miniprogram/images/handdrawn/`。上传原图和生成大图保存在 `assets/`，不进入小程序包。海报以原照片为基础整理背景、补全器皿并添加手绘元素；菜单图片沿用已确认海报中的菜品，去掉文字和小人，完整显示餐盘。

有实际价格后，为菜品填写数字 `price` 并开启 `showPrices`。当前数量上限为每道菜 99 份，购物袋保存于当前设备。

## 检查

```sh
node --test tests/kitchen.test.cjs
node scripts/check-mini-assets.cjs
```

旧云开发演示源文件仍保留，但已从当前路由和打包中排除。`docs/design/guava-crayon-v3/home-menu-crayon.png` 是确认的设计方向；[验收记录](docs/implementation/verification.md)和 `docs/implementation/native/` 保存本轮微信模拟器截图与编译结果。

手写字体使用 Long Cang（龙藏），SIL OFL 1.1 授权见 `assets/fonts/OFL-LongCang.txt`。仅将页面所需字形作为离线字体打包，修改手写文案时需重新生成字形子集，或对新增内容使用系统字体。
