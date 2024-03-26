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

function Counter({ num }) {
  return <div>Counter: {num}</div>;
}

// const App = (
//   <div id="app">
//     hi-mini-react <CounterContainer />
//   </div>
// );

function App() {
  return (
    <div id="app">
      hi-mini-react <CounterContainer />
      <Counter num={20} />
    </div>
  );
}

console.log(<App />);

export default App;
