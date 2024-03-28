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

let wipRoot = null;
let currentRoot = null;
let deletions = [];
const render = (App, container) => {
  wipRoot = {
    dom: container,
    props: { children: [App] },
  };

  nextWorkUnit = wipRoot;
};

let nextWorkUnit = null;
function workLoop(idleDeadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performWorkOfUnit(nextWorkUnit);
    shouldYield = idleDeadline.timeRemaining() < 1;
  }

  if (!nextWorkUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function createDom(type) {
  // 1、生成 dom
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, preProps) {
  // 1、新的没有 旧的有  删除
  Object.keys(preProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2、新的有 旧的没有 新增
  // 3、旧的和新的都有 但是不同 更新
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== preProps[key]) {
        if (key.startsWith("on")) {
          const eventName = key.slice(2).toLowerCase();
          if (preProps[key]) {
            dom.removeEventListener(eventName, preProps[key]);
          }
          dom.addEventListener(eventName, nextProps[key]);
        }
        dom[key] = nextProps[key];
      }
    }
  });
}

function initChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let preChild = null;

  // console.log("children", children);

  children?.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let nextFiber = null;
    if (isSameType) {
      // update
      nextFiber = {
        type: child.type,
        props: child.props,
        dom: oldFiber.dom,
        parent: fiber,
        child: null,
        sibling: null,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      // create
      nextFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        parent: fiber,
        child: null,
        sibling: null,
        effectTag: "create",
      };

      // console.log("oldFiber1", oldFiber);

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = nextFiber;
    } else {
      preChild.sibling = nextFiber;
    }
    preChild = nextFiber;
  });

  console.log("oldFiber2", oldFiber);

  console.log("deletions", deletions);
}

function commitRoot() {
  commitWork(wipRoot.child);

  deletions.forEach(commitDeletion);

  currentRoot = wipRoot;
  wipRoot = null;

  deletions = [];
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let domParent = fiber.parent;
    while (!domParent?.dom) {
      domParent = domParent?.parent;
    }
    domParent.dom?.removeChild(fiber.dom);

    // let nextFiber = fiber;
    // while (nextFiber) {
    //   if (nextFiber.parent?.dom) {
    //     nextFiber.parent?.dom?.removeChild(fiber.dom);
    //     break;
    //   }
    //   nextFiber = nextFiber.parent;
    // }
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) return;

  let domParent = fiber.parent;
  while (!domParent?.dom) {
    domParent = domParent?.parent;
  }

  if (fiber.effectTag === "create") {
    fiber.dom && domParent.dom.append(fiber.dom);
  } else if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateFunctionComponent(fiber) {
  console.log("fiber.type", fiber.type);
  const children = [fiber.type(fiber.props)];
  // 3、 转化为链表
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const ifFunctionComponent = typeof fiber.type === "function";

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

const update = () => {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };

  nextWorkUnit = wipRoot;
};

const React = {
  update,
  render,
  createElement,
};

export { createElement };

export default React;
