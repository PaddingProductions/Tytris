class Piece {

    constructor (type) {
        this.type = type;
        this.children = [];
        this.rotation = 0; // 0~3, NESW


        this.contact = false; //if touching floor
    } 
}




Piece.prototype.tick = function () {


    for (let i=0; i<this.children.length; i++) {
        var curr = this.children[i];
        
        curr.tick();

        // if one child node says is touching floor
        if (curr.contact == true)  
            this.contact = true;
        
    }

    if (this.contact) {
        this.lock();
    }
}




Piece.prototype.draw = function () {
    
    for (let i=0; i<this.children.length; i++) {
        this.children[i].draw();
    }
}





Piece.prototype.lock = function () {
    // add lock delay sumtime

    // lock all nodes
    for (let i=0; i<this.children.length; i++) {
        this.children[i].lock();
    }

    // spawn next piece as needed
    Current_piece = game.Spawn_Piece("t");


    return;
}

Piece.prototype.add_child = function (child) {

    this.children.push(child);
    return child;
}