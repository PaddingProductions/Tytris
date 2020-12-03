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

Node.prototype.tick = function () {
    
    var message = {};

    //Input handle
    this.input_handle();

    //Gravity falls
    this.gravity_tick  += game.gravity;

    if (this.gravity_tick >= game.gravity_tick_limit) {
        this.gravity_tick = 0;
        this.y ++;
    }
    

    //check contact
    if (chart[this.y+1][this.x] == 1) {
        
        this.contact = true;
    }

    return;
}




Node.prototype.lock = function () {    
    // add node as "occupied"
    chart[this.y][this.x] = 1;

    //change into a entity for drawing;
    stack.push(this);


    return;
}




Node.prototype.input_handle = function () {
    
    if (moveKey['37']) this.x--;
    if (moveKey['39']) this.x++;
}

Node.prototype.draw = function () {

    ctx.save();
    ctx.translate(game.fieldx, game.fieldy);

    ctx.fillStyle = "#dddddd";
    ctx.fillRect(this.x*game.node_size, this.y*game.node_size, game.node_size, game.node_size);

    ctx.restore();
}