import React from 'react';
import './Todo.css';

const todo = props => {
    let buttonClass = '';
    let ariaLabel = 'Move this task back into your active tasks';

    if(props.active) {
        buttonClass = 'active';
        ariaLabel = 'Mark this task as completed';
    }

    return (
        <div className="Todo">
            <button className={buttonClass} type="button" aria-label={ariaLabel}></button>
            <div className="text">{props.text}</div>
            <button className="delete"></button>
        </div>
    )
};

export default todo;