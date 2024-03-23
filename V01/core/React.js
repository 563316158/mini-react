const render = (App, container) => {
  const dom =
    App.type === "TEXT_ELEMENT"
      ? document.createTextNode(App.type)
      : document.createElement(App.type);

  // 处理props
  Object.keys(App.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = App.props[key];
    }
  });

  // 处理children
  App.props.children?.forEach((child) => {
    render(child, dom);
  });
  container.append(dom);
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createElementText(child) : child;
      }),
    },
  };
};

const createElementText = (nodeValue) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue,
      children: [],
    },
  };
};

const React = {
  render,
  createElement,
};

export { createElement };

export default React;   
