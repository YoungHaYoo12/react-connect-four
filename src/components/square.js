import React from "react";

import "./square.css";

/* Square represents a single unit on the connect-four board */
function Square(props) {
  let className = "square btn-default " + props.value;

  return <button className={className} onClick={props.onClick} />;
}

export default Square;
