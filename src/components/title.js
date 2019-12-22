import React from "react";

import "./title.css";

// title compartment of the connect-four board game
function Title(props) {
  const color = props.isRedTurn ? "red-turn" : "yellow-turn";
  const gameStatusTitle = props.isGameWon ? "game-won" : "";
  const titleClassName = "title " + gameStatusTitle;
  return (
    <div className={titleClassName}>
      <h3>CONNECT FOUR</h3>
      <h6 className={color}>
        Player {props.isRedTurn ? "Red" : "Yellow"},
        {props.isGameWon ? " You Have Won!" : " It Is Your Turn"}
      </h6>
    </div>
  );
}

export default Title;
