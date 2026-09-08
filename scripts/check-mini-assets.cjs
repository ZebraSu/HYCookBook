const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "../miniprogram");
const project = require("../project.config.json");
const app = require("../miniprogram/app.json");
const catalog = require("../miniprogram/data/catalog");
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    );
const matches = (file, rule) =>
  rule.type === "folder"
    ? file.startsWith(rule.value + "/")
    : rule.type === "file" && file === rule.value;
let bytes = 0;
function checkAsset(asset) {
  const file = asset.replace(/^\//, "");
  if (!fs.existsSync(path.join(root, file))) throw Error(`Missing asset: ${asset}`);
  const included = project.packOptions.include.some(rule => matches(file, rule));
  const ignored = project.packOptions.ignore.some(rule => matches(file, rule));
  if (ignored && !included) throw Error(`Referenced asset excluded from package: ${asset}`);
}
for (const dish of catalog.dishes) {
  for (const asset of [dish.image, dish.poster, dish.monster && dish.monster.image].filter(Boolean)) checkAsset(asset);
}
for (const absolute of walk(root)) {
  const file = path.relative(root, absolute).split(path.sep).join("/");
  const included = project.packOptions.include.some((rule) =>
    matches(file, rule),
  );
  const ignored = project.packOptions.ignore.some((rule) =>
    matches(file, rule),
  );
  if (ignored && !included) continue;
  bytes += fs.statSync(absolute).size;
  if (file.endsWith(".js"))
    new vm.Script(fs.readFileSync(absolute, "utf8"), { filename: file });
  if (file.endsWith(".json")) JSON.parse(fs.readFileSync(absolute, "utf8"));
  if (file.endsWith(".wxml")) {
    const source = fs.readFileSync(absolute, "utf8");
    for (const [, asset] of source.matchAll(/src="(\/[^"{}]+)"/g)) {
      checkAsset(asset);
    }
  }
  if (
    file.endsWith(".wxss") &&
    /url\(['"]?\//.test(fs.readFileSync(absolute, "utf8"))
  )
    throw Error(`Local WXSS background URL in ${file}`);
}
for (const route of app.pages) {
  for (const ext of [".js", ".json", ".wxml", ".wxss"])
    if (!fs.existsSync(path.join(root, route + ext)))
      throw Error(`Missing page ${route + ext}`);
}
if (bytes >= 2 * 1024 * 1024)
  throw Error(`Main package source exceeds budget: ${bytes}`);
console.log(
  `Page routes, JS/JSON syntax, local image references and background URLs passed. Packaged source: ${(bytes / 1024).toFixed(1)} KiB (before WeChat compilation).`,
);
