import { createElement } from "./core/React.js";
import React from "./core/React.js";
// const App = createElement("div", { id: "app" }, "app");
const App = <div id="app">hi-mini-react</div>;

function AppOne() {
  return (
    <div>
      AppOne <div>AppTwo</div>
    </div>
  );
}

console.log("App", App);

export default App;
