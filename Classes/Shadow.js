class Shadow {
    constructor (master) {

        this.x = master.x;
        this.y = 1;
        this.shape = master.shape;
        this.map = MasterList[this.shape][master.rotation];
        this.master = master;
        this.type = MasterList[this.shape];
        this.children = [];
        this.color = 0xdddddd;
        //sets up the default map
        this.children.push(new Block(this.x,this.y,this.color, 0));
        this.children.push(new Block(this.x,this.y,this.color, 0));
        this.children.push(new Block(this.x,this.y,this.color, 0));
        this.children.push(new Block(this.x,this.y,this.color, 0));
    }
}


Shadow.prototype.tick = function () {

    if (Current_piece == undefined) { // if key is placed
        this.Destroy_Display();
        Shadow_piece = undefined;
    }

    this.x = this.master.x;
    this.map = MasterList[this.shape][this.master.rotation];

    this.y = this.master.y;
    
    while (this.check_blocks()) {  //I can check blocks without updating because it 
        this.y++;
    }
    this.y--;

    if (this.master.y > this.y) this.y = this.master.y;

    this.tick_blocks();

    return;
}







// Spawns and attach the block 
Shadow.prototype.tick_blocks = function () {

    cnt = 0;
    for (let y =0; y<this.map.length; y++) {
        for (let x =0; x<this.map[y].length; x++) {

            if (this.map[y][x] == 1) { //sets the positions of the blocks to the correct ones
                this.children[cnt].x = (this.x - this.type.centerX) + x; // the equation is quite funky, but draw it out
                this.children[cnt].y = (this.y - this.type.centerY) + y;

                cnt++;
            }
        }
    }

    return;
}





Shadow.prototype.check_blocks = function () { // checks for overlaps without requireing to tick nodes beforehand

    for  (let y=0; y<this.map.length; y++) { 
        for (let x=0; x<this.map[y].length; x++) {  // for all nodes
            
            if (this.map[y][x] == 0) continue; // no need to process empty nodes

            var currX = this.x + x - this.type.centerX; 
            var currY = this.y + y - this.type.centerY; 

            if (currX < 0 || currX >= 10 || currY >= 20) return false; // if past boardars
            if (getChart(currX,currY) == 1) return false; // if overlapping stack
               
        }
    }
    return true;
}




Shadow.prototype.Update_Display = function () {
    for (let i=0; i<this.children.length; i++) {

        this.children[i].display.position.x = this.children[i].x * game.block_size + Display.boardx;
        this.children[i].display.position.y = this.children[i].y * game.block_size + Display.boardy;
    }
}


Shadow.prototype.Destroy_Display = function () {
    for (let i=0; i<this.children.length; i++) {

        this.children[i].display.destroy();
    }
}
        