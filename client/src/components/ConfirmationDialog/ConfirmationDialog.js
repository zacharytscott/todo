import React from "react";
import PropTypes from "prop-types";
import "./ConfirmationDialog.css";

const confirmationDialog = props => {
  let className = "ConfirmationDialog";

  if (props.visible) {
    className = `${className} active`;
  }

  return (
    <div className={className}>
      <p>Are you sure you want to clear all completed tasks?</p>
      <button className="yes" onClick={props.yesClickHandler} type="button">
        Yes
      </button>
      <button
        className="cancel"
        onClick={props.cancelClickHandler}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
};

confirmationDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  yesClickHandler: PropTypes.func.isRequired,
  cancelClickHandler: PropTypes.func.isRequired
};

export default confirmationDialog;
