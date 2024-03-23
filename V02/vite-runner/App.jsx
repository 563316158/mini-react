import { createElement } from "./core/React.js";
import React from "./core/React.js";
// const App = createElement("div", { id: "app" }, "app");
const App = (
  <div>
    <div id="app">hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>
    <div>hi-mini-react</div> <div>1</div>

   
  </div>
);

function AppOne() {
  return (
    <div>
      AppOne <div>AppTwo</div>
    </div>
  );
}

console.log("AppOne", AppOne);

console.log(App);

export default App;
