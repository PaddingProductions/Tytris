var Global_mode = "game";
var Current_piece;

// marks if occupied 
var chart = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],

    //floor
    [1,1,1,1,1,1,1,1,1,1],
];
// holds nodes, for drawing and other future purposes :thinking:
var stack = [];

// inputs
var moveKey = {};
var commandKey = {};




var game  = {
    gravity: 1,
    gravity_tick_limit: 10,

    node_size: 25,

    fieldx: 100,
    fieldy: 100,

    tick: function () {
        
        
        
        //Spawn piece if needed
        if (Current_piece == undefined) {
            Current_piece = this.Spawn_Piece("t");
        }
        
        //inputs


        // tick piece
        Current_piece.tick();


        //======Visuals=======
        // draw grid
        game.Field_draw();
        // draw Piece
        Current_piece.draw();
        // draw stack, independent nodes now
        for (let i=0; i<stack.length; i++) stack[i].draw();

        
    },


    Field_draw: function () {
        ctx.save();
        ctx.translate(this.fieldx, this.fieldy);

        // base rectangle
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0, 10*game.node_size, 20*game.node_size);
        
        // soft grid 
        ctx.fillStyle = "#333333";

        for (let y=0; y<21; y++) {
            ctx.fillRect(0, y*game.node_size, 10*game.node_size, 2);
        }
        for (let x=0; x<11; x++) {
            ctx.fillRect(x*game.node_size, 0, 2, 20*game.node_size);
        }

        ctx.restore();
    },


    Spawn_Piece: function (type) {

        var piece;

        // Unfortunately I think I have to hard code it in.
        switch (type) {
            case 't' :

                piece = new Piece ('t');
                
                //create child nodes
                piece.add_child(new Node(3,0,piece));
                piece.add_child(new Node(4,0,piece));
                piece.add_child(new Node(4,1,piece));
                piece.add_child(new Node(5,0,piece));

                break;
        }

        return piece;
    },
}