class Node {

    constructor (x, y, master, color) {
        //position
        this.x = x;
        this.y = y; 

        this.master = master;

        //rendering
        //this.color = color;
        this.color = "#ddddddd";

        // one for gravity, one to prevent infinite rotation
        this.gravity_tick = 0; 
        this.rotation_tick = 0;

        // if touching thing
        this.contact = false;
    }
}

Node.prototype.if_contact = function () {
        

    //check contact
    if (this.y < 19) // makes sure that it doesn't go out of bounds as this is the stack chart
    if (OccupationChart[this.y+1][this.x] == 1) { //checks stack contact
        this.contact = true;
    }
    if (BoarderChart[this.y + BoarderIndent + 1][this.x+1] == 1) {  //checks boarder contact
        this.contact = true;
    }

    return;
}




Node.prototype.lock = function () {    
    // add node as "occupied"
    OccupationChart[this.y][this.x] = 1;

    //change into a entity for drawing;
    stack.push(this);

    return;
}






Node.prototype.draw = function () {

    ctx.save();
    ctx.translate(game.fieldx, game.fieldy);

    ctx.fillStyle = "#dddddd";
    ctx.fillRect(this.x*game.node_size, this.y*game.node_size, game.node_size, game.node_size);

    ctx.restore();
}