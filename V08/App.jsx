import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(1);

  React.useEffect(() => {
    console.log("useEffect", "none");
    return () => {
      console.log("useEffect", "return1");
    };
  });

  React.useEffect(() => {
    console.log("useEffect", 0);
    return () => {
      console.log("useEffect", "return2");
    };
  }, []);

  React.useEffect(() => {
    console.log("useEffect", count);
    return () => {
      console.log("useEffect", "return3");
    };
  }, [count]);

  const handleClick = () => {
    console.log("click");
    setCount(count + 1);
  };

  return (
    <div>
      Foo:{count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function Bar() {
  const [count, setCount] = React.useState(1);

  React.useEffect(() => {
    console.log("useEffect", "none");
  });

  React.useEffect(() => {
    console.log("useEffect", 0);
  }, []);

  React.useEffect(() => {
    console.log("useEffect", count);
  }, [count]);

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
