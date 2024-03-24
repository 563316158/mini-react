let task = 0;
function workLoop(idleDeadline) {


  let shouldYield = false;

  while (!shouldYield) {
    console.log(`task ${task}`);
    // console.log(idleDeadline.timeRemaining());


    shouldYield = idleDeadline.timeRemaining() < 1;
  }
  task++;
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
