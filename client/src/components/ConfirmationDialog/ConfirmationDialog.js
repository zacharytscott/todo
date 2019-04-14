import React from 'react';
import './ConfirmationDialog.css';

const confirmationDialog = props => {
    let className = "ConfirmationDialog";

    if(props.visible) {
        className = `${className} active`;
    }

    return(
        <div className={className}>
            <p>Are you sure you want to clear all completed tasks?</p>
            <button className="yes" onClick={props.yesClickHandler}>Yes</button>
            <button className="cancel" onClick={props.cancelClickHandler}>Cancel</button>
        </div>
    )
}

export default confirmationDialog;