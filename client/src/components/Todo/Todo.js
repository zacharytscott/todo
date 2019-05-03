import React from "react";
import PropTypes from "prop-types";
import "./Todo.css";

const todo = props => {
  let buttonClass = "checkbox";
  let title = "Mark this task as completed";

  if (!props.active) {
    buttonClass = buttonClass.concat(" completed");
    title = "Mark this task as incomplete";
  }

  return (
    <div className="Todo">
      <button
        className={buttonClass}
        type="button"
        title={title}
        aria-label={title}
        onClick={() => props.toggleTaskHandler(props.item)}
      />

      <div className="text">{props.text}</div>
      <button
        className="delete"
        type="button"
        title="Delete this task"
        aria-label="Delete this task"
        onClick={() => props.deleteTaskHandler(props.item)}
      />
    </div>
  );
};

todo.propTypes = {
  active: PropTypes.bool.isRequired,
  // TODO: use TS and fix this bad typing
  item: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  toggleTaskHandler: PropTypes.func.isRequired,
  deleteTaskHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default todo;
