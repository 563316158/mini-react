/**
 * vdom 写死，dom 写死；
 */
// const element = document.createElement("div");
// element.id = "app";
// document.querySelector("#root").append(element);

// const textElement = document.createTextNode("");
// textElement.nodeValue = "app";
// element.append(textElement);

/**
 * main.js vdom 动态生成，dom 写死；
 */

// 数据结构设计  vdom 是一个 js object，思考里面有什么属性
// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "app",
//     children: [],
//   },
// };

// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [textEl],
//   },
// };

// const element = document.createElement(el.type);
// element.id = el.props.id;
// document.querySelector("#root").append(element);

// const textElement = document.createTextNode("");
// textElement.nodeValue = textEl.props.nodeValue;
// element.append(textElement);

// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props: {
//       ...props,
//       children,
//     },
//   };
// };

// const createElementText = (nodeValue) => {
//   return {
//     type: "TEXT_ELEMENT",
//     props: {
//       nodeValue,
//       children: [],
//     },
//   };
// };

// const textEl = createElementText("app");
// const App = createElement("div", { id: "app" }, textEl);

// const element = document.createElement(App.type);
// element.id = App.props.id;
// document.querySelector("#root").append(element);

// const textElement = document.createTextNode("");
// textElement.nodeValue = textEl.props.nodeValue;
// element.append(textElement);

// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map((child) => {
//        return typeof child === "string" ? createElementText(child) : child;
//       }),
//     },
//   };
// };

// const createElementText = (nodeValue) => {
//   return {
//     type: "TEXT_ELEMENT",
//     props: {
//       nodeValue,
//       children: [],
//     },
//   };
// };


// const App = createElement("div", { id: "app" }, "app");

// const render = (App, container) => {
//   const dom =
//     App.type === "TEXT_ELEMENT"
//       ? document.createTextNode(App.type)
//       : document.createElement(App.type);

//   // 处理props
//   Object.keys(App.props).forEach((key) => {
//     if (key !== "children") {
//       dom[key] = App.props[key];
//     }
//   });

//   // 处理children
//   App.props.children?.forEach((child) => {
//     render(child, dom);
//   });
//   container.append(dom);
// };

// render(App, document.querySelector("#root"));

import ReactDom from "./core/ReactDom.js";
import App from "./App.js";

ReactDom.createRoot(document.querySelector("#root")).render(App);
