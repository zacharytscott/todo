import React from 'react';
import './Todo.css';

const todo = props => {
    let buttonClass = 'checkbox';
    let title = 'Mark this task as completed';

    if(!props.active) {
        buttonClass = 'checkbox completed';
        title = 'Mark this task as incomplete';
    }

    return (
        <div className="Todo">
            <button className={buttonClass} type="button" title={title} aria-label={title} onClick={props.toggleTask}></button>
            <div className="text">{props.text}</div>
            <button className="delete" type="button" title="Delete this task" aria-label="Delete this task"></button>
        </div>
    )
};

export default todo;