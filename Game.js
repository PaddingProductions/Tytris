
var game  = {
    FRAME_RATE: 33,

    gravity: 0,
    gravity_tick_limit: 10,

    lock_limit: 50, // lock delay frames

    lock_reset_limit: 5,

    block_size: 25,

    boardx: 200,
    boardy: 100,

    holdx: 100,
    holdy: 100,

    previewx: 500,
    previewy: 100,

    garbage: 0, // garbage lines

    // Handling
    DAS: 10, //Delayed auto shift, measured in frames. Frames required to begin auto repeat movement;
    ARR: 1, //Auto repeat rate, measured in frames per movement. How fast pieces travels during ARM;
    SDF: 6, //Soft drop factor, measured in gravity tick increase per frame. -1 = infinite;


    // begins the interval, as well as setting containers
    init: function () {

        Display = new _Display(game.boardx,game.boardy);

        Hold = new _Hold(game.holdx, game.holdy);
        Preview = new _Preview(game.previewx, game.previewy);

        clearInterval(SOURCE_LOOP);
        game.LOOP = setInterval(game.tick, game.FRAME_RATE);
    },

    // Gameplay-affecting variables
    tick: function () {        
        

        //Spawn piece if needed 
        if (Current_piece == undefined) {
            Current_piece = game.SpawnPiece(Preview.previews[0]);

            Shadow_piece = new Shadow(Current_piece);
            Shadow_piece.tick(); 
            
            Preview.previews.splice(0, 1);
            Preview.update_preview();
        }


        // tick piece
        Current_piece.tick();
        Shadow_piece.tick(); 



        var clears = []
        //check for clears
        for (let y =0; y < 20; y++) {
            for (let x =0; x < 10; x++) {
                if (OccupationChart[y][x] == 0) break;
                if (x == 9) {                            // line filled
                    clears.push(y);
                }
            }
        }
                      
        for (let k=0; k<clears.length; k++) {  // remove and shift nodes
            for (let i=0; i<stack.length; i++) { 

                if (stack[i].y == clears[k]) {
                    stack[i].display.destroy();
                    stack.splice(i,1);
                    i--;
                }
                else if (stack[i].y < clears[k]) stack[i].y++; 
            }
        }

        if (clears.length > 0) {  // reset stack
            reset_OccupationChart(); 
            for (let i=0; i<stack.length; i++) {
                OccupationChart[stack[i].y][stack[i].x] = 1;
            }
        }


        

        

        //======Visuals=======
        Update_Display();

        commandKey = {};

    },












    SpawnPiece: function (type) {

        var piece;

        // Unfortunately I think I have to hard code the spawn points in

        switch (type) {
            case 't' :
                piece = new Piece (4, 1, 't', MasterList[type].color);
                break;
            case 'l' :
                piece = new Piece (4, 1, 'l', MasterList[type].color);
                break;
            case 'j' :
                piece = new Piece (4, 1, 'j', MasterList[type].color);
                break;
            case 's' :
                piece = new Piece (4, 1, 's', MasterList[type].color);
                break;
            case 'z' :
                piece = new Piece (4, 1, 'z', MasterList[type].color);
                break;
            case 'o' :
                piece = new Piece (4, 1, 'o', MasterList[type].color);
                break;
            case 'i' :
                piece = new Piece (4, 1, 'i', MasterList[type].color);
                break;
            case undefined:
                piece = game.SpawnPiece(Preview.previews[0]);
                Preview.previews.splice(0,1);
                Preview.update_preview();
                return piece;
        }
        
        if (!piece.check_blocks()) { // if the stack overlapps with the spawning position, u probably died
            game.top_out_handler(); 
        }
        

        return piece;
    },
}