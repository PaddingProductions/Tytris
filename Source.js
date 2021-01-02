const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000, resolution: window.devicePixelRatio || 1,
});document.body.appendChild(app.view);

var FRAME_RATE = 33;

PIXI.settings.SORTABLE_CHILDREN =true;



function Source () {
    
    game.init();
    
}

SOURCE_LOOP = setInterval(Source, FRAME_RATE);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);