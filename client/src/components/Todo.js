import React from 'react';

const todo = props => {
    let buttonClass = '';
    let ariaLabel = 'Move this task back into your active tasks';

    if(props.active) {
        buttonClass = 'active';
        ariaLabel = 'Mark this task as completed';
    }

    return (
        <div>
            <button className={buttonClass} type="button" aria-label={ariaLabel}></button>
            {props.text}
            <button className="delete"></button>
        </div>
    )
};

export default todo;