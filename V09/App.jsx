import React from "./core/React.js";

function TodoList() {
  const [todoList, setTodoList] = React.useState([]);

  React.useEffect(() => {
    localStorage.getItem("todoList") &&
      setTodoList(JSON.parse(localStorage.getItem("todoList")));
  }, []);
  React.useEffect(() => {
    console.log("newTodoList", "useEffect");
  }, [todoList]);

  const [value, setValue] = React.useState("");
  const [radioValue, setRadioValue] = React.useState("all");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const add = () => {
    if (!value) return;

    const newTodoList = [
      ...todoList,
      {
        id: todoList.length + 1,
        ToDo: value,
        type: "active",
      },
    ];
    setValue("");
    setTodoList(newTodoList);
  };

  const save = () => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  };

  const remove = (id) => {
    const newTodoList = todoList.filter((todo) => {
      return todo.id !== id;
    });
    setTodoList(newTodoList);
  };

  const done = (id) => {
    const newTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          type: todo.type === "done" ? "active" : "done",
        };
      } else {
        return todo;
      }
    });
    setTodoList(newTodoList);
  };

  const onRadioChange = (e) => {
    console.log(e.target.value);
    setRadioValue(e.target.value);
  };

  const radioList = ["all", "done", "active"];

  const filterTodoList = todoList.filter((todo) => {
    if (radioValue === "all") {
      return true;
    } else if (radioValue === "done" && todo.type === "done") {
      return true;
    } else if (radioValue === "active" && todo.type === "active") {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div>
      <div>
        <input type="text" value={value} onChange={onChange} />
        <button onClick={add}>add</button>
      </div>
      <div>
        <button onClick={save}>save</button>
      </div>
      <div>
        {...radioList.map((radio, index) => {
          return (
            <div key={radio}>
              <input
                type="radio"
                id={radio}
                name="drone"
                value={radio}
                onChange={onRadioChange}
                checked={radioValue === radio}
              />
              <label for={radio}>{radio}</label>
            </div>
          );
        })}
      </div>
      <ul>
        {/* 出不来是因为他是一个二维数组 */}
        {...filterTodoList.map((todo) => {
          return (
            <li key={todo.id}>
              <span
                style={
                  todo.type === "done"
                    ? { "text-decoration": "line-through" }
                    : {}
                }
                className={todo.type === "done" ? "done" : ""}
              >
                {todo.ToDo}
              </span>
              <button
                onClick={() => {
                  remove(todo.id);
                }}
              >
                remove
              </button>
              <button
                onClick={() => {
                  done(todo.id);
                }}
              >
                {todo.type === "done" ? "cancel" : "done"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>TODOList</h1>
      <TodoList />
    </div>
  );
}

console.log("App", <App />);

export default App;
