const keyDown = (e) => {
    moveKey[e.keyCode] = true;
}

const keyUp = (e) => {
    moveKey[e.keyCode] = false;
    commandKey[e.keyCode] = true;
}