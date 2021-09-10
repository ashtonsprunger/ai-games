let currentBoard = [5, 5, 5]
 
const sortBoard = (board) => {
    board.sort()
    return board
}

const simplifyBoard = (board) => {
    return [...new Set(board)];
}

const getMoves = (board) => {
    board = simplifyBoard(board)
    let moves = []
    board.forEach((space) => {
        for(let i = 0; i < Math.ceil(space/2); i++){
            for(let j = 1; j <= space - (i*2); j++){
                moves.push([space, i, j])
            }
        }
    });
    return moves
}

const playMove = (board, move) => {
    board = [...board]
    let space = move[0]
    let secondSpace;
    // is whole space
    if(move[2] == space){
        space = 0
    // starts at beginning
    }else if(move[1] == 0){
        space -= move[2]
    // ends at end
    } else if(move[1] + move[2] == space){
        space = move[1]
    // starts and ends in middle
    } else {
        space = space - (move[2] + move[1])
        secondSpace = move[1]
    }
    if(space != 0){
        board[board.indexOf(move[0])] = space
    }else{
        board.splice(board.indexOf(move[0]), 1)
    }
    if(secondSpace){
        board.push(secondSpace)
    }
    return board
}


const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
    if((board.length == 0)){
        return maximizingPlayer ? 10 : -10
    }
    if(maximizingPlayer){
        let maxEval = -Infinity
        let eval
        let moves = getMoves(board)
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
        let moves = getMoves(board)
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

const getBestMove = () => {
    let moves = getMoves(currentBoard)
    let evals = []
    moves.forEach(move => {
        evals.push(minimax(playMove(currentBoard, move), 5, -Infinity, Infinity, false))
    })
    return moves[evals.indexOf(Math.max(...evals))]
}

console.log(getBestMove())

// console.log(currentBoard)
// while(currentBoard.length > 0){
//     currentBoard = playMove(currentBoard, getBestMove())
//     console.log(currentBoard)
// }