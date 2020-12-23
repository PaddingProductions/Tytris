class Shadow {
    constructor (master) {

        this.x = master.x;
        this.y = 1;
        this.shape = master.shape;
        this.map = MasterList[this.shape][master.rotation];
        this.master = master;
        this.type = MasterList[this.shape];
    }
}


Shadow.prototype.tick = function () {

    if (Current_piece == undefined) { // if key is placed
        Shadow_piece = undefined;
    }

    this.x = this.master.x;
    this.map = MasterList[this.shape][this.master.rotation];


    while (this.check_blocks()) {  //I can check blocks without updating because it 
        this.y++;
    }
    this.y--;

    if (this.master.y > this.y) this.y = this.master.y;
}




Shadow.prototype.draw = function () {
    
    ctx.save();
    ctx.translate(game.fieldx, game.fieldy);

    ctx.fillStyle = "#dddddd";

    for (let y=0; y<this.map.length; y++) 
        for (let x=0; x<this.map[0].length; x++)
            if (this.map[y][x] == 1)
                ctx.fillRect( (this.x+x-this.type.centerX) * game.block_size , (this.y+y-this.type.centerY) * game.block_size, 
                                game.block_size, game.block_size);

    ctx.restore();
}





Shadow.prototype.check_blocks = function () { // checks for overlaps without requireing to tick nodes beforehand

    for  (let y=0; y<this.map.length; y++) { 
        for (let x=0; x<this.map[y].length; x++) {  // for all nodes
            
            if (this.map[y][x] == 0) continue; // no need to process empty nodes

            var currX = this.x + x - this.type.centerX; 
            var currY = this.y + y - this.type.centerY; 

            if (currX < 0 || currY < 0 || currX >= 10 || currY >= 20) return false; // if past boardars
            if (OccupationChart[currY][currX] == 1) return false; // if overlapping stack
               
        }
    }
    return true;
}