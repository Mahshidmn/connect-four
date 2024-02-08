/* ---------constants--------*/
const COLORS = {
  '0' : 'white',
  '1' : 'purple',
  '-1': 'orange',
};

/*----------state variables---------*/
let board;  // array of 7 coloumn arrays
let turn; // 1 or -1
let winner; // null = no winner; 1 or -1 winner; 'T' = time 

/* ---------cached elements---------*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
// for turning markerEls which is nodelis to array we can either:
// const markerEls = Array.from(document.querySelectorAll('#markers > div')); OR
const markerEls = [...document.querySelectorAll('#markers > div')];

/* ---------event listeners---------*/
document.getElementById('markers').addEventListener('click', handleDrop);
playAgainBtn.addEventListener('click', init);// Do not provoke the function (init()) just provide the function

/*----------functions---------*/
init();
// Initialize all the states, then call render()
function init() {
 // To visualize boards mapping to the DOM, rotate board array 90 degrees counter-closkwise
  board = [
    [0, 0, 0, 0, 0, 0], // colomn 0
    [0, 0, 0, 0, 0, 0], // colomn 1
    [0, 0, 0, 0, 0, 0], // colomn 2
    [0, 0, 0, 0, 0, 0], // colomn 3
    [0, 0, 0, 0, 0, 0], // colomn 4
    [0, 0, 0, 0, 0, 0], // colomn 5
    [0, 0, 0, 0, 0, 0], // colomn 6
  ];
  turn = 1;
  winner = null;
  render();
}

// In response to user interaction update all impacted states and then call render();
function handleDrop(evt) {
  const colIdx = markerEls.indexOf(evt.target);// returns -1 if where is clicked isn't in the markerEls
  // Gaurds...
  if (colIdx === -1) return;
  // Shortcut to the coloumn array
  const colArr = board[colIdx];
  // Find the index of the first 0 in colArr
  const rowIdx = colArr.indexOf(0);
  //update the board state with the current player value (turn)
  colArr[rowIdx] = turn;
// Switch player turn
  turn *= -1;
  //check for winner
  winner = getWinner(colIdx, rowIdx);
  render();
}
// check for winner in board state  and
// return null if no wimmer, 1/-1 if a player has won, 't' if tie
function getWinner(colIdx, rowIdx) {
  return checkVerticalWin(colIdx, rowIdx) ||   
         checkHorizontalWin(colIdx, rowIdx) ||
         checkDiaginalWinNESW(colIdx, rowIdx) || 
         checkDiaginalWinNWSE(colIdx, rowIdx);   
}

function checkDiaginalWinNWSE(colIdx, rowIdx) {
  const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1);
  const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1);
  return (adjCountNW + adjCountSE) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkDiaginalWinNESW(colIdx, rowIdx) {
  const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
  const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);
  return (adjCountNE + adjCountSW) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx) {
  const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
  const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
  return (adjCountLeft + adjCountRight) >= 3 ? board[colIdx][rowIdx] : null;
}
     

function checkVerticalWin(colIdx, rowIdx) {
  return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset ) {
  // shortcut variable to the player value
  const player = board[colIdx][rowIdx];
  // track count of adjacent cell with the same player value
  let count = 0;
  // Initialize new cordinates
  colIdx +=colOffset;
  rowIdx +=rowOffset;
  while (
    // ensure the colIdx is within bounce of the board array
    board[colIdx] !== undefined && 
    board[colIdx][rowIdx] !== undefined &&
    board[colIdx][rowIdx] === player
    
  ) {
    count++;
  colIdx +=colOffset;
  rowIdx +=rowOffset;
  }
  return count;
}


//Visulize all the states in the DOM
function render() {
  renderBoard();
  renderMessage();
  //Hide/show UI elements (controls)
  renderControls(); 
}

// how does js know what colArr, colIdx,etc means??

function renderBoard() {
  board.forEach(function(colArr, colIdx) {
    // Iterate over the cells in the cur coloumn (colArr)
    colArr.forEach(function(cellVal, rowIdx) {
      const cellId = `c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.style.backgroundColor = COLORS[cellVal];
    })
  });
}

function renderMessage() {
  if (winner === 'T') {
     messageEl.innerText = "It's a Tie!!!";
  } else if (winner) {
    messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> wins`;
  // Game is in play
  } else {
    messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s turn`;
  
  }
}

function renderControls() {
// Ternary expressions is the go to when we want 1 of 2 values returned
 //<condittonal expression> ? <truthy expression> ? <falsy expression>
  playAgainBtn.style.visibility = winner ? 'visible': 'hidden';
  //Iterate over the marker elements to hide/show according to the coloumn being full (no zaro's)
  markerEls.forEach(function(markerEl, colIdx){
    // hide marker if there is no more 0's or there is a winner
  const hideMarker = !board[colIdx].includes(0) || winner;
  markerEl.style.visibility = hideMarker ? 'hidden': 'visible';
  });
}

