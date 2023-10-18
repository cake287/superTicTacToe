let boxes = [];
let isTurnCrosses = true;

const crossChar = "\u2573";
const circleChar = "\u25EF";

// board is a list of boxes (major or minor) 
// returns "X", "O" or " "
function testGameWin(board) {
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
    for (const arr of winningArrangements) {
        let values = arr.map(i => board[i].dataset.value);
        let allValuesSame = values.every(v => v == values[0]);
        if (allValuesSame && values[0] != " ")
            return values[0];
    }
    return " ";
}


function boxClick(majorIndex, minorIndex) {
    let thisMajor = boxes[majorIndex].major;
    let thisMinor = boxes[majorIndex].minors[minorIndex];
    
    if (
        !thisMajor.classList.contains("disabled") && 
        thisMajor.dataset.value == " " && // if this mini game hasn't been won yet
        thisMinor.dataset.value == " ") 
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
        
        thisMajor.dataset.value = testGameWin(boxes[majorIndex].minors);
        if (thisMajor.dataset.value != " ") 
            thisMajor.classList.add("gameOver");
        

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
    }
}

function main() {
    let gameContainer = document.getElementById("gameContainer");
    for (let i = 0; i < 9; i++) {
        boxes.push({major: document.createElement("div"), minors: []});
        boxes[i].major.classList.add("majorBox");
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
        boxes[i].major.style.borderWidth = borderExists[i].map((exists) => (0.35*exists) + "em").join(" ");
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

function winResize() {
    const winSize = Math.min(window.innerWidth, window.innerHeight);
    for (const box of document.querySelectorAll(".majorBox")) {
        box.style.width = winSize * 0.18 + "px";
        box.style.height = winSize * 0.18 + "px";
        box.style.padding = winSize * 0.03 + "px"
    }

    const minorSize = winSize * 0.06 + "px";
    for (const box of document.querySelectorAll(".minorBox")) {
        box.style.width = minorSize;
        box.style.height = minorSize;
        box.style.lineHeight = minorSize;
        box.style.fontSize = winSize * 0.03 + "px";

    } 

    for (const svg of document.querySelectorAll(".minorSvg")) {
        svg.style.width = minorSize;
        svg.style.height = minorSize;
    }

}


window.onresize = winResize;
window.onload = main;