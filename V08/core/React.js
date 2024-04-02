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
// let currentRoot = null;
let deletions = [];
let wipFiber = null;

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

    if (wipRoot?.sibling?.type === nextWorkUnit?.type) {
      nextWorkUnit = null;
    }

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

  children?.forEach((child, index) => {
    // 当 child 是false 的时候 判断写在这里可不？目前没有发现什么情况有问题 先写在 约到问题具体解决 老师不是写在这里
    if (!child) {
      return;
    }
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
        effectTag: "placement",
      };

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

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function commitRoot() {
  commitWork(wipRoot.child);

  commitEffect();

  deletions.forEach(commitDeletion);

  wipRoot = null;

  deletions = [];
}

function commitEffect() {
  function run(fiber) {
    // debugger;
    if (!fiber) return;

    if (!fiber?.alternate) {
      // init
      fiber?.effectHooks?.forEach((effectHook) => {
        effectHook.cleanup = effectHook?.callback();
      });
    } else {
      // update
      const oldFiberEffectHooks = fiber?.alternate?.effectHooks;
      const newFiberEffectHooks = fiber?.effectHooks;

      oldFiberEffectHooks?.forEach((oldFiberEffectHook, index) => {
        const newFiberEffectHook = newFiberEffectHooks?.[index];

        const needCallback = oldFiberEffectHook?.deps.some((dep, i) => {
          return dep !== newFiberEffectHook?.deps[i];
        });

        needCallback &&
          (newFiberEffectHook.cleanup = newFiberEffectHook?.callback());
      });
    }

    run(fiber?.child);
    run(fiber?.sibling);
  }
  if (wipRoot.alternate) {
    runCleanups(wipRoot);
  }

  run(wipRoot);

  function runCleanups(fiber) {
    if (!fiber) return;
    const oldFiberEffectHooks = fiber?.alternate?.effectHooks;
    const newFiberEffectHooks = fiber?.effectHooks;

    oldFiberEffectHooks?.forEach((oldFiberEffectHook, index) => {
      const newFiberEffectHook = newFiberEffectHooks?.[index];

      const needCallback = oldFiberEffectHook?.deps.some((dep, i) => {
        return dep !== newFiberEffectHook?.deps[i];
      });

      needCallback && oldFiberEffectHook?.cleanup?.();
    });

    // fiber?.alternate?.effectHooks?.forEach((effectHook) => {
    //   effectHook.cleanup && effectHook?.cleanup();
    // });

    runCleanups(fiber.child);
    runCleanups(fiber.sibling);
  }
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let domParent = fiber.parent;
    while (!domParent?.dom) {
      domParent = domParent?.parent;
    }
    domParent.dom?.removeChild(fiber.dom);
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

  if (fiber.effectTag === "placement") {
    fiber.dom && domParent.dom.append(fiber.dom);
  } else if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateFunctionComponent(fiber) {
  // 初始化 useState
  stateHooks = [];
  stateHooksIndex = 0;

  // 初始化 useEffect
  effectHooks = [];
  effectHookIndex = 0;

  wipFiber = fiber;
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

let stateHooks = [];
let stateHooksIndex = 0;
function useState(initial) {
  const currentFiber = wipFiber;
  const oldFiber = currentFiber.alternate;
  const initialState = {
    state: oldFiber ? oldFiber.stateHooks[stateHooksIndex].state : initial,
    queue: oldFiber ? oldFiber.stateHooks[stateHooksIndex].queue : [],
  };

  stateHooksIndex++;
  stateHooks.push(initialState);

  currentFiber.stateHooks = stateHooks;

  initialState.queue.forEach((action) => {
    initialState.state = action(initialState.state);
  });

  initialState.queue = [];

  function setState(action) {
    const newState =
      typeof action === "function" ? action(initialState.state) : action;

    if (newState === initialState.state) return;

    initialState.queue.push(
      typeof action === "function" ? action : () => action
    );

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextWorkUnit = wipRoot;
  }

  return [initialState.state, setState];
}

let effectHooks = null;
let effectHookIndex = 0;
function useEffect(callback, deps) {
  const currentFiber = wipFiber;

  const effectHook = {
    callback,
    deps,
    cleanup: currentFiber.alternate
      ? currentFiber.alternate.effectHooks[effectHookIndex].cleanup
      : null,
  };

  effectHooks.push(effectHook);

  currentFiber.effectHooks = effectHooks;
}

const React = {
  useEffect,
  useState,
  render,
  createElement,
};

export { createElement };

export default React;
