import React from 'react';
import './TabSelector.css';

const tabSelector = props => {
    return (
        <div className="TabSelector">
            <button 
                className={props.selectedTab === "all" ? "active" : null}
                onClick={props.selectAllTabHandler}>
                All
            </button>

            <button 
                className={props.selectedTab === "active" ? "active" : null}
                onClick={props.selectActiveTabHandler}>
                Active
            </button>

            <button 
                className={props.selectedTab === "completed" ? "active" : null}
                onClick={props.selectCompletedTabHandler}>
                Completed
            </button>
        </div>
    )
}

export default tabSelector;