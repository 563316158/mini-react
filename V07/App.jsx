import React from "./core/React.js";

function Foo() {
  const [fooCount, setFooCount] = React.useState(0);
  const [bar, setBar] = React.useState("bar");

  const handleClick1 = () => {
    console.log("click 1");
    setFooCount((c) => c + 1);
    setFooCount((c) => c + 1);
  };
  const handleClick2 = () => {
    console.log("click 2");
    setBar((c) => "bar");
  };

  console.log("fooCount", fooCount);

  console.log("Foo");
  return (
    <div>
      Foo:{fooCount}
      <button onClick={handleClick1}>click</button>
      <div>bar:{bar}</div>
      <button onClick={handleClick2}>click</button>
    </div>
  );
}

// let barCount = 0;
// function Bar() {
//   const callBack = React.update();
//   const handleClick = () => {
//     console.log("click Bar");
//     barCount++;
//     callBack();
//   };

//   console.log("Bar");
//   return (
//     <div>
//       Bar:{barCount}
//       <button onClick={handleClick}>click</button>
//     </div>
//   );
// }

let count = 0;
function Counter() {
  const handleClick = () => {
    console.log("click");
    count++;
  };

  console.log("Counter");

  return (
    <div>
      Counter:{count}
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      {/* <Bar></Bar> */}
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
