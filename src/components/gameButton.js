import React from "react";

import "./gameButton.css";

// get our fontawesome imports
import {
  faChevronRight,
  faChevronLeft,
  faUndo,
  faUser,
  faUserFriends
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* history buttons and game mode buttons component of connect four game 
Button description from top to bottom:
  1. CPU Mode Button allows user to select CPU game mode 
  2. Two Player Button allows user to select 2 player game mode 
  3. Arrow Button 1 allows user to undo a move
  4. Arrow Button 2 allows user to redo a move 
  5. Reset Button allows user to reset the connect four board 
*/

function GameButton(props) {
  return (
    <div className="allButtonsContainer">
      <div className="gameModeButtons">
        <button
          className="CPUModeButton gameModeButton"
          onClick={props.selectCPUMode}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button
          className="twoPlayerModeButton gameModeButton"
          onClick={props.selectTwoPlayerMode}
        >
          <FontAwesomeIcon icon={faUserFriends} />
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

export default GameButton;
