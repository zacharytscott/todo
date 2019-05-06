import React, { Component } from "react";
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

class App extends Component {
  constructor(props) {
    super(props);
    const savedSelectedTabValue = localStorage.getItem("selectedTab");

    const selectedTab =
      typeof savedSelectedTabValue !== "undefined" &&
      savedSelectedTabValue !== null
        ? savedSelectedTabValue
        : "all";

    this.state = {
      todoList: [],
      activeList: [],
      activeCount: null,
      completedList: [],
      completedCount: null,
      addTaskButtonActive: false,
      addTaskInputValue: "",
      clearCompletedTaskConfirmationVisible: false,
      selectedTab,
      errorFetchingTodos: false
    };
  }

  componentDidMount() {
    axios
      .get(TODO_ENDPOINT)
      .then(response => {
        this.todosFetchSuccessHandler(response);
      })
      .catch(() => {
        this.todosFetchErrorHandler();
      });
  }

  todosFetchSuccessHandler(response) {
    this.updateLists(response.data);
    this.setState({ errorFetchingTodos: false });
  }

  todosFetchErrorHandler() {
    this.setState({ errorFetchingTodos: true });
  }

  updateLists = todoList => {
    const completedList = [];
    const activeList = [];

    todoList.forEach(todo => {
      if (todo.completed) {
        completedList.push(todo);
      } else {
        activeList.push(todo);
      }
    });

    const activeCount = activeList.length;
    const completedCount = completedList.length;
    this.setState({
      todoList,
      activeList,
      activeCount,
      completedList,
      completedCount
    });
  };

  toggleTaskHandler = item => {
    const newItem = {
      text: item.text,
      completed: !item.completed
    };

    return axios
      .put(`${TODO_ENDPOINT}/${item._id}`, JSON.stringify(newItem), {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        this.toggleTaskSuccessHandler(response);
      })
      .catch(() => {
        this.displayErrorToast();
      });
  };

  toggleTaskSuccessHandler(response) {
    let newList = [...this.state.todoList];

    newList = newList.map(task => {
      if (task._id === response.data._id) {
        return response.data;
      }
      return task;
    });

    this.updateLists(newList);

    return newList;
  }

  displayErrorToast = () => {
    toast.error("🤔 Uhoh - your request failed!");
  };

  addTaskChangeHandler = event => {
    const addTaskInputValue = event.target.value;
    const addTaskButtonActive = event.target.value !== "";
    this.setState({ addTaskInputValue, addTaskButtonActive });
  };

  postNewTask = () => {
    const { addTaskInputValue } = this.state;

    const newTask = {
      text: addTaskInputValue,
      completed: false
    };

    axios
      .post(TODO_ENDPOINT, JSON.stringify(newTask), {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        this.postNewTaskSuccessHandler(response);
      })
      .catch(() => {
        this.displayErrorToast();
      });
  };

  postNewTaskSuccessHandler(response) {
    const { todoList, activeList } = this.state;
    const newTaskData = { ...response.data };
    const newList = [...todoList];
    const newActiveList = [...activeList];

    newList.push(newTaskData);
    newActiveList.push(newTaskData);

    const newState = {
      todoList: newList,
      activeList: newActiveList,
      activeCount: activeList.length + 1,
      addTaskButtonActive: false,
      addTaskInputValue: ""
    };

    this.setState(newState);
  }

  deleteTaskHandler = item => {
    axios
      .delete(`${TODO_ENDPOINT}/${item._id}`)
      .then(() => {
        this.deleteTaskSuccessHandler(item);
      })
      .catch(() => {
        this.displayErrorToast();
      });
  };

  deleteTaskSuccessHandler(item) {
    const { todoList } = this.state;
    let newList = [...todoList];

    newList = newList.filter(task => task._id !== item._id);
    this.updateLists(newList);
  }

  deleteAllCompletedTasks = () => {
    this.hideClearCompletedConfirmationDialog();

    axios
      .delete(`${TODO_ENDPOINT}?completed=true`)
      .then(() => {
        this.deleteAllCompletedTasksSuccessHandler();
      })
      .catch(() => {
        this.displayErrorToast();
      });
  };

  deleteAllCompletedTasksSuccessHandler() {
    const { todoList } = this.state;
    let newList = [...todoList];

    newList = newList.filter(task => !task.completed);
    this.updateLists(newList);
  }

  showClearCompletedConfirmationDialog = () => {
    this.setState({ clearCompletedTaskConfirmationVisible: true });
  };

  hideClearCompletedConfirmationDialog = () => {
    this.setState({ clearCompletedTaskConfirmationVisible: false });
  };

  selectAllTab = () => {
    this.setState({ selectedTab: "all" });
    window.localStorage.setItem("selectedTab", "all");
  };

  selectActiveTab = () => {
    this.setState({ selectedTab: "active" });
    window.localStorage.setItem("selectedTab", "active");
  };

  selectCompletedTab = () => {
    this.setState({ selectedTab: "completed" });
    window.localStorage.setItem("selectedTab", "completed");
  };

  render() {
    let noTasksCompletedMessage = null;

    if (this.state.completedCount === 0) {
      noTasksCompletedMessage = (
        <p>
          You don't have any completed tasks. Don't worry, you'll get there!
        </p>
      );
    }

    let activeTaskContent = null;
    let completedTaskContent = null;
    let fullContent = null;

    if (
      this.state.selectedTab === "all" ||
      this.state.selectedTab === "active"
    ) {
      activeTaskContent = (
        <div>
          <TodoList
            list={this.state.activeList}
            active
            title="Active Tasks"
            toggleTaskHandler={this.toggleTaskHandler}
            deleteTaskHandler={this.deleteTaskHandler}
          />

          <AddTodo
            value={this.state.addTaskInputValue}
            buttonState={this.state.addTaskButtonActive}
            addTaskChangeHandler={event => this.addTaskChangeHandler(event)}
            addTaskClickHandler={this.postNewTask}
          />
        </div>
      );
    }

    if (
      this.state.selectedTab === "all" ||
      this.state.selectedTab === "completed"
    ) {
      completedTaskContent = (
        <div>
          <TodoList
            list={this.state.completedList}
            active={false}
            title="Completed Tasks"
            toggleTaskHandler={this.toggleTaskHandler}
            deleteTaskHandler={this.deleteTaskHandler}
          />

          {noTasksCompletedMessage}

          <button
            id="clearCompleted"
            className={this.state.completedCount === 0 ? null : "active"}
            onClick={this.showClearCompletedConfirmationDialog}
            type="button"
          >
            Clear all completed tasks
          </button>

          <ConfirmationDialog
            visible={this.state.clearCompletedTaskConfirmationVisible}
            yesClickHandler={this.deleteAllCompletedTasks}
            cancelClickHandler={this.hideClearCompletedConfirmationDialog}
          />
        </div>
      );
    }

    if (!this.state.errorFetchingTodos) {
      fullContent = (
        <div>
          <TabSelector
            selectedTab={this.state.selectedTab}
            selectAllTabHandler={this.selectAllTab}
            selectActiveTabHandler={this.selectActiveTab}
            selectCompletedTabHandler={this.selectCompletedTab}
            activeCount={this.state.activeCount}
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
  }
}

export default App;
