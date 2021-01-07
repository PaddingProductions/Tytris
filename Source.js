const Main = document.getElementById("main");

const app = new PIXI.Application({
    width: window.innerWidth, 
    height: window.innerHeight,
    backgroundColor: 0x000000, 
    resolution: window.devicePixelRatio || 1,
});

PIXI.settings.SORTABLE_CHILDREN =true;
document.body.appendChild(app.view);

var FRAME_RATE = 20;



var Menu = new _Menu();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
