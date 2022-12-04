let time = 500

let currentBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
];

  // currentBoard = [
  //   [0, 5, 0, 1, 0, 0, 0, 0],
  //   [5, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, -5, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  // ];

let availibleMoves = []
let currentPiece
let HUMAN = -1
let AI = 1
let TURN = HUMAN


const human = [-1, -5];
const ai = [1, 5];

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
  console.log('Query variable %s not found', variable);
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

const reducer = (previousValue, currentValue) => previousValue + currentValue;
const reducer2 = (previousValue, currentValue) => [previousValue[0] + currentValue[0], previousValue[1] + currentValue[1]];

const getScore = (board) => {
  // let human = 0.001;
  // let ai = -0.001;
  let human = 0.001;
  let ai = 0.001;
  // let avgHDist = []
  // let avgAiDist = []
  let avgHPos = []
  let avgAiPos = []
  let total = 0
  board.forEach((row, y) => {
    row.forEach((space, x) => {
      if (space > 0){
        ai += space
        // avgAiDist.push(Math.abs(y+x -8)+8)
        avgAiPos.push([y,x])
      }else if(space < 0){
        human -= space
        // avgHDist.push(Math.abs(y+x -8)+8)
        avgHPos.push([y,x])
      }
      total += space
    });
  });
  // console.log(avgHDist, avgAiDist)
  // let avgH = 0
  // let avgAi = 0
  // if(avgHDist.length > 0 && avgAiDist.length > 0){
  //   avgH = avgHDist.reduce(reducer)/avgHDist.length
  //   avgAi = avgAiDist.reduce(reducer)/avgAiDist.length
  // }
  let summedAiPos = [0, 0]
  let summedHPos = [0, 0]
  if(avgHPos.length > 0 && avgAiPos.length > 0){
    summedHPos = avgHPos.reduce(reducer2)
    summedAiPos = avgAiPos.reduce(reducer2)
  }
  summedAiPos[0] = summedAiPos[0] / avgAiPos.length
  summedAiPos[1] = summedAiPos[1] / avgAiPos.length
  summedHPos[0] = summedHPos[0] / avgHPos.length
  summedHPos[1] = summedHPos[1] / avgHPos.length
  let dist = 16-Math.abs(summedAiPos[0]-summedHPos[0] + summedAiPos[1]-summedHPos[1])
  // let avgDistEval = avgH - avgAi
  let totalEval = (ai/human)/*+(avgDistEval/1000)*/
  if(dist){
    totalEval += dist/800
  }
  return totalEval;
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
  let pawn = player[0];
  let king = player[1];
  let pawn2 = pawn * -1;
  let king2 = king * -1;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      let piece = board[y][x];
      if (piece != pawn && piece != king) {
        continue;
      }
      // move foward and left
      if (board[y + pawn] != undefined && board[y + pawn][x - 1] == 0) {
        moves.push([
          [y, x],
          [y + pawn, x - 1],
        ]);
      }
      // move foward and right
      if (board[y + pawn] != undefined && board[y + pawn][x + 1] == 0) {
        moves.push([
          [y, x],
          [y + pawn, x + 1],
        ]);
      }
      // jump foward and left
      if (
        board[y + pawn] != undefined &&
        (board[y + pawn][x - 1] == pawn2 || board[y + pawn][x - 1] == king2) &&
        board[y + pawn + pawn] != undefined &&
        board[y + pawn + pawn][x - 2] == 0
        ) {
          moves.push([
            [y, x],
            [y + pawn + pawn, x - 2],
          ]);
        }
        // jump foward and right
        if (
          board[y + pawn] != undefined &&
          (board[y + pawn][x + 1] == pawn2 || board[y + pawn][x + 1] == king2) &&
          board[y + pawn + pawn] != undefined &&
          board[y + pawn + pawn][x + 2] == 0
          ) {
            moves.push([
              [y, x],
          [y + pawn + pawn, x + 2],
        ]);
      }
      if (piece == king) {
        // move backward and left
        if (board[y - pawn] != undefined && board[y - pawn][x - 1] == 0) {
          moves.push([
            [y, x],
            [y - pawn, x - 1],
          ]);
        }
        // move backward and right
        if (board[y - pawn] != undefined && board[y - pawn][x + 1] == 0) {
          moves.push([
            [y, x],
            [y - pawn, x + 1],
          ]);
        }
        // jump backward and left
        if (
          board[y - pawn] != undefined &&
          (board[y - pawn][x - 1] == pawn2 ||
            board[y - pawn][x - 1] == king2) &&
            board[y - pawn - pawn] != undefined &&
            board[y - pawn - pawn][x - 2] == 0
            ) {
              moves.push([
                [y, x],
                [y - pawn - pawn, x - 2],
              ]);
            }
            // jump backward and right
            if (
              board[y - pawn] != undefined &&
              (board[y - pawn][x + 1] == pawn2 ||
                board[y - pawn][x + 1] == king2) &&
                board[y - pawn - pawn] != undefined &&
                board[y - pawn - pawn][x + 2] == 0
                ) {
                  moves.push([
                    [y, x],
            [y - pawn - pawn, x + 2],
          ]);
        }
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
      return getScore(board) + depth/1000
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

  const updateTurns = () => {
    const aiEl = document.getElementById('ai')
    const humanEl = document.getElementById('human')
    if(TURN == HUMAN){
      humanEl.innerText = 'YOUR TURN'
      aiEl.innerText = '- - -'
    }else {
      aiEl.innerText = 'DAVE\'S TURN'
      humanEl.innerText = '- - -'
    }
    if(TURN == HUMAN && getMoves(currentBoard, human).length == 0){
      humanEl.innerText = 'DAVE WON'
      aiEl.innerText = ''
    }else if(TURN == AI && getMoves(currentBoard, ai).length == 0){
      humanEl.innerText = 'YOU WON'
      aiEl.innerText = ''
    }
  }
  
  const displayCurrentBoardToDom = () => {
    updateTurns()
    const boardEl = document.getElementById('board')
    boardEl.innerHTML = ''
    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 8; j++){
        let tile = document.createElement('div')
      if((i+j)%2 == 0){
        tile.style.backgroundColor = 'blue'
      }else{
        tile.style.backgroundColor = 'black'
      }
      boardEl.appendChild(tile)
    }
  }
  let colors = {'-1':'red','-5':'red','1':'green', '5': 'green'}
  let borders = {'-1':'none','-5':'5px solid white','1':'none', '5': '5px solid white'}
  for (let y = 0; y < currentBoard.length; y++) {
    for (let x = 0; x < currentBoard[0].length; x++) {
      let current = currentBoard[y][x]
      if(current == 0){
        continue
      }
      let pieceEl = document.createElement('div')
      pieceEl.classList.add('piece')
      pieceEl.style.left = `${(x*12.5) + 1.75}%`
      pieceEl.style.top = `${(y*12.5) + 1.75}%`
      pieceEl.style.backgroundColor = colors[current]
      // pieceEl.style.border = borders[current]
      if(Math.abs(current) > 1){
        pieceEl.classList.add('border')
      }
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
    moveEl.style.left = `${(move[1][1]*12.5) + 1.75}%`
    moveEl.style.top = `${(move[1][0]*12.5) + 1.75}%`
    moveEl.style.backgroundColor = 'rgba(255,255,255,.4)'
    moveEl.id = `[${move[1][0]},${move[1][1]}]`
    moveEl.addEventListener('click', (e) => {
      availibleMoves = []
      displayCurrentBoardToDom()
      let move = [currentPiece, JSON.parse(e.target.id)]
      currentBoard = playMove(currentBoard, move)
      moveAnimate(move, e.target, 44, true)
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
        currentBoard = playMove(currentBoard, move)
        moveAnimate(move, null, 44)
      }, 1000)
    })
    boardEl.appendChild(moveEl)
  })
}

