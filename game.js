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
        let svg = thisMinor.querySelector("svg");
        if (isTurnCrosses) {
            thisMinor.classList.add("cross");
            thisMinor.dataset.value = "X";
            
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

            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewbox", "0 0 100 100");
            svg.setAttribute("stroke", "red");
            svg.setAttribute("width", "40");
            svg.setAttribute("height", "40");
            boxes[i].minors[j].appendChild(svg);

            let circle = document.createElement("circle");
            circle.setAttribute("cx", "50");
            circle.setAttribute("cy", "50");
            circle.setAttribute("r", "40");
            circle.setAttribute("fill", "red");
            svg.appendChild(circle);



            boxes[i].minors[j].style.borderWidth = borderExists[j].map((exists) => (exists) + "px").join(" ");
        
            boxes[i].minors[j].dataset.value = " ";

            boxes[i].minors[j].addEventListener("click", () => { boxClick(i, j )});
        } 
    }

    winResize();
}

function winResize() {
    let winSize = Math.min(window.innerWidth, window.innerHeight);
    for (let i = 0; i < document.styleSheets.length; i++)
        try {
            for (let rule of document.styleSheets[i].cssRules) {
                if (rule.selectorText == ".majorBox") {
                    rule.style["width"] = winSize * 0.18 + "px";
                    rule.style["height"] = winSize * 0.18 + "px";
                    rule.style["padding"] = winSize * 0.03 + "px";
                    
                } 
                else if (rule.selectorText == ".minorBox") {
                    let size = winSize * 0.06 + "px";
                    rule.style["width"] = size;
                    rule.style["height"] = size;
                    rule.style["line-height"] = size;
                    rule.style["font-size"] = winSize * 0.03 + "px";
                }
            }
        }
        catch (_) {} // i'm sorry. i tried to find another solution. 
        // if the html document links to any stylesheets, they'll be included in document.styleSheets but CORS will block access and throw an error
}


window.onresize = winResize;
window.onload = main;