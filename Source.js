const canvas = document.getElementById("main canvas");
const ctx = canvas.getContext("2d");

game.update_preview(); // very important, the loop only works if it has a starting point
Current_piece = game.SpawnPiece(Previews[0]);
Previews.splice(0, 1);
game.update_preview();

function MainLoop () {
    
    if (Global_mode == "game") 
        game.tick();
    
    
    commandKey = {};
}

setInterval(MainLoop, 17);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);