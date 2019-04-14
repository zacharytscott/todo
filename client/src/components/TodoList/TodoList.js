import React from 'react';
import Todo from '../Todo/Todo';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 

const todoList = props => {
    const todoListContent = props.list.map(item => {
        return (
          <Todo 
            key={item._id}
            active={props.active}
            text={item.text}
            toggleTaskHandler={props.toggleTaskHandler}
            deleteTaskHandler={props.deleteTaskHandler}
            item={item}
          />
        )
      })
    
      return (
          <div className="TodoList">
            <h1>{props.title} <span class="task-count">({props.list.length})</span></h1>
            <section className={props.active ? "active" : "completed"}>
                <ReactCSSTransitionGroup
                    transitionName="taskTransition"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {todoListContent}
                </ReactCSSTransitionGroup>
            </section>
          </div>
      )
}

export default todoList;