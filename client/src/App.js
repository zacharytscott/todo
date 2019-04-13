import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Todo from './components/Todo.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeList : [],
      activeCount : null,
      completedList : [],
      completedCount : null
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/todos')
      .then(response => {
        const todoList = response.data;
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
        this.setState({activeList, activeCount, completedList, completedCount});
      })
      .catch(error => {
        console.log('error!');
      });
  }

  buildTodoList(todoList, active) {
    return todoList.map(item => {
      return (
        <Todo key={item._id} active={active} text={item.text}/>
      )
    })
  }

  render() {
    const activeList = this.buildTodoList(this.state.activeList, true);
    const completedList = this.buildTodoList(this.state.completedList, false);

    return (
      <div>
        <section className="active">{activeList}</section>
        <section className="completed">{completedList}</section>
      </div>
    );
  }
}

export default App;
