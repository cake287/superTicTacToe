let singleplayer = true;

let boxes = [];
let isTurnCrosses = true;

const crossChar = "\u2573";
const circleChar = "\u25EF";

const winningArrangements =
[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// board is a list of boxes (major or minor) 
// returns ["X", lineStartIndex, lineEndIndex], ["O", lineStartIndex, lineEndIndex] or [" "]
function testGameWin(board) {
    for (const arrangement of winningArrangements) {
        let minorValues = arrangement.map(i => board[i].dataset.value);
        let allValuesSame = minorValues.every(v => v == minorValues[0]);
        if (allValuesSame && minorValues[0] != " ")
            return [minorValues[0], arrangement[0], arrangement[2]];
    }
    return [" "];
}


function boxClick(majorIndex, minorIndex) {
    let thisMajor = boxes[majorIndex].major;
    let thisMinor = boxes[majorIndex].minors[minorIndex];
    
    if (
        !thisMajor.classList.contains("disabled") && 
        thisMajor.dataset.value == " " && // if this mini game hasn't been won yet
        thisMinor.dataset.value == " ") // if this box in the mini game hasn't been used yet
    {
        if (isTurnCrosses) {
            thisMinor.classList.add("cross");
            thisMinor.dataset.value = "X";
            thisMinor.innerHTML = crossChar;
        } else {
            thisMinor.classList.add("circle");
            thisMinor.dataset.value = "O";
            thisMinor.innerHTML = circleChar;
        }
        
        let [gameWinner, lineStartIndex, lineEndIndex] = testGameWin(boxes[majorIndex].minors)
        if (gameWinner != " ") {
            thisMajor.classList.add(gameWinner == "X" ? "cross" : "circle");

            thisMajor.dataset.value = gameWinner;
            thisMajor.classList.add("minigameOver");



            let line = document.createElement("div");
            line.classList.add("minigameOverLine");
            line.dataset.startIndex = lineStartIndex;
            line.dataset.endIndex = lineEndIndex;
            thisMajor.appendChild(line);

            reformatLine(line);
        }
        

        return;

        // disabling mini games which the next player can't play in
        for (let i = 0; i < 9; i++) {
            // if we're pointed to a mini game which hasn't been won yet
            if (boxes[minorIndex].major.dataset.value == " ") 
                // disable all but the major box of the same index as the clicked minor box
                if (i == minorIndex)
                    boxes[i].major.classList.remove("disabled");
                else 
                    boxes[i].major.classList.add("disabled");

            else
                boxes[i].major.classList.remove("disabled");
        }

        isTurnCrosses = !isTurnCrosses;

        let gc = document.getElementById("gameContainer").classList;
        gc.remove(isTurnCrosses ? "circleTurn" : "crossTurn");
        gc.add(isTurnCrosses ? "crossTurn" : "circleTurn");

        if (singleplayer) {
            board = getCurrentBoard();
            //printBoard(board);
        }
    }
}

function main() {
    let gameContainer = document.getElementById("gameContainer");
    for (let i = 0; i < 9; i++) {
        boxes.push({major: document.createElement("div"), minors: []});
        boxes[i].major.classList.add("majorBox");
        boxes[i].major.dataset.index = i;
        gameContainer.appendChild(boxes[i].major);

        // top, right, bottom, left
        const borderExists = [
            [0, 1, 1, 0],
            [0, 1, 1, 1],
            [0, 0, 1, 1],
            [1, 1, 1, 0],
            [1, 1, 1, 1],
            [1, 0, 1, 1],
            [1, 1, 0, 0],
            [1, 1, 0, 1],
            [1, 0, 0, 1]
        ];
        boxes[i].major.style.borderWidth = borderExists[i].map((exists) => (5*exists) + "px").join(" ");
        boxes[i].major.dataset.value = " ";

        for (let j = 0; j < 9; j++) {
            boxes[i].minors.push(document.createElement("div"));
            boxes[i].minors[j].classList.add("minorBox");
            boxes[i].major.appendChild(boxes[i].minors[j]);
            boxes[i].minors[j].style.borderWidth = borderExists[j].map((exists) => (exists) + "px").join(" ");
            boxes[i].minors[j].dataset.value = " ";
            boxes[i].minors[j].addEventListener("click", () => { boxClick(i, j )});

            
        } 
    }

    winResize();
}

function reformatLine(line) {
    let majorBox = line.parentElement;
    let majorIndex = parseInt(majorBox.dataset.index);
    let lineStartIndex = parseInt(line.dataset.startIndex);
    let lineEndIndex = parseInt(line.dataset.endIndex);
    let majorRect = majorBox.getBoundingClientRect();
    let startingRect = boxes[majorIndex].minors[lineStartIndex].getBoundingClientRect();

    const lineOffset = 5; // pixels between edge of minor and start of line

    line.style.left = "calc(" + (startingRect.left - majorRect.left + startingRect.width / 2 ) + "px - " 
          + getComputedStyle(line).width + " / 2 - " +
          getComputedStyle(majorBox).borderLeftWidth + ")";

    line.style.top = "calc(" + (startingRect.top - majorRect.top + lineOffset) + "px - " +
          getComputedStyle(majorBox).borderTopWidth + ")";
          
    let lineLength = 3*startingRect.height - 2*lineOffset;
    let rot = 0;
    switch (lineEndIndex - lineStartIndex) {
        case 2: //horizontal
        rot = -90;
        break;

        case 6: //vertical
        break;

        case 8: // top left - bottom right diagonal
        rot = -45;
        lineLength *= Math.sqrt(1.9);
        break;

        case 4: // top right - bottom left diagonal
        rot = 45;
        lineLength *= Math.sqrt(1.9);
        break;
    }

    line.style.height = lineLength + "px";
    
    let orig = "calc(" + getComputedStyle(line).width + " / 2) " + (startingRect.height / 2 - lineOffset) + "px";
    line.style.transformOrigin = orig;
    line.style.transform = "rotate(" + rot + "deg)";
}

function winResize() {
    // presumably a better way to do scalable formatting . but it works. pain in the arse tho

    const winSize = Math.min(window.innerWidth, window.innerHeight);
    for (const box of document.querySelectorAll(".majorBox")) {
        box.style.width = winSize * 0.18 + "px";
        box.style.height = winSize * 0.18 + "px";
        box.style.padding = winSize * 0.03 + "px";
        box.style.fontSize = winSize * 0.17 + "px";
    }

    const minorSize = winSize * 0.06 + "px";
    for (const box of document.querySelectorAll(".minorBox")) {
        box.style.width = minorSize;
        box.style.height = minorSize;
        box.style.lineHeight = minorSize;
        box.style.fontSize = winSize * 0.03 + "px";
    } 

    for (const line of document.querySelectorAll(".minigameOverLine")) {
        reformatLine(line);
    }
}


window.onresize = winResize;
window.onload = main;