import { createElement } from "./core/React.js";
import React from "./core/React.js";
// const App = createElement("div", { id: "app" }, "app");

function CounterContainer() {
  return (
    <div>
      <Counter num={5} /> <Counter num={10} />
    </div>
  );
}


let count = 0;
function Counter() {
  const handleClick = () => {
    console.log("click");
    count++;
    React.update();
  };

  console.log("Counter", count);

  return (
    <div>
      Counter: {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

// const App = (
//   <div id="app">
//     hi-mini-react <CounterContainer />
//   </div>
// );

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
