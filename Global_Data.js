var Global_mode = "game";
var Current_piece;
var Shadow_piece; 

// Boarders, used to check if going out of bounds, is required for some kicks
const BoarderIndent = 2;


var Display;          // the board, but technically "game field"



OverloadChart = []; // occupation chart for blocks that past the boarder


OccupationChart = []; // It displays ur stack for the computation part, marks as 1 if occupied

getChart = function (x,y) {
    if (y < 0)  {
        if (Math.abs(y) >= OverloadChart.length) return 0;

        return OverloadChart[OverloadChart.length - (Math.abs(y))][x];
    }
    return OccupationChart[y][x];
} 

setChart = function (x,y, val) {
    if (y < 0) {

        return OverloadChart[OverloadChart.length - (Math.abs(y))][x] = val;
    }
    return OccupationChart[y][x] = val;
}

resizeOverload = function (newSize) {

    while(newSize > OverloadChart.length)      // resize overload
        OverloadChart.push([0,0,0,0,0,0,0,0,0,0]);

    return;
}


// a function that is very,very niche. but it has it's uses
function resetChart () {
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
    OverloadChart = [ 
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ]; 
    return;
} resetChart();

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


var Preview;
var Hold;
var Current_piece;
var Shadow_piece;
