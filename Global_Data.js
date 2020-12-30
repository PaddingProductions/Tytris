var Global_mode = "game";
var Current_piece;
var Shadow_piece; 

// Boarders, used to check if going out of bounds, is required for some kicks
const BoarderIndent = 2;
const FRAME_RATE = 30

var holded_piece = {
    visual: undefined,
    piece: undefined,

    generate_visual: function () {                  // note that the defined offset is the center of piece
        holded_piece.visual = game.SpawnPieceVisual( // hold piece
            holded_piece.piece,
            game.hold_box_offsetx - (MasterList[holded_piece.piece].centerX * game.block_size)/2,
            game.hold_box_offsety - (MasterList[holded_piece.piece].centerY * game.block_size)/2,
        );
    },
    dispose_visual: function () {
        for (let i=0; i<4; i++) {
            scene.remove(holded_piece.visual[i]);     // remove hold piece
            holded_piece.visual[i].geometry.dispose();
            holded_piece.visual[i].material.dispose();
        }
    },
};
var Combos = new Combo (100, 300);

OverloadedStack = []; // stack chart for blocks that passed the boarder
OverloadedChart = []; // occupation chart for blocks that passed the boarder


OccupationChart = []; // It displays ur stack for the computation part, marks as 1 if occupied

// a function that is very,very niche. but it has it's uses
function reset_OccupationChart () {
    OccupationChart = [

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
    return;
} reset_OccupationChart();

// holds blocks, for drawing and other future purposes :thinking:
var stack = [];
// for debugging purposes, allows you see the custom-made stack
for (let y=0; y<20; y++) for (let x=0; x<10; x++) if (OccupationChart[y][x] == 1) stack.push(new Block(x,y));

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
        color: 0xa460d1,
    },
    "l": {
        'O': [
            [0,0,1],
            [1,1,1],
            [0,0,0],
        ],
          
        'R': [
            [0,1,0],
            [0,1,0],
            [0,1,1],
        ],
        'L': [
            [1,1,0],
            [0,1,0],
            [0,1,0],
        ],
        '2': [
            [0,0,0],
            [1,1,1],
            [1,0,0],
        ],

        centerX: 1,
        centerY: 1,
        color: 0xe68c2c,

    },
    "j": {
        'O': [
            [1,0,0],
            [1,1,1],
            [0,0,0],
        ],
          
        'R': [
            [0,1,1],
            [0,1,0],
            [0,1,0],
        ],
        'L': [
            [0,1,0],
            [0,1,0],
            [1,1,0],
        ],
        '2': [
            [0,0,0],
            [1,1,1],
            [0,0,1],
        ],

        centerX: 1,
        centerY: 1,
        color: 0x4650bd,

    },
    "s": {
        'O': [
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ],
          
        'R': [
            [0,1,0],
            [0,1,1],
            [0,0,1],
        ],
        'L': [
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ],
        '2': [
            [0,0,0],
            [0,1,1],
            [1,1,0],
        ],

        centerX: 1,
        centerY: 1,
        color: 0x3ff50c,
    },
    "z": {
        'O': [
            [1,1,0],
            [0,1,1],
            [0,0,0],
        ],
          
        'R': [
            [0,0,1],
            [0,1,1],
            [0,1,0],
        ],
        'L': [
            [0,1,0],
            [1,1,0],
            [1,0,0],
        ],
        '2': [
            [0,0,0],
            [1,1,0],
            [0,1,1],
        ],

        centerX: 1,
        centerY: 1,
        color: 0xff0048,

    },
    "i": {
        'O': [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,1,1,1,1],
            [0,0,0,0,0],
            [0,0,0,0,0],
        ],
          
        'R': [
            [0,0,0,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
        ],
        'L': [
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,0,0,0],
        ],
        '2': [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [1,1,1,1,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
        ],

        centerX: 2,
        centerY: 2,
        color: 0x0ce9f5,
    },
    "o": {
        'O': [
            [0,1,1],
            [0,1,1],
            [0,0,0],
        ],
          
        'R': [
            [0,0,0],
            [0,1,1],
            [0,1,1],
        ],
        'L': [
            [1,1,0],
            [1,1,0],
            [0,0,0],
        ],
        '2': [
            [0,0,0],
            [1,1,0],
            [1,1,0],
        ],

        centerX: 1,
        centerY: 1,
        color: 0xffe414,
    },
    
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
        "2": [
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
        ],
        "L": [
            { x:0,  y:0  },
            { x:-1, y:0  },
            { x:-1, y:-1 },
            { x:0,  y:2  },
            { x:-1, y:2  },
        ],
    },

    "i": {
        "O": [
            { x:0,  y:0  },
            { x:-1, y:0  },
            { x:2,  y:0  },
            { x:-1, y:0  },
            { x:2,  y:0  },
        ],
        "R": [
            { x:-1, y:0  },
            { x:0,  y:0  },
            { x:0,  y:0  },
            { x:0,  y:1  },
            { x:0,  y:-2 },
        ],
        "2": [
            { x:-1, y:1  },
            { x:1,  y:1  },
            { x:-2, y:1  },
            { x:1,  y:0  },
            { x:-2, y:0  },
        ],
        "L": [
            { x:0,  y:1  },
            { x:0,  y:1  },
            { x:0,  y:1  },
            { x:0,  y:-1 },
            { x:0,  y:2  },
        ],
    },
    "o": {
        "O": [
            { x:0,  y:0  },
        ],
        "R": [
            { x:0,  y:-1 },
        ],
        "2": [
            { x:-1,  y:-1  },
        ],
        "L": [
            { x:-1,  y:0  },
        ],
    },
}
Kick_Table["t"] = Kick_Table["T,S,Z,L,J"];
Kick_Table["l"] = Kick_Table["T,S,Z,L,J"];
Kick_Table["j"] = Kick_Table["T,S,Z,L,J"];
Kick_Table["s"] = Kick_Table["T,S,Z,L,J"];
Kick_Table["z"] = Kick_Table["T,S,Z,L,J"];


var Previews = []; // holds the five previews
var PreviewVisuals = []; // holds THREE.js objects for of the previews
var Bag = []; // 7-bag system
