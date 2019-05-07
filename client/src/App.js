import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import AddTodo from "./components/AddTodo/AddTodo";
import ConfirmationDialog from "./components/ConfirmationDialog/ConfirmationDialog";
import TabSelector from "./components/TabSelector/TabSelector";
import TodoList from "./components/TodoList/TodoList";
import configJSON from "./config";
import "react-toastify/dist/ReactToastify.css";

const TODO_ENDPOINT = `${configJSON.serverURL}/todos`;

const App = () => {
  const savedSelectedTabValue = localStorage.getItem("selectedTab");

  const initialTab =
    typeof savedSelectedTabValue !== "undefined" &&
    savedSelectedTabValue !== null
      ? savedSelectedTabValue
      : "all";

  const [todoList, setTodoList] = useState([]);
  const [activeList, setActiveList] = useState([]);
  const [activeCount, setActiveCount] = useState(null);
  const [completedList, setCompletedList] = useState([]);
  const [completedCount, setCompletedCount] = useState(null);
  const [addTaskButtonActive, setAddTaskButtonActive] = useState(false);
  const [addTaskInputValue, setAddTaskInputValue] = useState("");
  const [
    clearCompletedTaskConfirmationVisible,
    setClearCompletedTaskConfirmationVisible
  ] = useState(false);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [errorFetchingTodos, setErrorFetchingTodos] = useState(false);

  const showClearCompletedConfirmationDialog = () => {
    setClearCompletedTaskConfirmationVisible(true);
  };

  const hideClearCompletedConfirmationDialog = () => {
    setClearCompletedTaskConfirmationVisible(false);
  };

  const selectAllTab = () => {
    setSelectedTab("all");
    window.localStorage.setItem("selectedTab", "all");
  };

  const selectActiveTab = () => {
    setSelectedTab("active");
    window.localStorage.setItem("selectedTab", "active");
  };

  const selectCompletedTab = () => {
    setSelectedTab("completed");
    window.localStorage.setItem("selectedTab", "completed");
  };

  const updateLists = newTodoList => {
    const newCompletedList = [];
    const newActiveList = [];

    newTodoList.forEach(todo => {
      if (todo.completed) {
        newCompletedList.push(todo);
      } else {
        newActiveList.push(todo);
      }
    });

    const newActiveCount = newActiveList.length;
    const newCompletedCount = newCompletedList.length;
    setTodoList(newTodoList);
    setActiveList(newActiveList);
    setActiveCount(newActiveCount);
    setCompletedList(newCompletedList);
    setCompletedCount(newCompletedCount);
  };

  const todosFetchSuccessHandler = response => {
    updateLists(response.data);
    setErrorFetchingTodos(false);
  };

  const todosFetchErrorHandler = () => {
    setErrorFetchingTodos(true);
  };

  const fetchTodos = () => {
    return axios
      .get(TODO_ENDPOINT)
      .then(response => {
        todosFetchSuccessHandler(response);
      })
      .catch(() => {
        todosFetchErrorHandler();
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTaskSuccessHandler = response => {
    let newList = [...todoList];

    newList = newList.map(task => {
      if (task._id === response.data._id) {
        return response.data;
      }
      return task;
    });

    updateLists(newList);

    return newList;
  };

  const displayErrorToast = () => {
    toast.error("🤔 Uhoh - your request failed!");
  };

  const toggleTaskHandler = item => {
    const newItem = {
      text: item.text,
      completed: !item.completed
    };

    return axios
      .put(`${TODO_ENDPOINT}/${item._id}`, JSON.stringify(newItem), {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        toggleTaskSuccessHandler(response);
      })
      .catch(() => {
        displayErrorToast();
      });
  };

  const addTaskChangeHandler = event => {
    const newAddTaskInputValue = event.target.value;
    const newAddTaskButtonActive = event.target.value !== "";
    setAddTaskInputValue(newAddTaskInputValue);
    setAddTaskButtonActive(newAddTaskButtonActive);
  };

  const postNewTaskSuccessHandler = response => {
    const newTaskData = { ...response.data };
    const newList = [...todoList];
    const newActiveList = [...activeList];

    newList.push(newTaskData);
    newActiveList.push(newTaskData);

    setTodoList(newList);
    setActiveList(newActiveList);
    setActiveCount(activeList.length + 1);
    setAddTaskButtonActive(false);
    setAddTaskInputValue("");
  };

  const postNewTask = () => {
    const newAddTaskInputValue = addTaskInputValue;

    const newTask = {
      text: newAddTaskInputValue,
      completed: false
    };

    return axios
      .post(TODO_ENDPOINT, JSON.stringify(newTask), {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        postNewTaskSuccessHandler(response);
      })
      .catch(() => {
        displayErrorToast();
      });
  };

  const deleteTaskSuccessHandler = item => {
    let newList = [...todoList];

    newList = newList.filter(task => task._id !== item._id);
    updateLists(newList);
  };

  const deleteTaskHandler = item => {
    return axios
      .delete(`${TODO_ENDPOINT}/${item._id}`)
      .then(() => {
        deleteTaskSuccessHandler(item);
      })
      .catch(() => {
        displayErrorToast();
      });
  };

  const deleteAllCompletedTasksSuccessHandler = () => {
    let newList = [...todoList];

    newList = newList.filter(task => !task.completed);
    updateLists(newList);
  };

  const deleteAllCompletedTasksHandler = () => {
    hideClearCompletedConfirmationDialog();

    return axios
      .delete(`${TODO_ENDPOINT}?completed=true`)
      .then(() => {
        deleteAllCompletedTasksSuccessHandler();
      })
      .catch(() => {
        displayErrorToast();
      });
  };

  let noTasksCompletedMessage = null;

  if (completedCount === 0) {
    noTasksCompletedMessage = (
      <p className="no-completed-tasks-text">
        You don't have any completed tasks. Don't worry, you'll get there!
      </p>
    );
  }

  let activeTaskContent = null;
  let completedTaskContent = null;
  let fullContent = null;

  if (selectedTab === "all" || selectedTab === "active") {
    activeTaskContent = (
      <div className="active-tasks">
        <TodoList
          list={activeList}
          active
          title="Active Tasks"
          toggleTaskHandler={toggleTaskHandler}
          deleteTaskHandler={deleteTaskHandler}
        />

        <AddTodo
          value={addTaskInputValue}
          buttonState={addTaskButtonActive}
          addTaskChangeHandler={event => addTaskChangeHandler(event)}
          addTaskClickHandler={postNewTask}
        />
      </div>
    );
  }

  if (selectedTab === "all" || selectedTab === "completed") {
    completedTaskContent = (
      <div className="completed-tasks">
        <TodoList
          list={completedList}
          active={false}
          title="Completed Tasks"
          toggleTaskHandler={toggleTaskHandler}
          deleteTaskHandler={deleteTaskHandler}
        />

        {noTasksCompletedMessage}

        <button
          id="clearCompleted"
          className={completedCount === 0 ? null : "active"}
          onClick={showClearCompletedConfirmationDialog}
          type="button"
        >
          Clear all completed tasks
        </button>

        <ConfirmationDialog
          visible={clearCompletedTaskConfirmationVisible}
          yesClickHandler={deleteAllCompletedTasksHandler}
          cancelClickHandler={hideClearCompletedConfirmationDialog}
        />
      </div>
    );
  }

  if (!errorFetchingTodos) {
    fullContent = (
      <div>
        <TabSelector
          selectedTab={selectedTab}
          selectAllTabHandler={selectAllTab}
          selectActiveTabHandler={selectActiveTab}
          selectCompletedTabHandler={selectCompletedTab}
          activeCount={activeCount}
        />
        <main>
          {activeTaskContent}
          {completedTaskContent}
        </main>
      </div>
    );
  } else {
    fullContent = (
      <div className="server-error">
        <h1>Oh no!</h1>
        <p>There was an error connecting to the server.</p>
      </div>
    );
  }

  return (
    <div className="App">
      {fullContent}

      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
