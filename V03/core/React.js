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

const render = (App, container) => {
  nextWorkUnit = {
    dom: container,
    props: { children: [App] },
  };
};

let nextWorkUnit = null;
function workLoop(idleDeadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performWorkOfUnit(nextWorkUnit);
    shouldYield = idleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function createDom(fiber) {
  // 1、生成 dom
  const dom = (fiber.dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type));
}

function updateProps(props, dom) {
  // 2、 处理props
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  let preChild = null;
  fiber.props.children?.forEach((child, index) => {
    const nextFiber = {
      type: child.type,
      props: child.props,
      dom: null,
      parent: fiber,
      child: null,
      sibling: null,
    };

    if (index === 0) {
      fiber.child = nextFiber;
    } else {
      preChild.sibling = nextFiber;
    }
    preChild = nextFiber;
  });
}

function performWorkOfUnit(fiber) {
  fiber && console.log("fiber", fiber);
  // 1、生成 dom
  if (!fiber.dom) {
    createDom(fiber);

    fiber.parent.dom.append(fiber.dom);

    updateProps(fiber.props, fiber.dom);
  }

  // 3、 转化为链表
  initChildren(fiber);

  // 4、 返回下一个work
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }

  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export { createElement };

export default React;
