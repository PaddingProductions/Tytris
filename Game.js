
var game  = {
    gravity: 0,
    gravity_tick_limit: 10,

    lock_limit: 50, // lock delay frames

    lock_reset_limit: 5,

    block_size: 25,

    board_offsetx: 200,
    board_offsety: 100,

    preview_offsetx: 500,
    preview_offsety: 550,

    hold_box_offsetx: 100,
    hold_box_offsety: 500,
    
    garbage: 0, // garbage lines

    // Handling
    DAS: 7, //Delayed auto shift, measured in frames. Frames required to begin auto repeat movement;
    ARR: 1, //Auto repeat rate, measured in frames per movement. How fast pieces travels during ARM;
    SDF: -1, //Soft drop factor, measured in gravity tick increase per frame. -1 = infinite;

    init: function () {
        const geometry = new THREE.PlaneGeometry( 10*game.block_size, 20*game.block_size);
        const material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
        const board = new THREE.Mesh( geometry, material );

        const width = 8;

        const points = [
            [  0*game.block_size + game.board_offsetx - width/2,   0*game.block_size + game.board_offsety - width/2, 0],
            [  0*game.block_size + game.board_offsetx - width/2,  20*game.block_size + game.board_offsety + width/2, 0],
            [ 10*game.block_size + game.board_offsetx + width/2,  20*game.block_size + game.board_offsety + width/2, 0],
            [ 10*game.block_size + game.board_offsetx + width/2,   0*game.block_size + game.board_offsety - width/2, 0],
            [  0*game.block_size + game.board_offsetx - width/2,   0*game.block_size + game.board_offsety - width/2, 0],
        ];
        CreateLine(points, width , 0xffffff); // boarder of board
        scene.add(board); // board (is a black rect, you can't see it)

    },



    // Gameplay-affecting variables
    tick: function () {        
        /*
        if (game.garbage != 0) {                    // Give garbage, stack shifting        
            for (let i=0; i<stack.length; i++) {    // update stack y axis of stack
                stack[i].y -= game.garbage; 
                
                if (stack[i].y < 0) {               // if overloaded
                    OverloadedStack.push(stack[i]); // push overloaded one into overloaded stack
                    stack.splice(i,1);              // remove from normal stack
                    i--;
                }
            }


            var garbageSpace = Math.random() * 10;  // garbage space random.
            for (let i=0; i<game.garbage; i++) {    // add garbage blocks to stack
                for (let k=0; k<10; k++) {
                    if (k != garbageSpace) stack.push(new Block(x, 20-i, "#dddddd"));
                }
            }

            // must be done before inbound nodes because we must clear space for new overloads
            // simply pad the overloaded nodes by garbage sent if there are overloads
            if (OverloadedChart.length > 0) {
                for (let i=0; i<game.garbage; i++) 
                    OverloadedChart.push([0,0,0,0,0,0,0,0,0,0]);
            }
            for (let y=0; y<20; y++) { 
                for (let x=0; x<10; x++) {          // for all inbound nodes
                    if (OccupationChart[y][x] == 1) { // continue if not occupied

                    OccupationChart[y][x] = 0;

                    if (y - game.garbage > 0)       // decide if is overloaded, act as judged
                        OverloadedChart[OverloadedChart.length + y - game.garbage][x] = 1;    // if overload
                    else 
                        OccupationChart[y - game.garbage][x] = 1;                // else 
                    }
                    if (y >= 20-game.garbage) {        // if current node is new garbage
                        if (x != garbageSpace) OccuptationChart[y][x] == 1;    // set
                    }
                }
            }
            game.garbage = 0;
        }*/

        //Spawn piece if needed 
        if (Current_piece == undefined) {
            Current_piece = this.SpawnPiece(Previews[0]);
            
            Shadow_piece = new Shadow(Current_piece);
            Shadow_piece.tick(); 
            
            Previews.splice(0, 1);
            game.update_preview();
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

                if (stack[i].y == clears[k]) {      // if need to remove
                    stack[i].dispose_visual();
                    stack.splice(i,1); 
                    i--;
                }
                else if (stack[i].y < clears[k]) {  // if need to shift down
                    stack[i].y++; 
                    stack[i].update_visual();
                }
            }
        }

        if (clears.length > 0) {  // reset stack
            reset_OccupationChart(); 
            for (let i=0; i<stack.length; i++) {
                OccupationChart[stack[i].y][stack[i].x] = 1;
            }
        }


        


        //======Visuals=======
        game.Render();
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






    Render: function () {
        // NOTES:
        // origin is at bottom left corner
        // camera is at screenW/2, screenH/2, 500(?)
        // because of the origin's position the Y axis needs to be edited

        
        if ( Current_piece != undefined) {
            Shadow_piece.update_visual();
            Current_piece.update_visual();
        }

        for (let i=0; i<stack.length; i++)  // calculate position of the stack 
            stack[i].update_visual();
        



        for (let i=0; i<Previews.length; i++) { // update preview block mesh
            PreviewVisuals.push( game.SpawnPieceVisual(
                Previews[i],
                game.preview_offsetx,
                game.preview_offsety - i* 3*game.block_size, 
            ) );
        }

        if (holded_piece.piece != undefined) holded_piece.generate_visual();


        renderer.render( scene, camera );   //-=======DRAW SCENE==========-


        if (holded_piece.piece != undefined) holded_piece.dispose_visual();


        for (let i=0; i<Previews.length; i++) { // remove previews (haven't thought of a good and cleaner way so...)
            for (let k=0; k<4; k++) {
                scene.remove(PreviewVisuals[0][k]);
                PreviewVisuals[0][k].geometry.dispose();
                PreviewVisuals[0][k].material.dispose();
            }
            PreviewVisuals.splice(0,1);
        }
    },





    SpawnPieceVisual: function (piece_type, offsetx, offsety) {

        var out = [];

        for (let y =0; y <MasterList[piece_type]["O"].length; y++) {
            for (let x =0; x <MasterList[piece_type]["O"][0].length; x++) {

                if (MasterList[piece_type]["O"][y][x] == 1) {

                    var posx = offsetx + x*game.block_size + game.block_size/2;
                    var posy = offsety - y*game.block_size + game.block_size/2;

                    
                    const geometry = new THREE.PlaneGeometry( game.block_size, game.block_size);
                    const material = new THREE.MeshBasicMaterial( {
                        color: MasterList[piece_type].color, 
                        side: THREE.DoubleSide
                    } );
                    const block = new THREE.Mesh( geometry, material );
            
                    scene.add(block); 
                    out.push(block);

                    block.position.x = posx;
                    block.position.y = posy;    
                }
            }                
        }

        return out;
    }
}