import React from 'react';
import './TabSelector.css';

const tabSelector = props => {
    let activeCountContent = null;

    if(props.activeCount > 0) {
        activeCountContent = <span className="activeCount">({props.activeCount})</span>;
    }

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
                Active {activeCountContent}
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