const Main = document.getElementById("main");

const app = new PIXI.Application({
    width: Main.clientWidth, 
    height: Main.clientHeight,
    backgroundColor: 0x000000, 
    resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

var FRAME_RATE = 20;

PIXI.settings.SORTABLE_CHILDREN =true;



function Source () {
    
    Game.init();
    
}

SOURCE_LOOP = setInterval(Source, FRAME_RATE);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);