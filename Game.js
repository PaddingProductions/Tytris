
var game  = {
    gravity: 0,
    gravity_tick_limit: 10,

    lock_limit: 50, // lock delay frames

    lock_reset_limit: 5,

    block_size: 25,

    fieldx: 200,
    fieldy: 100,

    canvasw: 700,
    canvash: 700,

    // Handling
    DAS: 10, //Delayed auto shift, measured in frames. Frames required to begin auto repeat movement;
    ARR: 1, //Auto repeat rate, measured in frames per movement. How fast pieces travels during ARM;
    SDF: 6, //Soft drop factor, measured in gravity tick increase per frame. -1 = infinite;

    // Gameplay-affecting variables
    tick: function () {        
        
        //Spawn piece if needed 
        if (Current_piece == undefined) {
            Current_piece = this.SpawnPiece(Previews[0]);

            Shadow_piece = new Shadow(Current_piece);
            Shadow_piece.tick(); 
            
            Previews.splice(0, 1);
            game.update_preview();
            console.log("spawned");
        }

        console.log("before tick", Current_piece.x);

        // tick piece
        Current_piece.tick();
        Shadow_piece.tick(); 

        console.log("after tick");
        if (Current_piece != undefined) console.log(Current_piece.x);



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

                if (stack[i].y == clears[k]) {stack.splice(i,1);  i--;}
                else if (stack[i].y < clears[k]) stack[i].y++; 
            }
        }

        if (clears.length > 0) {  // reset stack
            reset_OccupationChart(); 
            for (let i=0; i<stack.length; i++) {
                OccupationChart[stack[i].y][stack[i].x] = 1;
            }
        }


        

        //

        //======Visuals=======
        // draw grid
        game.Field_draw();

        if (Current_piece != undefined) {
            // draw Piece
            Shadow_piece.draw();
            Current_piece.draw();
        }

        // draw stack, independent block now
        for (let i=0; i<stack.length; i++) stack[i].draw();


    },





    Field_draw: function () {
        
        ctx.fillStyle = "#000"; // clear
        ctx.fillRect(0,0,this.canvasw, this.canvash);

        ctx.save(); 
        ctx.translate(this.fieldx, this.fieldy);
        
        // soft grid 
        ctx.fillStyle = "#333333";

        for (let y=0; y<21; y++) {
            ctx.fillRect(0, y*game.block_size, 10*game.block_size, 2);
        }
        for (let x=0; x<11; x++) {
            ctx.fillRect(x*game.block_size, 0, 2, 20*game.block_size);
        }


        // hold box
        if (Hold != undefined) {
            ctx.fillStyle = MasterList[Hold].color;

            for (let y = 0; y < MasterList[Hold]["O"].length; y++) {
                for (let x =0; x < MasterList[Hold]["O"][0].length; x++) {

                    if (MasterList[Hold]["O"][y][x] == 1) {
                        ctx.fillRect(hold_box_offsetx + x*game.block_size, 
                                hold_box_offsety + y*game.block_size,
                                game.block_size, game.block_size);
                    }
                }
            }
        }   

        // previews 
        for (let i=0; i<Previews.length; i++ ) {                                 // for all previews
            ctx.fillStyle = MasterList[Previews[i]].color;                       // select color

            for (let y = 0; y < MasterList[Previews[i]]["O"].length; y++) { 
                for (let x =0; x < MasterList[Previews[i]]["O"][0].length; x++) { // for all nodes in preview piece

                    if (MasterList[Previews[i]]["O"][y][x] == 1) {                // if node exists

                        ctx.fillRect(preview_box_offsetx + x*game.block_size,  
                                 preview_box_offsety + y*game.block_size + 100*i,
                                 game.block_size, game.block_size);
                    }
                }
            }
        }
        ctx.restore();
    },




    update_preview: function () {

        for (let i = Previews.length; i < 5; i++) {

            if (Bag.length == 0) { // reset bag if it's all used
                // Bag = ["l","j","s","z","o","i","t"];
                Bag = ["l","j","s","z","o","i","t"];
            }

            var randint = Math.floor( Math.random()* Bag.length ); // gets random index from bag 
            Previews.push(  // push the random piece into the previews
                Bag[randint]
            );
            Bag.splice(randint, 1); // remove the used piece

            
        }
    },






    top_out_handler: function () {
        stack = [];
        reset_OccupationChart();
        Bag = [];
        Previews = [];
        this.update_preview();
        this.SpawnPiece();
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
                piece = game.SpawnPiece(Previews[0]);
                Previews.splice(0,1);
                game.update_preview();
                return piece;
        }
        
        if (!piece.check_blocks()) { // if the stack overlapps with the spawning position, u probably died
            game.top_out_handler(); 
        }
        

        return piece;
    },
}