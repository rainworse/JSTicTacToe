const cellIds = [
  "cellOne",
  "cellTwo",
  "cellThree",
  "cellFour",
  "cellFive",
  "cellSix",
  "cellSeven",
  "cellEight",
  "cellNine",
];

const GameBoard = () => {
  const cells = [];

  for (let i = 0; i < 9; i++) {
    cells[i] = Cell(cellIds[i]);
  }

  return { cells };
};

const Cell = (cellID) => {
  let cellValue = "";
  const id = cellID;
  const setCellValue = (val) => {
    cellValue = val;
  };
  const getCellValue = () => cellValue;
  const getId = () => id;
  const isOccupied = () => cellValue !== "";
  return {
    setCellValue,
    getCellValue,
    getId,
    isOccupied,
  };
};

const DisplayController = ((boardContainer) => {
  const domBoardContainer = boardContainer;
  document
    .getElementById("start-new-game")
    .addEventListener("click", startNewGame);
  const gameEndElement = document.getElementById("outcome");

  const updateDisplay = (board) => {
    domBoardContainer.innerHTML = "";
    for (let i = 0; i < board.cells.length; i++) {
      domBoardContainer.appendChild(createBoardCell(board.cells[i]));
    }
  };

  const finishGame = (winner) => {
    const gameEndText = winner === undefined ? "Draw" : winner.concat(" wins");
    gameEndElement.textContent = gameEndText;
  };

  function startNewGame() {
    gameEndElement.textContent = "";
    GameController.startNewGame(
      document.getElementById("player1-name").value,
      document.getElementById("player2-name").value
    );
  }

  function createBoardCell(cell) {
    const newCell = document.createElement("div");
    newCell.classList.add("cell");
    newCell.textContent = cell.getCellValue();
    newCell.id = cell.getId();
    newCell.addEventListener("click", handleClickedCell);
    return newCell;
  }

  function handleClickedCell(event) {
    const { target } = event;
    GameController.updateBoard(target.id);
  }

  return { updateDisplay, finishGame };
})(document.getElementById("game-board-container"));

const GameController = (() => {
  let board = GameBoard();
  DisplayController.updateDisplay(board);

  const player1 = { marker: "🗙", name: "player1" };
  const player2 = { marker: "⭕", name: "player2" };
  let player1Turn = true;
  let gameFinished = false;

  const startNewGame = (player1Name, player2Name) => {
    if (player1Name !== undefined) {
      player1.name = player1Name;
    }
    if (player2Name !== undefined) {
      player2.name = player2Name;
    }
    player1Turn = true;
    gameFinished = false;
    board = GameBoard();
    DisplayController.updateDisplay(board);
  };

  function getCurrentPlayer() {
    if (player1Turn) {
      return player1;
    }
    return player2;
  }

  function checkGameWon() {
    const currentPlayer = getCurrentPlayer();
    const occupiedCells = [];
    for (let i = 0; i < board.cells.length; i++) {
      if (board.cells[i].getCellValue() === currentPlayer.marker) {
        occupiedCells.push(i);
      }
    }
    return (
      (occupiedCells.includes(0) &&
        occupiedCells.includes(1) &&
        occupiedCells.includes(2)) ||
      (occupiedCells.includes(3) &&
        occupiedCells.includes(4) &&
        occupiedCells.includes(5)) ||
      (occupiedCells.includes(6) &&
        occupiedCells.includes(7) &&
        occupiedCells.includes(8)) ||
      (occupiedCells.includes(0) &&
        occupiedCells.includes(3) &&
        occupiedCells.includes(6)) ||
      (occupiedCells.includes(1) &&
        occupiedCells.includes(4) &&
        occupiedCells.includes(7)) ||
      (occupiedCells.includes(2) &&
        occupiedCells.includes(5) &&
        occupiedCells.includes(8)) ||
      (occupiedCells.includes(0) &&
        occupiedCells.includes(4) &&
        occupiedCells.includes(8)) ||
      (occupiedCells.includes(2) &&
        occupiedCells.includes(4) &&
        occupiedCells.includes(6))
    );
  }

  function checkDraw() {
    return board.cells.filter((c) => !c.isOccupied()).length === 0;
  }

  const updateBoard = (clickedCellID) => {
    const clickedCell = board.cells.find((c) => c.getId() === clickedCellID);
    if (!gameFinished && clickedCell && !clickedCell.isOccupied()) {
      clickedCell.setCellValue(getCurrentPlayer().marker);
      if (checkGameWon()) {
        DisplayController.finishGame(getCurrentPlayer().name);
        gameFinished = true;
      } else if (checkDraw()) {
        DisplayController.finishGame(undefined);
        gameFinished = true;
      }
      player1Turn = !player1Turn;
      DisplayController.updateDisplay(board);
    }
  };

  return { updateBoard, startNewGame };
})();
