import React from "react";
import Sketch from "react-p5";

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let ai = "X";
let human = "O";
let currentPlayer = human;
let height = 500;
let width = 500;
export default (props) => {
  let one_box_weight, one_box_height;
  const setup = (p5, canvasParentRef, mousePressed) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(500, 500).parent(canvasParentRef);
    one_box_weight = width / 3;
    one_box_height = height / 3;
  };

  const draw = (p5) => {
    p5.background("#fff0ff");
    p5.strokeWeight(4);

    p5.line(one_box_weight, 0, one_box_height, height);
    p5.line(one_box_weight * 2, 0, one_box_height * 2, height);
    p5.line(0, one_box_height, width, one_box_height);
    p5.line(0, one_box_height * 2, width, one_box_height * 2);

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let x = one_box_weight * i + one_box_weight / 2;
        let y = one_box_height * j + one_box_height / 2;
        let spot = board[i][j];
        p5.textSize(32);
        let r = one_box_weight / 4;
        if (spot == human) {
          p5.noFill();
          p5.ellipse(x, y, r * 2);
        } else if (spot == ai) {
          p5.line(x - r, y - r, x + r, y + r);
          p5.line(x + r, y - r, x - r, y + r);
        }
      }
    }
    const mousePressed = (p5) => {
      if (currentPlayer == human) {
        let i = p5.floor(p5.mouseX / one_box_weight);
        let j = p5.floor(p5.mouseY / one_box_height);

        if (board[i][j] == "") {
          board[i][j] = human;
          currentPlayer = ai;
          bestMove();
        }
      }
    };
    p5.mousePressed = () => mousePressed(p5);

    function bestMove() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            board[i][j] = ai;
            let score = minimax(board, 0, false);
            board[i][j] = "";
            if (score > bestScore) {
              bestScore = score;
              move = { i, j };
            }
          }
        }
      }
      board[move.i][move.j] = ai;
      currentPlayer = human;
    }

    let scores = {
      X: 10,
      O: -10,
      tie: 0,
    };

    function minimax(board, depth, isMaximizing) {
      let result = checkWinner();
      if (result !== null) {
        return scores[result];
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (board[i][j] == "") {
              board[i][j] = ai;
              let score = minimax(board, depth + 1, false);
              board[i][j] = "";
              bestScore = p5.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (board[i][j] == "") {
              board[i][j] = human;
              let score = minimax(board, depth + 1, true);
              board[i][j] = "";
              bestScore = p5.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    }

    function equals3(a, b, c) {
      return a == b && b == c && a != "";
    }

    function checkWinner() {
      let winner = null;

      // horizontal
      for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
          winner = board[i][0];
        }
      }

      for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
          winner = board[0][i];
        }
      }

      if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
      }
      if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
      }

      let openSpots = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            openSpots++;
          }
        }
      }

      if (winner == null && openSpots == 0) {
        return "tie";
      } else {
        return winner;
      }
    }

    let result = checkWinner();
    if (result != null) {
      p5.noLoop();
      let resultP = p5.createP("");
      resultP.style("font-size", "32pt");
      if (result == "tie") {
        resultP.html("Tie!");
      } else {
        resultP.html(`${result} wins!  `);
      }
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};
