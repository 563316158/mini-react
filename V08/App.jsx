import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(1);
  const [bar, setBar] = React.useState("bar");

  React.useEffect(() => {
    console.log("useEffect0", count);
    return () => {
      console.log("useEffect0", "return0");
    };
  }, []);

  React.useEffect(() => {
    console.log("useEffect1", count);
    return () => {
      console.log("useEffect1", "return1");
    };
  }, [count]);

  React.useEffect(() => {
    console.log("useEffect2", bar);
    return () => {
      console.log("useEffect2", "return2");
    };
  }, [bar]);

  const handleClick1 = () => {
    console.log("click1");
    setCount(count + 1);
  };
  const handleClick2 = () => {
    console.log("click2");
    setBar(bar + "2");
  };

  return (
    <div>
      Foo:{count}
      <button onClick={handleClick1}>click1</button>
      <button onClick={handleClick2}>click2</button>
    </div>
  );
}

function Bar() {
  const [count, setCount] = React.useState(1);

  // React.useEffect(() => {
  //   console.log("useEffect", "none");
  // });

  // React.useEffect(() => {
  //   console.log("useEffect", 0);
  // }, []);

  // React.useEffect(() => {
  //   console.log("useEffect", count);
  // }, [count]);

  const handleClick = () => {
    console.log("click");
    setCount(count + 1);
  };

  return (
    <div>
      Bar:{count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let count = 0;
function Counter() {
  const handleClick = () => {
    console.log("click");
    count++;
  };

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
