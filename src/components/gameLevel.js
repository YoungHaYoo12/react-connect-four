import React from "react";

import "./gameLevel.css";

// Game Level Buttons of the connect-four board game
function GameLevel(props) {
  // if not cpu mode, disable buttons
  if (!props.isCPUMode) {
    $(".level").prop("disabled", true);
    console.log("not cpumode");
  } else {
    $(".level").prop("disabled", false);
  }

  return (
    <div className="gameLevels">
      <button className="easyLevel level" onClick={props.changeToEasy}>
        EASY
      </button>
      <button className="normalLevel level" onClick={props.changeToNormal}>
        NORMAL
      </button>
      <button className="hardLevel level" onClick={props.changeToHard}>
        HARD
      </button>
    </div>
  );
}

export default GameLevel;
