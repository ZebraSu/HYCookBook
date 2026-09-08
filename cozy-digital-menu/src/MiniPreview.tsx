import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import catalogSource from "../../miniprogram/data/catalog.js?raw";
import kitchenSource from "../../miniprogram/utils/kitchen.js?raw";
import homeSource from "../../miniprogram/pages/index/index.js?raw";
import menuSource from "../../miniprogram/pages/menu/index.js?raw";
import profileSource from "../../miniprogram/pages/profile/index.js?raw";
import homeTemplate from "../../miniprogram/pages/index/index.wxml?raw";
import menuTemplate from "../../miniprogram/pages/menu/index.wxml?raw";
import profileTemplate from "../../miniprogram/pages/profile/index.wxml?raw";
import navTemplate from "../../miniprogram/components/kitchen-nav/index.wxml?raw";
import navSource from "../../miniprogram/components/kitchen-nav/index.js?raw";
import fontStyle from "../../miniprogram/styles/hand-font.wxss?raw";
import textureStyle from "../../miniprogram/styles/crayon-fill.wxss?raw";
import commonStyle from "../../miniprogram/app.wxss?raw";
import homeStyle from "../../miniprogram/pages/index/index.wxss?raw";
import menuStyle from "../../miniprogram/pages/menu/index.wxss?raw";
import profileStyle from "../../miniprogram/pages/profile/index.wxss?raw";
import navStyle from "../../miniprogram/components/kitchen-nav/index.wxss?raw";

// This preview renders the actual WXML/WXSS and executes the native Page logic.
// It is a local review surface, not a replacement for WeChat device validation.
type Scope = Record<string, any>;
const catalogModule = { exports: {} as Scope };
Function("module", catalogSource)(catalogModule);
const catalog = catalogModule.exports;
const pages = {
  "/": { source: homeSource, template: homeTemplate, style: homeStyle },
  "/menu": { source: menuSource, template: menuTemplate, style: menuStyle },
  "/profile": {
    source: profileSource,
    template: profileTemplate,
    style: profileStyle,
  },
};
function expression(source: string, scope: Scope) {
  return Function(
    ...Object.keys(scope),
    `return (${source});`,
  )(...Object.values(scope));
}
function interpolate(value: string, scope: Scope): any {
  const whole = value.match(/^{{([\s\S]*?)}}$/);
  if (whole) return expression(whole[1], scope);
  return value.replace(/{{([\s\S]*?)}}/g, (_, code) =>
    String(expression(code, scope) ?? ""),
  );
}
function parse(template: string) {
  const xml = new DOMParser().parseFromString(
    `<root xmlns:wx="urn:wx">${template.replace(/\b(wx:else|scroll-y)(?=\s|>)/g, '$1=""').replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;")}</root>`,
    "text/xml",
  );
  if (xml.querySelector("parsererror"))
    throw new Error(
      xml.querySelector("parsererror")!.textContent || "WXML parse error",
    );
  return xml.documentElement;
}
function units(value: string) {
  return value.replace(/(-?[\d.]+)rpx/g, "calc($1 * var(--rpx))");
}
function css(source: string) {
  return units(
    source
      .replace(/@import[^;]+;/g, "")
      .replace(/\bpage\s*{/g, ".mini-page{")
      .replace(/\bimage\b/g, "img")
      .replace(/\bview\b/g, "div")
      .replace(/\btext\b(?=\s*[,>{])/g, "span"),
  );
}
function styleObject(value: string) {
  return Object.fromEntries(
    value
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const i = part.indexOf(":");
        return [
          part
            .slice(0, i)
            .trim()
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
          units(part.slice(i + 1).trim()),
        ];
      }),
  );
}
function route(url: string) {
  return url.includes("/profile/")
    ? "/profile"
    : url.includes("/menu/")
      ? "/menu"
      : "/";
}
const parsedNav = parse(navTemplate);
function children(
  parent: Element,
  scope: Scope,
  handlers: Scope,
  wx: Scope,
): React.ReactNode[] {
  let branchMatched = false;
  return Array.from(parent.childNodes).map((node, index) => {
    if (node.nodeType === 3) return interpolate(node.textContent || "", scope);
    if (node.nodeType !== 1) return null;
    const el = node as Element;
    const ifValue = el.getAttribute("wx:if");
    if (ifValue !== null) {
      branchMatched = !!interpolate(ifValue, scope);
      if (!branchMatched) return null;
    } else if (el.hasAttribute("wx:else")) {
      if (branchMatched) return null;
    } else if (el.hasAttribute("wx:elif")) {
      if (branchMatched) return null;
      branchMatched = !!interpolate(el.getAttribute("wx:elif")!, scope);
      if (!branchMatched) return null;
    } else branchMatched = false;
    const items = el.getAttribute("wx:for");
    if (items !== null)
      return (interpolate(items, scope) || []).map((item: Scope, i: number) =>
        render(
          el,
          { ...scope, item, index: i },
          handlers,
          wx,
          item[el.getAttribute("wx:key") || "id"] || i,
        ),
      );
    return render(el, scope, handlers, wx, index);
  });
}
function render(
  el: Element,
  scope: Scope,
  handlers: Scope,
  wx: Scope,
  key: string | number,
): React.ReactNode {
  const name = el.tagName;
  if (name === "block")
    return (
      <React.Fragment key={key}>
        {children(el, scope, handlers, wx)}
      </React.Fragment>
    );
  if (name === "kitchen-nav") {
    let component: Scope = {};
    Function(
      "Component",
      "wx",
      navSource,
    )((value: Scope) => {
      component = value;
    }, wx);
    const data = {
      active: interpolate(el.getAttribute("active") || "home", scope),
    };
    const instance = { data, ...component.methods };
    const methods = Object.fromEntries(
      Object.keys(component.methods).map((k) => [
        k,
        component.methods[k].bind(instance),
      ]),
    );
    return (
      <div className="kitchen-nav" key={key}>
        {children(parsedNav, data, methods, wx)}
      </div>
    );
  }
  const type =
    (
      { view: "div", text: "span", image: "img", "scroll-view": "div" } as Scope
    )[name] || name;
  const props: Scope = { key };
  const dataset: Scope = {};
  Array.from(el.attributes).forEach((attr) => {
    const name = attr.name;
    const value = interpolate(attr.value, scope);
    if (name.startsWith("data-")) {
      dataset[name.slice(5)] = value;
      props[name] = value;
    } else if (name === "class") props.className = value;
    else if (name === "style") props.style = styleObject(String(value));
    else if (name === "disabled") props.disabled = !!value;
    else if (
      [
        "src",
        "role",
        "value",
        "placeholder",
        "aria-label",
        "aria-modal",
      ].includes(name)
    )
      props[name] = value;
    else if (name === "maxlength") props.maxLength = Number(value);
  });
  if (name === "image") {
    props.alt = props["aria-label"] || "";
    props.style = {
      ...props.style,
      objectFit: el.getAttribute("mode") === "aspectFit" ? "contain" : "cover",
    };
  }
  if (name === "button") props.type = "button";
  if (name === "scroll-view")
    props.style = { ...props.style, overflowY: "auto" };
  const tap = el.getAttribute("bindtap") || el.getAttribute("catchtap");
  if (tap)
    props.onClick = () => handlers[tap]?.({ currentTarget: { dataset } });
  const input = el.getAttribute("bindinput");
  if (input)
    props.onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
      handlers[input]?.({ detail: { value: event.target.value } });
  const error = el.getAttribute("binderror");
  if (error) props.onError = () => handlers[error]?.({});
  if (["img", "input"].includes(type)) return React.createElement(type, props);
  return React.createElement(type, props, children(el, scope, handlers, wx));
}

