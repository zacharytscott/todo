import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import AddTodo from './components/AddTodo/AddTodo';
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog';
import TabSelector from './components/TabSelector/TabSelector';
import TodoList from './components/TodoList/TodoList';
import configJSON from './config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TODO_ENDPOINT = `${configJSON.serverURL}/todos`;

class App extends Component {
  constructor(props) {
    super(props);
    const savedSelectedTabValue = localStorage.getItem("selectedTab");
    const selectedTab = !!savedSelectedTabValue ? savedSelectedTabValue : "all";

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
      errorFetchingTodos : false
    }
  }

  displayErrorToast = () => {
    toast.error("🤔 Uhoh - your request failed!");
  }

  updateLists = todoList => {
    const completedList = [];
    const activeList = [];

    todoList.forEach(todo => {
      if(todo.completed) {
        completedList.push(todo);
      } else {
        activeList.push(todo);
      }
    });

    const activeCount = activeList.length;
    const completedCount = completedList.length;
    this.setState({todoList, activeList, activeCount, completedList, completedCount});
  }

  toggleTaskHandler = item => {
    const newItem = {
      text : item.text,
      completed : !item.completed
    }

    axios.put(`${TODO_ENDPOINT}/${item._id}`, JSON.stringify(newItem), {headers : {"Content-Type" : "application/json"}})
      .then(response => {
        let newList = [...this.state.todoList];

        newList = newList.map(task => {
          if(task._id === response.data._id) {
            task = response.data;
          }
          return task;
        })

        this.updateLists(newList);
      })
      .catch(error => {
        console.log(error);
        this.displayErrorToast();
      });
  }

  componentDidMount() {
    axios.get(TODO_ENDPOINT)
      .then(response => {
        this.updateLists(response.data);
        this.setState({errorFetchingTodos : false});
      })
      .catch(error => {
        console.log(error);
        this.setState({errorFetchingTodos : true});
      });
  }

  addTaskChangeHandler = event => {
    const addTaskInputValue = event.target.value;
    const addTaskButtonActive = event.target.value !== "";
    this.setState({addTaskInputValue, addTaskButtonActive});
  }

  postNewTask = () => {
    const addTaskInputValue = this.state.addTaskInputValue;

    const newTask = {
      text: addTaskInputValue,
      completed: false
    };

    axios.post(TODO_ENDPOINT, JSON.stringify(newTask), {headers : {"Content-Type" : "application/json"}})
      .then(response => {
        const newTask = {...response.data};
        const newList = [...this.state.todoList];
        const newActiveList = [...this.state.activeList];

        newList.push(newTask);
        newActiveList.push(newTask);

        const newState = {
          todoList: newList,
          activeList: newActiveList,
          activeCount: this.state.activeList.length + 1,
          addTaskButtonActive : false,
          addTaskInputValue : "",
        };

        this.setState(newState);
      })
      .catch(error => {
        console.log(error);
        this.displayErrorToast();
      });
  }

  deleteTaskHandler = item => {
    axios.delete(`${TODO_ENDPOINT}/${item._id}`)
      .then(response => {
        let newList = [...this.state.todoList];

        newList = newList.filter(task => task._id !== item._id);
        this.updateLists(newList);
      })
      .catch(error => {
        console.log(error);
        this.displayErrorToast();
      });
  }

  showClearCompletedConfirmationDialog = () => {
    this.setState({clearCompletedTaskConfirmationVisible : true});
  }

  hideClearCompletedConfirmationDialog = () =>{
    this.setState({clearCompletedTaskConfirmationVisible : false});
  }

  selectAllTab = () => {
    this.setState({selectedTab : 'all'});
    window.localStorage.setItem("selectedTab", "all");
  }

  selectActiveTab = () => {
    this.setState({selectedTab : 'active'});
    window.localStorage.setItem("selectedTab", "active");
  }

  selectCompletedTab = () => {
    this.setState({selectedTab : 'completed'});
    window.localStorage.setItem("selectedTab", "completed");
  }

  deleteAllCompletedTasks = () => {
    this.hideClearCompletedConfirmationDialog();

    axios.delete(`${TODO_ENDPOINT}?completed=true`)
      .then(response => {
        let newList = [...this.state.todoList];

        newList = newList.filter(task => !task.completed);
        this.updateLists(newList);
      })
      .catch(error => {
        console.log(error);
        this.displayErrorToast();
      });
  }

  render() {
    let noCompletedMessage = null;
    
    if(this.state.completedCount === 0) {
      noCompletedMessage = <p>You don't have any completed tasks. Don't worry, you'll get there!</p>;
    }

    let activeTaskContent = null;
    let completedTaskContent = null;
    let fullContent = null;

    if(this.state.selectedTab === 'all' || this.state.selectedTab === 'active') {
      activeTaskContent = <div>
  
      <TodoList 
        list={this.state.activeList}
        active={true}
        title="Active Tasks"
        toggleTaskHandler={this.toggleTaskHandler}
        deleteTaskHandler={this.deleteTaskHandler}
      />

      <AddTodo 
          value={this.state.addTaskInputValue}
          buttonState={this.state.addTaskButtonActive}
          addTaskChangeHandler={(event) => this.addTaskChangeHandler(event)}
          addTaskClickHandler={this.postNewTask}
        />
      </div>
    }

    if(this.state.selectedTab === 'all' || this.state.selectedTab === 'completed') {
      completedTaskContent = <div>
      
        <TodoList 
          list={this.state.completedList}
          active={false}
          title="Completed Tasks"
          toggleTaskHandler={this.toggleTaskHandler}
          deleteTaskHandler={this.deleteTaskHandler}
        />

        {noCompletedMessage}

        <button 
          id="clearCompleted"
          className={this.state.completedCount === 0 ? null : "active"}
          onClick={this.showClearCompletedConfirmationDialog}>
            Clear all completed tasks
        </button>

        <ConfirmationDialog 
          visible={this.state.clearCompletedTaskConfirmationVisible}
          yesClickHandler={this.deleteAllCompletedTasks}
          cancelClickHandler={this.hideClearCompletedConfirmationDialog}/>
      </div>;
    }

    if(!this.state.errorFetchingTodos) {
      fullContent = <div>
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
      </div>;
    } else {
      fullContent = <div className="server-error">
          <h1>Oh no!</h1>
          <p>There was an error connecting to the server.</p>
        </div>;
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
