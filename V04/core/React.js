const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isText = typeof child === "string" || typeof child === "number";
        return isText ? createElementText(child) : child;
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

let root = null;

const render = (App, container) => {
  nextWorkUnit = {
    dom: container,
    props: { children: [App] },
  };

  root = nextWorkUnit;
};

let nextWorkUnit = null;
function workLoop(idleDeadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performWorkOfUnit(nextWorkUnit);
    shouldYield = idleDeadline.timeRemaining() < 1;
  }

  if (!nextWorkUnit && root) {
    console.log("root", root);
    commitRoot();
    root = null;
  }

  requestIdleCallback(workLoop);
}

function createDom(type) {
  // 1、生成 dom
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber, children) {
  let preChild = null;
  children?.forEach((child, index) => {
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

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;

  let domParent = fiber.parent;
  while (!domParent?.dom) {
    domParent = domParent?.parent;
  }

  fiber.dom && domParent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  // 3、 转化为链表
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const ifFunctionComponent = typeof fiber.type === "function";
  let children = [];
  if (ifFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4、 返回下一个work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber?.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export { createElement };

export default React;
