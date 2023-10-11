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

        boxes[i].major.style.borderWidth = borderExists[i].map((exists) => (0.5*exists) + "em").join(" ");
        

        for (let j = 0; j < 9; j++) {
            boxes[i].minors.push(document.createElement("div"));
            boxes[i].minors[j].classList.add("minorBox");
            boxes[i].major.appendChild(boxes[i].minors[j]);

            boxes[i].minors[j].style.borderWidth = borderExists[j].map((exists) => (exists) + "px").join(" ");
        } 
    }

}



window.onload = main;