import React from "react";

import "./historyButton.css";

// get our fontawesome imports
import {
  faChevronRight,
  faChevronLeft,
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// title compartment of the connect-four board game
function HistoryButton(props) {
  return (
    // resetButtonHidden used purely for button alignment purposes
    <div className="historyButtons">
      <div className="resetButtonHidden">
        <button className="historyButton" onClick={props.jumpBackwards}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
      </div>
      <div className="arrowButtons">
        <button className="historyButton" onClick={props.jumpBackwards}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="historyButton" onClick={props.jumpForwards}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="resetButton">
        <button className="historyButton" onClick={props.reset}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
      </div>
    </div>
  );
}

export default HistoryButton;
