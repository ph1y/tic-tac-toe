const gameboard = (function () {
  let board = [];
  const boardContainer = document.querySelector(".gameboard-container");

  function render() {
    boardContainer.replaceChildren();

    board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));

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

  function placeMarker(y, x, player) {
    if (board[y][x] === null) {
      board[y][x] = player.getMarker();
      update();
    } else {
      gameController.updateStatusMsg(
        `${player.getName()}, choose a different cell.`
      );
      gameController.switchPlayer();
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
  let player1 = {};
  let player2 = {};
  let players = [];
  let gameOver = false;
  const statusArea = document.querySelector(".status-area");

  function switchPlayer() {
    [players[0], players[1]] = [players[1], players[0]];
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

    return checkStraight() || checkDiagonally();
  }

  function checkTie() {
    let result = true;

    gameboard.getBoard().forEach((outerElem) => {
      if (outerElem.some((innerElem) => innerElem === null)) {
        result = false;
      }
    });

    return result;
  }

  function updateStatusMsg(msg) {
    statusArea.textContent = msg;
  }

  function playRound(event) {
    const { y, x } = event.target.dataset;
    const activePlayer = players[0];
    const nextPlayer = players[1];

    if (!gameOver) {
      updateStatusMsg(`${nextPlayer.getName()}'s turn.`);
      gameboard.placeMarker(y, x, activePlayer);
    }

    if (checkResult(activePlayer) && !gameOver) {
      gameOver = true;
      updateStatusMsg(`${activePlayer.getName()} has won!`);
    } else if (checkTie()) {
      gameOver = true;
      updateStatusMsg("It is a tie!");
    } else if (!gameOver) {
      switchPlayer();
    }
  }

  function setUpInterface() {
    gameboard.render();

    const gameboardCells = document.querySelectorAll(".cell");
    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", playRound);
    });

    const inputArea = document.querySelector(".input-area");
    inputArea.setAttribute("hidden", true);

    statusArea.removeAttribute("hidden");
    updateStatusMsg(`${player1.getName()}'s turn.`);

    const boardContainer = document.querySelector(".gameboard-container");
    boardContainer.removeAttribute("hidden");

    const controls = document.querySelector(".controls");
    controls.removeAttribute("hidden");

    const newRoundBtn = document.querySelector("#new-round-btn");
    newRoundBtn.addEventListener("click", () => {
      gameOver = false;
      players = [player1, player2];
      setUpInterface();
    });

    const resetBtn = document.querySelector("#reset-btn");
    resetBtn.addEventListener("click", () => {
      window.location.reload(true);
    });
  }

  function init() {
    const inputForm = document.querySelector(".input-form");
    inputForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = new FormData(event.target);
      player1 = playerFactory(input.get("player1"), "X");
      player2 = playerFactory(input.get("player2"), "O");
      players = [player1, player2];

      if (player1.getName() !== "" && player2.getName() !== "") {
        setUpInterface();
      } else {
        alert("Please enter the player's names to start the game.");
      }
    });
  }

  return {
    init,
    updateStatusMsg,
    switchPlayer,
  };
})();

gameController.init();
