import React from "react";

const PopUp = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "Popmodal d-block" : "Popmodal d-none";

  return (
    <div className={showHideClassName}>
      <div className="Popmodal-container">
        {children}
        <a href="javascript:;" className="Popmodal-close" onClick={handleClose}>
          close
        </a>
      </div>
    </div>
  );
};

export default PopUp;
