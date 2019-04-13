import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Todo from './components/Todo/Todo.js';

const TODO_ENDPOINT = 'http://localhost:3001/todos';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList : [],
      activeList : [],
      activeCount : null,
      completedList : [],
      completedCount : null
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

  toggleTask(item) {
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

  buildTodoList(todoList, active) {
    return todoList.map(item => {
      return (
        <Todo key={item._id} active={active} text={item.text} toggleTask={this.toggleTask.bind(this, item)}/>
      )
    });
  }

  render() {
    const activeList = this.buildTodoList(this.state.activeList, true);
    const completedList = this.buildTodoList(this.state.completedList, false);

    return (
      <div className="App">
        <h1>Todo List ({this.state.activeCount})</h1>
        <section className="active">{activeList}</section>
        <h2>Completed tasks ({this.state.completedCount})</h2>
        <section className="completed">{completedList}</section>
      </div>
    );
  }
}

export default App;
