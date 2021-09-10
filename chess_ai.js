// 1 - 10
let DIFFICAULTY = 10

DIFFICAULTY--

let time = 500

let  p= 1
let  n= 3
let  b= 3.1
let  r= 5
let  q= 9
let  k= 500


let currentBoard = [
  [r, n, b, q, k, b, n, r],
  [p, p, p, p, p, p, p, p],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-p, -p, -p, -p, -p, -p, -p, -p],
  [-r, -n, -b, -q, -k, -b, -n, -r],
];

currentBoard = [
  [r, n, b, q, k, b, n, r],
  [p, p, p, p, p, p, p, p],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, -p, 0, p, 0, 0],
  [-p, -p, -p, -p, -p, -p, -p, -p],
  [-r, -n, -b, -q, -k, -b, -n, -r],
];

let availibleMoves = []
let currentPiece
let HUMAN = -1
let AI = 1
let TURN = HUMAN


// const human = [-1, -5];
// const ai = [1, 5];

const pieceIsPlayers = (piece, player) => {
  return (piece < 0 && player < 0) || (piece > 0 && player > 0)
}

const pieceIsPiece = (piece, piece2) => {
  return Math.abs(piece) == Math.abs(piece2)
}

const printBoard = (board) => {
  let output = ''
  let pieces = { "-1": " H ", "-5": "<H>", 1: " C ", 5: "<C>", 0: " _ " };
  // let pieceSpace = { "-1": "   ", "-5": " | ", 1: "   ", 5: " | ", 0: "   " };
  // console.log(" a b c d e f g h");
  console.log(" _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _");
  output += " _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _\n"
  for (let y = 0; y < board.length; y++) {
    let str = "|";
    let space = "|";
    for (let x = 0; x < board[0].length; x++) {
      str += `${pieces[board[y][x]]}|`;
      if (x < 7) {
        space += ` - +`;
      }
    }
    console.log(str);
    output += str+'\n'
    if (y < 7) {
      console.log(space + " - |");
      // output += space + " - |" + '\n'
    }
  }
  console.log("|- - - - - - - - - - - - - - - -|");
  output += "|- - - - - - - - - - - - - - - -|"
  return output
};

const getScore = (board) => {
  // let human = 0.001;
  // let ai = -0.001;
  let human = 0;
  let ai = 0;
  let total = 0
  board.forEach((row) => {
    row.forEach((space) => {
      if (space > 0){
        ai += space
      }else{
        human -= space
      }
      total += space
    });
  });
  return (ai/human);
  // return total
};

const playMove = (board, move) => {
  let copiedBoard = [[...board[0]],[...board[1]],[...board[2]],[...board[3]],[...board[4]],[...board[5]],[...board[6]],[...board[7]],];
  let start = move[0];
  let end = move[1];
  let piece = copiedBoard[start[0]][start[1]];
  copiedBoard[start[0]][start[1]] = 0;
  if (Math.abs(piece) == 1 && end[0] == (piece < 0 ? 0 : 7)) {
    piece = piece * 5;
  }
  copiedBoard[end[0]][end[1]] = piece;
  if (Math.abs(start[0] - end[0]) == 2) {
    let newY = (start[0] + end[0]) / 2;
    let newX = (start[1] + end[1]) / 2;
    copiedBoard[newY][newX] = 0;
  }
  return copiedBoard;
};

const getMoves = (board, player) => {
  let moves = [];
  for(let y = 0; y < board.length; y++){
    for(let x = 0; x < board.length; x++){
      let current = board[y][x]
      if(current == 0 || !pieceIsPlayers(current, player)) continue
      if(pieceIsPiece(current, p)){
        if(board[y+player][x] == 0){
          // pawns foward
          moves.push([[y, x], [y+player, x]])
          if(board[y+player+player][x] == 0 && (y == 1 || y == 6)){
            // pawns foward twice
            moves.push([[y, x], [y+player+player, x]])
          }
        }
        // pawns capture diagonally left
        if(board[y+player][x-1] != 0 && !pieceIsPlayers(board[y+player][x-1], player)){
          moves.push([[y, x], [y+player, x-1]])
        }
        // pawns capture diagonally right
        if(board[y+player][x+1] != 0 && !pieceIsPlayers(board[y+player][x+1], player)){
          moves.push([[y, x], [y+player, x+1]])
        }
        //! en pesant
      }
    }
  }
  return moves;
};

const checkWinner = (board) => {
  let neg = 0
  let pos = 0
  for(let y = 0; y < board.length; y++){
    for(let x = 0; x < board[0].length; x++){
      let current = board[y][x]
      if(current > 0){
        pos++
      }else if(current < 0){
        neg++
      }
    }
  }
  if(neg == 0){
    return Infinity
  }
  if(pos == 0){
    return -Infinity
  }
  return 0
}

