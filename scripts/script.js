const gameboard = (function () {
  const board = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

  const boardContainer = document.querySelector(".gameboard-container");

  function render() {
    boardContainer.replaceChildren();

    board.forEach((outerElem, i) => {
      outerElem.forEach((innerElem, j) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.dataset.y = i;
        div.dataset.x = j;
        boardContainer.append(div);
      });
    });
  }

  function update() {
    boardContainer.childNodes.forEach((child) => {
      const { y, x } = child.dataset;
      child.textContent = board[y][x];
    });
  }

  function placeMarker(y, x, marker) {
    if (board[y][x] === null) {
      board[y][x] = marker;
      update();
    } else {
      alert("Choose different cell.");
    }
  }

  function getBoard() {
    return board;
  }

  return {
    render,
    placeMarker,
    getBoard,
  };
})();

const playerFactory = (playerName, playerMarker) => {
  const name = playerName;
  const marker = playerMarker;

  function getName() {
    return name;
  }

  function getMarker() {
    return marker;
  }

  return {
    getName,
    getMarker,
  };
};

const gameController = (function () {
  const player1 = playerFactory("Player 1", "X");
  const player2 = playerFactory("Player 2", "O");
  const players = [player1, player2];

  function switchPlayer() {
    [players[0], players[1]] = [players[1], players[0]];
  }

  function declareWinner(player) {
    console.log(`${player.getName()} has won!`);
  }

  function checkResult(player) {
    function evaluateArray(array) {
      if (array.every((item) => item === player.getMarker())) {
        return true;
      }

      return false;
    }

    function checkStraight() {
      let result = false;
      const row = [];
      const column = [];

      for (let i = 0; i < gameboard.getBoard().length; i += 1) {
        for (let j = 0; j < gameboard.getBoard().length; j += 1) {
          row.push(gameboard.getBoard()[i][j]);
          column.push(gameboard.getBoard()[j][i]);
        }

        if (evaluateArray(row) || evaluateArray(column)) {
          i = gameboard.getBoard().length;
          result = true;
        }

        row.length = 0;
        column.length = 0;
      }

      return result;
    }

    function checkDiagonally() {
      let result = false;
      const diagonal1 = [];
      const diagonal2 = [];

      for (let i = 0; i < gameboard.getBoard().length; i += 1) {
        diagonal1.push(gameboard.getBoard()[i][i]);
        diagonal2.push(
          gameboard.getBoard()[i][gameboard.getBoard().length - 1 - i]
        );
      }

      result = evaluateArray(diagonal1) || evaluateArray(diagonal2);

      return result;
    }

    if (checkStraight() || checkDiagonally()) {
      declareWinner(player);
    }
  }

  function playRound(event) {
    const { y, x } = event.target.dataset;
    const activePlayer = players[0];

    gameboard.placeMarker(y, x, activePlayer.getMarker());

    checkResult(activePlayer);
    switchPlayer();
  }

  function init() {
    gameboard.render();

    const gameboardCells = document.querySelectorAll(".cell");
    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", playRound);
    });
  }

  return {
    init,
  };
})();

gameController.init();
