var Global_mode = "game";
var Current_piece;

// Boarders, used to check if going out of bounds, is required for some kicks
const BoarderIndent = 2;

const BoarderChart = [
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],

    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],
    [1,  0,0,0,0,0,0,0,0,0,0,  1],

    [1  ,1,1,1,1,1,1,1,1,1,1  ,1],
];

// It displays ur stack for the computation part, marks as 1 if occupied
var OccupationChart = [

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

];

// holds blocks, for drawing and other future purposes :thinking:
var stack = [];

// inputs
var moveKey = {};
var commandKey = {};




//Masterlist
var MasterList = {
    "t": {
        'O': [
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ],
          
        'R': [
            [0,1,0],
            [0,1,1],
            [0,1,0],
        ],
        'L': [
            [0,1,0],
            [1,1,0],
            [0,1,0],
        ],
        '2': [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ],

        centerX: 1,
        centerY: 1,
    }

}
// SRS kick table
const Kick_Table = {
    "T,S,Z,L,J" : {
        "O": [
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
        ],
        "R": [
            { x:0,  y:0  },
            { x:1,  y:0  },
            { x:1,  y:-1 },
            { x:0,  y:2  },
            { x:1,  y:2  },
        ],
        "L": [
            { x:0,  y:0  },
            { x:-1, y:0  },
            { x:-1, y:-1 },
            { x:0,  y:2  },
            { x:-1, y:2  },
        ],
        "2": [
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
        ],
    },

    "t": Kick_Table["T,S,Z,L,J"],
}


var game  = {
    gravity: 1,
    gravity_tick_limit: 10,

    lock_limit: 20, // lock delay frames

    block_size: 25,

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






    Spawn_Piece: function (type) {

        var piece;

        // Unfortunately I think I have to hard code the spawn points in

        switch (type) {
            case 't' :

                piece = new Piece (4, 1, 't');
                

                break;
        }

        return piece;
    },
}