function testWin(thisBoard) { // thisBoard should be a single dimension, length 9 array consisting of -1, 0 and 1
    for (const arrangement of winningArrangements) {
        let values = arrangement.map(i => thisBoard[i]); // get the three values of this arrangement
        let allValuesSame = values.every(v => v == values[0]);
        if (allValuesSame && values[0] != 0)
            return values[0];
    }
    return 0;
}

function countWinningMoves(thisBoard, player) { // counts the number of squares which would result in a win if <player> marked them
    let count = 0;
    for (let i = 0; i < 9; i++) {
        if (thisBoard[i] == 0) {
            thisBoard[i] = player;
            // todo - localised version of testWin for improved efficiency? probably negligable impact
            if (testWin(thisBoard) == player)
                count++;
            thisBoard[i] = 0;
        }
    }
    return count;
}

function getCurrentBoard() {
    let board = [];
    for (let maj = 0; maj < 9; maj++) {
        board[maj] = []
        for (let min = 0; min < 9; min++) {
            let val = 0;
            if (boxes[maj].minors[min].dataset.value == "X")
                val = 1;
            else if (boxes[maj].minors[min].dataset.value == "O") 
                val = -1;
            board[maj][min] = val;
        }
        let winner = testWin(board[maj])
        board[maj].push(winner); // make the 10th element of the subarray the victor of this game (0 for no winner yet)
    }
    return board;
}

function printBoard(board) {
    let str = "";

    for (let y = 0; y < 9; y++) {
        if (y == 3 || y == 6) {
            for (let i = 0; i < 11; i++) { str += "-" }
            str += "\n"
        }

        for (let x = 0; x < 9; x++) {
            let maj = 3*Math.floor(y / 3) + Math.floor(x / 3);
            let min = 3*(y % 3) + x % 3;
            let char = " "
            if (board[maj][min] == 1) { char = "X"; }
            else if (board[maj][min] == -1) { char = "O"; }

            
            if (x == 3 || x == 6) { str += "|" }
            str += char;

        }
        str += "\n"
        
    }
    console.log(str);
}


function evalBoard(board, thisMove) {
    // add score for: (descending order)
    // overral win
    // two small adjacent wins
    // small wins
    // two adjacent marks of the same type

    // improvements
    // two adjacent marks should count less if fewer squares can direct the player to that game to use them


    let score = 0;
    for (const player of [1, -1]) {
        let thisPlayerScore = 0;

        // TODO - incentivise placing marks in line with current victories and close to victory mini games
        
        let majorBoard = board.map(major => major[9]);
        // TODO - we don't need to include overall win at this part, that should be done in the search function for pruning
        overallWinner = testWin(majorBoard) // 10th element of major is the victor of that game
        if (overallWinner == player)
            thisPlayerScore += 100000;

        let overralWinningMoves = countWinningMoves(majorBoard, player);
        thisPlayerScore += overralWinningMoves > 0 ? 1000 : 0; // 1000 points for being one victory away from winning the game
        thisPlayerScore += 200*Math.max(overralWinningMoves - 1, 0); // 200 additional points for each extra victory that would win the game
        

        for (let i = 0; i < 9; i++) {
            if (board[i][9] == player)
                thisPlayerScore += 100;
            else {    
                let winningMoves = countWinningMoves(board[i], player);
                thisPlayerScore += winningMoves > 0 ? 10 : 0;
                thisPlayerScore += 2*Math.max(winningMoves - 1, 0);
            }
        }
        
        

        score += player * thisPlayerScore;
    }
    return score;
}


function successorBoards(board, playableMajors, player) {
    let succs = [];

    for (const maj in playableMajors) {
        for (let min = 0; min < 9; min++) {
            if (board[maj][min] == 0) {
                let newBoard = structuredClone(board);
                newBoard[maj][min] = player;
                newBoard[maj][9] = testWin(newBoard[maj]);
                
                succs.push(newBoard);
            }
        }
    }

    return succs;
}