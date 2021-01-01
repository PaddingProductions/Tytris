const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000, resolution: window.devicePixelRatio || 1,
});document.body.appendChild(app.view);

PIXI.settings.SORTABLE_CHILDREN =true;

function MainLoop () {
    
    game.init();
    
}

SOURCE_LOOP = setInterval(MainLoop, game.FRAME_RATE);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);