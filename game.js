let boxes = [];

// top, right, bottom, left
let borderExists = [
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 1, 1],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 0, 1],
    [1, 0, 0, 1]
]

function main() {
    let gameContainer = document.getElementById("gameContainer");
    for (let i = 0; i < 9; i++) {
        boxes.push({major: document.createElement("div"), minors: []});
        boxes[i].major.classList.add("majorBox");
        gameContainer.appendChild(boxes[i].major);

        boxes[i].major.style.borderWidth = borderExists[i].map((exists) => (0.35*exists) + "em").join(" ");
        

        for (let j = 0; j < 9; j++) {
            boxes[i].minors.push(document.createElement("div"));
            boxes[i].minors[j].classList.add("minorBox");
            boxes[i].major.appendChild(boxes[i].minors[j]);

            boxes[i].minors[j].style.borderWidth = borderExists[j].map((exists) => (exists) + "px").join(" ");
        } 
    }

    //winResize();
}

function winResize() {
    let winSize = Math.min(window.innerWidth, window.innerHeight);
    //console.log(winSize);
    for (let i = 0; i < document.styleSheets.length; i++)
        for (let rule of document.styleSheets[i].cssRules) {
            if (rule.selectorText == ".majorBox") {
                rule.style["width"] = winSize * 0.18 + "px";
                rule.style["height"] = winSize * 0.18 + "px";
                rule.style["padding"] = winSize * 0.03 + "px";
            } 
            else if (rule.selectorText == ".minorBox") {
                rule.style["width"] = winSize * 0.06 + "px";
                rule.style["height"] = winSize * 0.06 + "px";
            }
        }
}


window.onresize = winResize;
window.onload = main;