const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
  let winner = checkWinner(board)
  // if(winner != 0){
    //   return winner
    // }
    if(depth == 0 || winner != 0){
      return getScore(board)
    }
    if(maximizingPlayer){
      let maxEval = -Infinity
      let eval
      let moves = getMoves(board, ai)
      for(let i = 0; i < moves.length; i++){
        let move = moves[i]
        eval = minimax(playMove(board, move), depth-1, alpha, beta, false)
        maxEval = Math.max(maxEval, eval)
        alpha = Math.max(alpha, eval)
        if(beta <= alpha){
          break
        }
      }
      return maxEval
    }else{
      let minEval = Infinity
      let eval
      let moves = getMoves(board, human)
      for(let i = 0; i < moves.length; i++){
        let move = moves[i]
        eval = minimax(playMove(board, move), depth-1, alpha, beta, true)
        minEval = Math.min(minEval, eval)
        beta = Math.min(beta, eval)
        if(beta <= alpha){
          break
        }
      }
      return minEval
    }
  }
  
  const getBestMove = (board) => {
    let moves = getMoves(board, ai)
    let evals = []
    moves.forEach(move => {
      evals.push(minimax(playMove(board, move), DIFFICAULTY, -Infinity, Infinity, false))
    })
    console.log(evals)
    let max = Math.max(...evals)
    moves = moves.filter((move, index) => evals[index] == max)
    return moves[Math.floor(Math.random()*moves.length)]
  }
  
  const displayCurrentBoardToDom = () => {
    const boardEl = document.getElementById('board')
    boardEl.innerHTML = ''
    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 8; j++){
        let tile = document.createElement('div')
      if((i+j)%2 == 0){
        tile.classList.add('light')
      }else{
        tile.classList.add('dark')
      }
      boardEl.appendChild(tile)
    }
  }
  let whitePre = './chess_images/white/white_'
  let blackPre = './chess_images/black/black_'
  let paths = {[p]:'pawn',[n]:'knight',[b]:'bishop',[r]: 'rook', [q]: 'queen', [k]: 'king'}
  for (let y = 0; y < currentBoard.length; y++) {
    for (let x = 0; x < currentBoard[0].length; x++) {
      let current = currentBoard[y][x]
      if(current == 0){
        continue
      }
      let pieceEl = document.createElement('div')
      pieceEl.classList.add('piece')
      pieceEl.style.left = `${(x*87.5) + 11.25}px`
      pieceEl.style.top = `${(y*87.5) + 11.25}px`
      pieceEl.style.backgroundImage = `url('${current > 0 ? blackPre : whitePre}${paths[Math.abs(current)]}.png')`
      // pieceEl.style.border = borders[current]
      // if(Math.abs(current) > 1){
      //   pieceEl.classList.add('border')
      // }
      pieceEl.id = `[${y},${x}]`
      pieceEl.addEventListener('click', (e) => {
        selectPiece(JSON.parse(e.target.id))
      })
      boardEl.appendChild(pieceEl)
    }
  }
  availibleMoves.forEach(move => {
    let moveEl = document.createElement('div')
    moveEl.classList.add('move')
    moveEl.style.left = `${(move[1][1]*87.5) + 21.875}px`
    moveEl.style.top = `${(move[1][0]*87.5) + 21.875}px`
    moveEl.style.backgroundColor = 'rgba(255,255,255,1)'
    moveEl.id = `[${move[1][0]},${move[1][1]}]`
    moveEl.addEventListener('click', (e) => {
      moveAnimate([currentPiece, JSON.parse(e.target.id)], e.target, 22, true)
      // currentBoard = playMove(currentBoard, [currentPiece, JSON.parse(e.target.id)])
      // TURN = AI
      // availibleMoves = []
      // displayCurrentBoardToDom()
      // setTimeout(() => {
      //   let move = getBestMove(currentBoard)
      //   currentBoard = playMove(currentBoard, move)
      //   displayCurrentBoardToDom()
      //   TURN = HUMAN
      // }, time)
      setTimeout(() => {
        let move = getBestMove(currentBoard)
        moveAnimate(move, null, 22)
      }, 600)
    })
    boardEl.appendChild(moveEl)
  })
}

const moveAnimate = (move, el, times) => {
  if(times == 22){

    availibleMoves = []
    displayCurrentBoardToDom()
  }
  if(times == 0){
    //someting
    console.log('whoa', TURN)
    // if(TURN == HUMAN && special){
      currentBoard = playMove(currentBoard, move)
      displayCurrentBoardToDom()
      TURN = TURN == AI ? HUMAN : AI
      // moveAnimate(move, null, 0)
    // }else{
      
      // setTimeout(() => {
        
        // let moveAi = getBestMove(currentBoard)
        // moveAnimate(moveAi, null, 44)
      // }, 10)
      // currentBoard = playMove(currentBoard, move)
      // displayCurrentBoardToDom()
      // TURN = HUMAN
    // }
    // }
    // TURN = TURN == AI ? HUMAN : AI
    return
  }
  if(Math.abs(move[0][0] - move[1][0]) == 2){
    document.getElementById(JSON.stringify(move[0])).style.left = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.left)-(move[0][1]-move[1][1])*4}px`
    document.getElementById(JSON.stringify(move[0])).style.top = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.top)-(move[0][0]-move[1][0])*4}px`
  }else{
    console.log('id:', JSON.stringify(move[0]))
    document.getElementById(JSON.stringify(move[0])).style.left = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.left)-(move[0][1]-move[1][1])*4}px`
    document.getElementById(JSON.stringify(move[0])).style.top = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.top)-(move[0][0]-move[1][0])*4}px`
  }
  setTimeout(()=>moveAnimate(move, el, times-1),10)
}

const selectPiece = (piece) => {
  // console.log(piece)
  // console.log(getMoves(currentBoard))
  // console.log(availibleMoves)
  if(TURN == HUMAN){
    availibleMoves = getMoves(currentBoard, HUMAN).filter(move => move[0][0] == piece[0] && move[0][1] == piece[1])
    currentPiece = piece
    displayCurrentBoardToDom()
  }
}

// while(true){
  //   let input = prompt(printBoard(currentBoard))
  //   currentBoard = playMove(currentBoard, JSON.parse(input.trim()))
  //   currentBoard = playMove(currentBoard, getBestMove(currentBoard))
  // }
  
  // if(TURN == AI){
  //   currentBoard = playMove(currentBoard, getBestMove(board))
  //   displayCurrentBoardToDom()
  // }
  
  displayCurrentBoardToDom()
  