
/*----- state variables -----*/

const state = {
    board: null,
    player: 'x'

};


/*----- cached elements  -----*/
const squares = document.querySelectorAll('.square');
const resetBtn = document.querySelector('button');

/*----- event listeners -----*/

// loop through squares and listen for a click on each
squares.forEach(function(square) {
  square.addEventListener('click', placeTile);
});
resetBtn.addEventListener('click', init);

/*----- functions -----*/
init();

function init() {
state.board = {
    'top-left': null, 'top-center': null, 'top-right': null,
    'center-left': null, 'center-center': null, 'center-right': null,
    'bottom-left': null, 'bottom-center': null, 'bottom-right': null,
};
state.player = 'x';
render();
}

function render() {
for (let id in state.board) {
  document.getElementById(id).innerText = state.board[id];
}
}

function placeTile () {
    const id = this.id;

if (state.board[id]) return; //exit the function if this tile already has been occupied

    state.board[id] = state.player;

   /// if (state.player === 'x') {
     ///   state.player = 'o';
   // } else {
       // state.player = 'x';
   /// }
   state.player = state.player === 'x' ? 'o' : 'x';// switching players 

    render();
    
}



