
var Game  = {

    garbage: 0,

    GameMode: "",
    statistics: {
        time: 0,
        clearedLines: 0,
    },
    
    start_time: Date.now(),

    gravity: 0,
    gravity_tick_limit: 10,

    lock_limit: 50, // lock delay frames

    lock_reset_limit: 5,

    block_size: 25,

    boardX: 200,
    boardY: 100,

    holdX: 50,
    holdY: 100,

    previewX: 500,
    previewY: 100,

    SideLineDisplayX: 25,
    SideLineDisplayY: 200,

    garbage: 0, // garbage lines


    Block_style: {
        lineWidth: 2,
    },
    
    // Handling
    DAS: 10, //Delayed auto shift, measured in frames. Frames required to begin auto repeat movement;
    ARR: 1, //Auto repeat rate, measured in frames per movement. How fast pieces travels during ARM;
    SDF: 6, //Soft drop factor, measured in gravity tick increase per frame. -1 = infinite;


    // begins the interval, as well as setting containers
    init: function (mode) {
        Game.statistics = {
            time: 0,
            clearedLines: 0,
        };
        Game.GameMode = mode;
        Game.over = false;
        commandKey = {};
        moveKey = {};
        
        Display = new _Display(Game.boardX,Game.boardY);

        Hold = new _Hold(Game.holdX, Game.holdY);
        Preview = new _Preview(Game.previewX, Game.previewY);
        SideLineDisplay = new _SideLineDisplay(Game.SideLineDisplayX, Game.SideLineDisplayY);

        Current_piece = Game.SpawnPiece(Preview.previews[0]);

        Shadow_piece = new Shadow(Current_piece);
        Shadow_piece.tick(); 
        
        Preview.previews.splice(0, 1);
        Preview.update_preview();

        Game.LOOP = setInterval(Game.tick, FRAME_RATE);
    },





    // Gameplay-affecting variables
    tick: function () {        
        
        // garbage
        if (Game.garbage > 0) Game.Garbage_Handler();


        //Spawn piece if needed 
        if (Current_piece == undefined) {
            Current_piece = Game.SpawnPiece(Preview.previews[0]);

            Shadow_piece = new Shadow(Current_piece);
            Shadow_piece.tick(); 
            
            Preview.previews.splice(0, 1);
            Preview.update_preview();
        }


        // tick piece
        Current_piece.tick();
        if (Game.over) return;
        Shadow_piece.tick(); 

        Game.Clear_Handler();
        Game.Mode_handler();

        if (Current_piece.toBeDestroyed) Current_piece = undefined;
        if (Shadow_piece.toBeDestroyed) Shadow_piece = undefined;
        //======Visuals=======
        Update_Display();

        commandKey = {};


    },





    Mode_handler: function () {

        switch (Game.GameMode) {
            case "Endless":
                break;

            case "40L":

                if (Game.statistics.clearedLines >= 40) {
                    Game.top_out_handler();
                }
                break;
        }
    },




    Garbage_Handler: function () {


        for (let i=0; i<stack.length; i++)                       // shift lines up
            stack[i].y -= Game.garbage; 
        
        

        resetChart();                                 // reset chart & refill
        for (let i=0; i<stack.length; i++) {
            if (stack[i].y >= 0)
                setChart(stack[i].x,stack[i].y, 1);

            else {
                if (Math.abs(stack[i].y) >= OverloadChart.length) 
                    resizeOverload(Math.abs(stack[i].y) +1);
                
                setChart(stack[i].x, stack[i].y, 1);

            }
        }
        

        const garbage_hole = Math.floor(Math.random()*10);         // empty space in garbage

        for (let y = 19; y > 19-Game.garbage; y--) {             // climbs upwards
            for (let x =0; x < 10; x++)  {

                if (x != garbage_hole && y > 19-Game.garbage) {  // add garbage
                    stack.push(new Block(x,y,0xaaaaaa,1));
                    setChart(x,y,1);
                }
            }
        }

        Game.garbage = 0;
        return;
    },


    Clear_Handler: function () {

        var clears = []
        //check for clears
        for (let y =0; y < 20; y++) {
            for (let x =0; x < 10; x++) {
                if (getChart(x,y) == 0) break;
                if (x == 9) {                            // line filled
                    clears.push(y);
                }
            }
        }
        Game.Spin_Detector(clears.length);
        
        for (let k=0; k<clears.length; k++) {           // remove and shift nodes
            for (let i=0; i<stack.length; i++) { 

                if (stack[i].y == clears[k]) {
                    stack[i].display.destroy();
                    stack.splice(i,1);
                    i--;
                }
                else if (stack[i].y < clears[k]) stack[i].y++; 
            }
        }

        if (clears.length > 0) {                        // reset stack
            resetChart(); 
            for (let i=0; i<stack.length; i++) {
                
                if (stack[i].y >= 0)                    // if in normal chart
                    setChart(stack[i].x,stack[i].y,1);
                else 
                    OverloadChart
                        [OverloadChart.length - Math.abs(stack[i].y)]
                        [stack[i].x] = 1;
            }
        }

        Game.statistics.clearedLines += clears.length;

        return;
    },



    Spin_Detector: function (clears) {

    
        let isTSpin = false;
        
        // 3 corner checker
        let dx = [-1,-1,1,1]
        let dy = [-1,1,-1,1]
        let cnt =0;

        for (let i=0; i<4; i++) {
            if (Current_piece.x+dx[i] >= 0 &&    // if in corner bounds
                Current_piece.x+dx[i] < 10 && 
                Current_piece.y+dy[i] < 20)  {

                if (getChart(Current_piece.x+dx[i],Current_piece.y+dy[i]))  // if occupied
                    cnt ++;
            } else {   
                cnt ++;
            }
        }

        isTSpin = cnt >= 3 && Current_piece.shape == "t";



        if (isTSpin && clears == 1) {
            SideLineDisplay.Text(SideLineDisplay.priority1,"T-spin Single", 180, 30);
        }

        if (isTSpin && clears == 2) {
            SideLineDisplay.Text(SideLineDisplay.priority1,"T-spin Double", 180, 30);
        }

        if (isTSpin && clears == 3) {
            SideLineDisplay.Text(SideLineDisplay.priority1,"T-spin Triple", 180, 30);
        }
    },

    SpawnPiece: function (type) {

        var piece;

        // Unfortunately I think I have to hard code the spawn points in

        switch (type) {
            case 't' :
                piece = new Piece (4, -1, 't', MasterList[type].color);
                break;
            case 'l' :
                piece = new Piece (4, -1, 'l', MasterList[type].color);
                break;
            case 'j' :
                piece = new Piece (4, -1, 'j', MasterList[type].color);
                break;
            case 's' :
                piece = new Piece (4, -1, 's', MasterList[type].color);
                break;
            case 'z' :
                piece = new Piece (4, -1, 'z', MasterList[type].color);
                break;
            case 'o' :
                piece = new Piece (4, -1, 'o', MasterList[type].color);
                break;
            case 'i' :
                piece = new Piece (4, -1, 'i', MasterList[type].color);
                break;
            case undefined:
                piece = Game.SpawnPiece(Preview.previews[0]);
                Preview.previews.splice(0,1);
                Preview.update_preview();
                return piece;
        }
        
        if (!piece.check_blocks()) { // if the stack overlapps with the spawning position, u probably died
            Game.top_out_handler(); 
        }
        

        return piece;
    },

    top_out_handler: function () {
        Display.container.destroy();
        Previews = undefined;
        Hold = undefined;
        Current_piece = undefined;
        Shadow_piece = undefined;
        resetChart();
        stack = [];
        Game.over = true;
        commandKey = {};
        moveKey = {};
        
        clearInterval(Game.LOOP);

        Game.statistics.time = Date.now() - Game.start_time;
        Results = new _Results(Game.statistics);
        
        return;
    },
}