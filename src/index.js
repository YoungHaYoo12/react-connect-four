import React from "react";
import ReactDOM from "react-dom";
import Board from "./components/board";

import "./styles.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="game">
        <Board />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
