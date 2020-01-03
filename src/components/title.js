import React from "react";

import "./title.css";

// title compartment of the connect-four board game
function Title(props) {
  // change color of title (h6 component) depending on whether red or yellow turn
  const color = props.isRedTurn ? "red-turn" : "yellow-turn";
  // change title (h3 component) depending on whether game has been won or not
  const gameStatusTitle = props.isGameWon ? "game-won" : "";
  const titleClassName = "title " + gameStatusTitle;

  let message;

  // message to display in h6 component based on state of game
  if (props.isGameTied) message = "Players Have Tied";
  else {
    const player = props.isRedTurn ? "Player Red, " : "Player Yellow, ";
    const messageToPlayer = props.isGameWon
      ? " You Have Won!"
      : " It Is Your Turn";

    message = player + messageToPlayer;
  }
  return (
    <div className={titleClassName}>
      <h3>CONNECT FOUR</h3>

      <h6 className={color}>{message}</h6>
    </div>
  );
}

export default Title;
