const canvas = document.getElementById("main canvas");
const ctx = canvas.getContext("2d");

function MainLoop () {

    if (Global_mode == "game") game.tick();

    commandKey = {};
}

setInterval(MainLoop, 33);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);