export default function MiniPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = pages[location.pathname as keyof typeof pages] || pages["/"];
  const [data, setData] = useState<Scope | null>(null);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<Scope | null>(null);
  const runtime = useRef<{ handlers: Scope; wx: Scope } | null>(null);
  useEffect(() => {
    setData(null);
    let alive = true;
    const wx: Scope = {
      getWindowInfo: () => ({
        statusBarHeight: 24,
        windowWidth: Math.min(window.innerWidth, 430),
      }),
      getMenuButtonBoundingClientRect: () => ({
        top: 30,
        height: 30,
        left: Math.min(window.innerWidth, 430) - 98,
      }),
      getStorageSync: (key: string) =>
        JSON.parse(localStorage.getItem(key) || "{}"),
      setStorageSync: (key: string, value: unknown) =>
        localStorage.setItem(key, JSON.stringify(value)),
      navigateTo: ({ url }: Scope) => navigate(route(url)),
      redirectTo: ({ url }: Scope) => navigate(route(url), { replace: true }),
      navigateBack: ({ fail }: Scope) => {
        if (window.history.state?.idx > 0) navigate(-1);
        else fail?.();
      },
      showToast: ({ title }: Scope) => {
        setToast(title);
      },
      showModal: (options: Scope) => setModal(options),
      setClipboardData: async ({ data, success }: Scope) => {
        try {
          await navigator.clipboard.writeText(data);
          success?.();
        } catch {
          setToast("请允许浏览器访问剪贴板后再试");
        }
      },
    };
    const module = { exports: {} as Scope };
    Function(
      "require",
      "module",
      "wx",
      kitchenSource,
    )(() => catalog, module, wx);
    let instance: Scope = {};
    Function(
      "Page",
      "require",
      "wx",
      current.source,
    )(
      (page: Scope) => {
        instance = page;
      },
      () => module.exports,
      wx,
    );
    instance.data = { ...instance.data };
    instance.setData = (patch: Scope) => {
      Object.assign(instance.data, patch);
      if (alive) setData({ ...instance.data });
    };
    const handlers = Object.fromEntries(
      Object.entries(instance)
        .filter(([, v]) => typeof v === "function")
        .map(([k, v]) => [k, (v as Function).bind(instance)]),
    );
    runtime.current = { handlers, wx };
    handlers.onLoad?.();
    handlers.onShow?.();
    setData({ ...instance.data });
    window.scrollTo(0, 0);
    return () => {
      alive = false;
    };
  }, [current, navigate]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(timer);
  }, [toast]);
  const tree = parse(current.template);
  return (
    <>
      <style>
        {fontStyle + css(textureStyle + commonStyle + current.style + navStyle)}
      </style>
      <div className="mini-page">
        <div className="preview-status" aria-hidden="true">
          <span>9:41</span>
          <span>▂▄▆ ▰</span>
        </div>
        <div className="preview-capsule" aria-hidden="true">
          ••• <i /> ◉
        </div>
        {data &&
          runtime.current &&
          children(tree, data, runtime.current.handlers, runtime.current.wx)}
        {toast && (
          <div className="preview-toast" role="status">
            {toast}
          </div>
        )}
        {modal && (
          <div className="preview-modal-backdrop">
            <div
              className="preview-modal"
              role="alertdialog"
              aria-label={modal.title}
            >
              <h3>{modal.title}</h3>
              <p>{modal.content}</p>
              <div>
                <button
                  onClick={() => {
                    modal.success?.({ confirm: false });
                    setModal(null);
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    modal.success?.({ confirm: true });
                    setModal(null);
                  }}
                >
                  {modal.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