const moveAnimate = (move, el, times) => {
  if(times == 44){

    availibleMoves = []
    // displayCurrentBoardToDom()
  }
  if(times == 0){
    //someting
    // if(TURN == HUMAN && special){
      // currentBoard = playMove(currentBoard, move)
      // if(TURN == AI){
        displayCurrentBoardToDom()
        // }
        TURN = TURN == AI ? HUMAN : AI
          updateTurns()
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
    document.getElementById(JSON.stringify(move[0])).style.left = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.left)-(move[0][1]-move[1][1])*.28}%`
    document.getElementById(JSON.stringify(move[0])).style.top = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.top)-(move[0][0]-move[1][0])*.28}%`
  }else{
    console.log('id:', JSON.stringify(move[0]))
    document.getElementById(JSON.stringify(move[0])).style.left = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.left)-(move[0][1]-move[1][1])*.28}%`
    document.getElementById(JSON.stringify(move[0])).style.top = `${Number.parseFloat(document.getElementById(JSON.stringify(move[0])).style.top)-(move[0][0]-move[1][0])*.28}%`
  }
  setTimeout(()=>moveAnimate(move, el, times-1),10)
}

const selectPiece = (piece) => {
  // console.log(piece)
  // console.log(getMoves(currentBoard))
  // console.log(availibleMoves)
  if(TURN == HUMAN){
    availibleMoves = getMoves(currentBoard, human).filter(move => move[0][0] == piece[0] && move[0][1] == piece[1])
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
  
  // 1 - 10
let DIFFICAULTY = getQueryVariable('diff')

if(!DIFFICAULTY) DIFFICAULTY = 10

DIFFICAULTY--

if(DIFFICAULTY < 0){
  DIFFICAULTY = 0
}
if(DIFFICAULTY > 9){
  DIFFICAULTY = 9
}

console.log('diff:', DIFFICAULTY+1)
