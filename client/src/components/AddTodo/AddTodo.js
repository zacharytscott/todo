import React from "react";
import PropTypes from "prop-types";
import "./AddTodo.css";

const addTodo = props => {
  let className = null;

  if (props.buttonState) {
    className = "active";
  }

  return (
    <div className="AddTodo">
      <input
        value={props.value}
        type="text"
        onChange={props.addTaskChangeHandler}
        placeholder="Enter a new task"
        aria-label="Enter a new task"
      />
      <button
        className={className}
        type="button"
        onClick={props.addTaskClickHandler}
        title="Add a new task"
        aria-label="Add a new task"
      />
    </div>
  );
};

addTodo.propTypes = {
  buttonState: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  addTaskChangeHandler: PropTypes.func.isRequired,
  addTaskClickHandler: PropTypes.func.isRequired
};

export default addTodo;
