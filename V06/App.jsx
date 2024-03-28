import React from "./core/React.js";

let show = false;
function Counter() {
  const foo = (
    <div>
      Foo<div>Child</div>
    </div>
  );


    const bar = <p>Bar</p>;
  

  const handleClick = () => {
    console.log("click");
    show = !show;
    React.update();
  };

  return (
    <div>
      Counter
      <button onClick={handleClick}>click</button>
      <div> {show ? bar : foo}</div>
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
