import React from 'react';
import './AddTodo.css';

const addTodo = props => {
    let className = null;

    if(props.buttonState) {
        className = "active";
    }

    return (
        <div className="AddTodo">
            <input value={props.value} type="text" onChange={props.addTaskChangeHandler} placeholder="Enter a new task"></input>
            <button className={className} type="button" onClick={props.addTaskClickHandler}>+</button>
        </div>
    )
};

export default addTodo;