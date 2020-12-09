const keyDown = (e) => {
    moveKey[e.keyCode] = true;
    commandKey[e.keyCode] = true;
}

const keyUp = (e) => {
    moveKey[e.keyCode] = false;

}