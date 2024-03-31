import React from "./core/React.js";

let fooCount = 0;
function Foo() {
  const callBack = React.update();
  const handleClick = () => {
    console.log("click Foo");
    fooCount++;
    callBack();
  };

  console.log("Foo");
  return (
    <div>
      Foo:{fooCount}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let barCount = 0;
function Bar() {
  const callBack = React.update();
  const handleClick = () => {
    console.log("click Bar");
    barCount++;
    callBack();
  };

  console.log("Bar");
  return (
    <div>
      Bar:{barCount}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let count = 0;
function Counter() {
  const callBack = React.update();
  const handleClick = () => {
    console.log("click");
    count++;
    callBack();
  };

  console.log("Counter");

  return (
    <div>
      Counter:{count}
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      hi-mini-react
      <Counter />
    </div>
  );
}

console.log("App", <App />);

export default App;
