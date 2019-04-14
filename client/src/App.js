import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import AddTodo from './components/AddTodo/AddTodo';
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog';
import TabSelector from './components/TabSelector/TabSelector';
import TodoList from './components/TodoList/TodoList'

const TODO_ENDPOINT = 'http://localhost:3001/todos';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeList: [],
      activeCount: null,
      completedList: [],
      completedCount: null,
      addTaskButtonActive: false,
      addTaskInputValue: "",
      clearCompletedTaskConfirmationVisible: false,
      selectedTab: "all"
    }
  }

  updateLists(todoList) {
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

  toggleTaskHandler = (item) => {
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
      });
  }

  componentDidMount() {
    axios.get(TODO_ENDPOINT)
      .then(response => {
        this.updateLists(response.data);
      })
      .catch(error => {
        console.log('error!');
      });
  }

  addTaskChangeHandler(event) {
    const addTaskInputValue = event.target.value;
    const addTaskButtonActive = event.target.value !== "";
    this.setState({addTaskInputValue, addTaskButtonActive});
  }

  postNewTask() {
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
          addTaskButtonActive : false,
          addTaskInputValue : "",
        };

        this.setState(newState);
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteTaskHandler = (item) => {
    axios.delete(`${TODO_ENDPOINT}/${item._id}`)
      .then(response => {
        let newList = [...this.state.todoList];

        newList = newList.filter(task => task._id !== item._id);
        this.updateLists(newList);
      })
      .catch(error => {
        console.log(error);
      });
  }

  showClearCompletedConfirmationDialog() {
    this.setState({clearCompletedTaskConfirmationVisible : true});
  }

  hideClearCompletedConfirmationDialog() {
    this.setState({clearCompletedTaskConfirmationVisible : false});
  }

  selectAllTab() {
    this.setState({selectedTab : 'all'});
  }

  selectActiveTab() {
    this.setState({selectedTab : 'active'});
  }

  selectCompletedTab() {
    this.setState({selectedTab : 'completed'});
  }

  deleteAllCompletedTasks() {
    this.hideClearCompletedConfirmationDialog();

    axios.delete(`${TODO_ENDPOINT}?completed=true`)
      .then(response => {
        let newList = [...this.state.todoList];

        newList = newList.filter(task => !task.completed);
        this.updateLists(newList);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let noCompletedMessage = null;
    
    if(this.state.completedCount === 0) {
      noCompletedMessage = <p>You don't have any completed tasks. Don't worry, you'll get there!</p>;
    }

    return (
      <div className="App">

        <TabSelector 
          selectedTab={this.state.selectedTab}
          selectAllTabHandler={this.selectAllTab.bind(this)}
          selectActiveTabHandler={this.selectActiveTab.bind(this)}
          selectCompletedTabHandler={this.selectCompletedTab.bind(this)}
        />

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
          addTaskClickHandler={this.postNewTask.bind(this)}
        />

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
          onClick={this.showClearCompletedConfirmationDialog.bind(this)}>
            Clear all completed tasks
        </button>

        <ConfirmationDialog 
          visible={this.state.clearCompletedTaskConfirmationVisible}
          yesClickHandler={this.deleteAllCompletedTasks.bind(this)}
          cancelClickHandler={this.hideClearCompletedConfirmationDialog.bind(this)}/>
      </div>
    );
  }
}

export default App;
