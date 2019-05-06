import React from "react";
import PropTypes from "prop-types";
import "./TabSelector.css";

const tabSelector = props => {
  let activeCountContent = null;

  if (props.activeCount > 0) {
    activeCountContent = (
      <span className="activeCount">({props.activeCount})</span>
    );
  }

  return (
    <div className="TabSelector">
      <button
        className={props.selectedTab === "all" ? "active" : null}
        onClick={props.selectAllTabHandler}
        type="button"
      >
        All
      </button>

      <button
        className={props.selectedTab === "active" ? "active" : null}
        onClick={props.selectActiveTabHandler}
        type="button"
      >
        Active {activeCountContent}
      </button>

      <button
        className={props.selectedTab === "completed" ? "active" : null}
        onClick={props.selectCompletedTabHandler}
        type="button"
      >
        Completed
      </button>
    </div>
  );
};

tabSelector.defaultProps = {
  activeCount: 0,
  selectedTab: "all"
};

tabSelector.propTypes = {
  activeCount: PropTypes.number,
  selectedTab: PropTypes.string,
  selectAllTabHandler: PropTypes.func.isRequired,
  selectActiveTabHandler: PropTypes.func.isRequired,
  selectCompletedTabHandler: PropTypes.func.isRequired
};

export default tabSelector;
