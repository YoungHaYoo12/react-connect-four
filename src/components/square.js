import React from "react";

import "./square.css";

/* Square represents a single unit on the connect-four board */
function Square(props) {
  /* opaqueBackgroundColor used to give a slight transparent color to squares that the user
  hovers over */
  const opaqueBackgroundColor = props.isRedTurn ? "opaqueRed" : "opaqueYellow";
  let className;

  // condition to prevent already filled squares from changing color when hovered over
  if (props.value == null)
    className =
      "square btn-default " + props.value + " " + opaqueBackgroundColor;
  else {
    className = "square btn-default " + props.value;
  }

  return <button className={className} onClick={props.onClick} />;
}

export default Square;
