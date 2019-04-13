import React from 'react';
import './Todo.css';

const todo = props => {
    let buttonClass = 'checkbox';
    let title = 'Move this task back into your active tasks';

    if(props.active) {
        buttonClass = 'checkbox active';
        title = 'Mark this task as completed';
    }

    return (
        <div className="Todo">
            <button className={buttonClass} type="button" title={title} aria-label={title}></button>
            <div className="text">{props.text}</div>
            <button className="delete" type="button" title="Delete this task" aria-label="Delete this task"></button>
        </div>
    )
};

export default todo;