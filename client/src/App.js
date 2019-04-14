import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
import axios from 'axios';
import './App.css';
import Todo from './components/Todo/Todo.js';
import AddTodo from './components/AddTodo/AddTodo';
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog';

const TODO_ENDPOINT = 'http://localhost:3001/todos';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList : [],
      activeList : [],
      activeCount : null,
      completedList : [],
      completedCount : null,
      addTaskButtonActive : false,
      addTaskInputValue : "",
      clearCompletedTaskConfirmationVisible: false
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

  toggleTaskHandler(item) {
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

  deleteTaskHandler(item) {
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

  buildTodoList(todoList, active) {
    return todoList.map(item => {
      return (
        <Todo 
          key={item._id}
          active={active}
          text={item.text}
          toggleTaskHandler={this.toggleTaskHandler.bind(this, item)}
          deleteTaskHandler={this.deleteTaskHandler.bind(this, item)}
        />
      )
    });
  }

  showClearCompletedConfirmationDialog() {
    this.setState({clearCompletedTaskConfirmationVisible : true});
  }

  hideClearCompletedConfirmationDialog() {
    this.setState({clearCompletedTaskConfirmationVisible : false});
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
    const activeList = this.buildTodoList(this.state.activeList, true);
    const completedList = this.buildTodoList(this.state.completedList, false);

    let allCompleteMessage = null;
    let clearCompletedButton = null;
    
    if(this.state.completedCount === 0) {
      allCompleteMessage = <p>You don't have any completed tasks. Don't worry, you'll get there!</p>;
    } else {
      clearCompletedButton = (
        <button 
          id="clearCompleted"
          onClick={this.showClearCompletedConfirmationDialog.bind(this)}>
            Clear all completed tasks
        </button>
      );
    }

    return (
      <div className="App">

        <h1>Active Tasks ({this.state.activeCount})</h1>
        <section className="active">
          <ReactCSSTransitionGroup
            transitionName="taskTransition"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {activeList}
          </ReactCSSTransitionGroup>
        </section>

        <AddTodo 
          value={this.state.addTaskInputValue}
          buttonState={this.state.addTaskButtonActive} 
          addTaskChangeHandler={(event) => this.addTaskChangeHandler(event)}
          addTaskClickHandler={this.postNewTask.bind(this)}
        />

        <h1>Completed tasks ({this.state.completedCount})</h1>
        <section className="completed">
          <ReactCSSTransitionGroup
            transitionName="taskTransition"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {completedList}
          </ReactCSSTransitionGroup>
        </section>

        {clearCompletedButton}
        {allCompleteMessage}

        <ConfirmationDialog 
          visible={this.state.clearCompletedTaskConfirmationVisible}
          yesClickHandler={this.deleteAllCompletedTasks.bind(this)}
          cancelClickHandler={this.hideClearCompletedConfirmationDialog.bind(this)}/>
      </div>
    );
  }
}

export default App;
