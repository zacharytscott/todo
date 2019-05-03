import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Todo from "../Todo/Todo";

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
    );
  });

  return (
    <div className="TodoList">
      <h1>{props.title}</h1>
      <section className={props.active ? "active" : "completed"}>
        <ReactCSSTransitionGroup
          transitionName="taskTransition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {todoListContent}
        </ReactCSSTransitionGroup>
      </section>
    </div>
  );
};

todoList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleTaskHandler: PropTypes.func.isRequired,
  deleteTaskHandler: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
};

export default todoList;
