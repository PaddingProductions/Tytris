
var game  = {
    gravity: 1,
    gravity_tick_limit: 10,

    lock_limit: 20, // lock delay frames

    block_size: 25,

    fieldx: 100,
    fieldy: 100,

    // Handling
    DAS: 10, //Delayed auto shift, measured in frames. Frames required to begin auto repeat movement;
    ARR: 1, //Auto repeat rate, measured in frames per movement. How fast pieces travels during ARM;
    SDF: -1, //Soft drop factor, measured in gravity tick increase per frame. -1 = infinite;


    tick: function () {        
        

        // tick piece
        Current_piece.tick();

        //Spawn piece if needed 
        if (Current_piece == undefined) {
            Current_piece = this.Spawn_Piece(Previews[0]);
            Previews.splice(0, 1);
            game.update_preview();
        }

        //

        //======Visuals=======
        // draw grid
        game.Field_draw();
        // draw Piece
        Current_piece.draw();
        // draw stack, independent block now
        for (let i=0; i<stack.length; i++) stack[i].draw();


    },





    Field_draw: function () {
        ctx.save();
        ctx.translate(this.fieldx, this.fieldy);

        // base rectangle
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0, 10*game.block_size, 20*game.block_size);
        
        // soft grid 
        ctx.fillStyle = "#333333";

        for (let y=0; y<21; y++) {
            ctx.fillRect(0, y*game.block_size, 10*game.block_size, 2);
        }
        for (let x=0; x<11; x++) {
            ctx.fillRect(x*game.block_size, 0, 2, 20*game.block_size);
        }

        ctx.restore();
    },




    update_preview: function () {

        for (let i = Previews.length; i < 5; i++) {

            var randint = Math.floor( Math.random()* Bag.length ); // gets random index from bag 

            Previews.push(  // push the random piece into the previews
                Bag[randint]
            );
            Bag.splice(randint, 1); // remove the used piece

            if (Bag.length == 0) { // reset bag if it's all used
                Bag = ["t","l","j","s","z","o","i"];
            }
        }
    },





    Spawn_Piece: function (type) {

        var piece;

        // Unfortunately I think I have to hard code the spawn points in

        switch (type) {
            case 't' :
                piece = new Piece (4, 1, 't');
                break;
            case 'l' :
                piece = new Piece (4, 1, 'l');
                break;
            case 'j' :
                piece = new Piece (4, 1, 'j');
                break;
            case 's' :
                piece = new Piece (4, 1, 's');
                break;
            case 'z' :
                piece = new Piece (4, 1, 'z');
                break;
            case 'o' :
                piece = new Piece (4, 1, 'o');
                break;
            case 'i' :
                piece = new Piece (4, 1, 'i');
                break;
        }

        return piece;
    },
}