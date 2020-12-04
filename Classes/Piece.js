class Piece {

    constructor (x, y, type, color) {

        this.type = MasterList[type];
        this.children = [];
        this.rotation = 'O'; // O, R, L, 2

        this.x = x;
        this.y = y;

        this.map = [];

        this.contact = false; //if touching floor

        this.gravity_tick = 0; // gravity counter 

        //sets up the default map
        this.add_child(new Node());
        this.add_child(new Node());
        this.add_child(new Node());
        this.add_child(new Node());

        switch (type) {
            case 't': 
                this.map = this.type["O"];
        } 
        this.tick_nodes(); // creates child nodes
    } 
}




Piece.prototype.tick = function () {
    

    this.input_handle();

    //Gravity falls
    this.gravity_tick  += game.gravity;

    if (this.gravity_tick >= game.gravity_tick_limit) {
        this.gravity_tick = 0;
        this.y ++;
    }

    // updates node position 
    this.tick_nodes();

    // nodes check contact
    for (let i=0; i<this.children.length; i++) {
        var curr = this.children[i];
        
        curr.if_contact();

        // if one child node says is touching floor
        if (curr.contact == true)  
            this.contact = true;
        
    }

    if (this.contact) {
        this.lock();
    }
}







Piece.prototype.input_handle = function () {

    if (moveKey[37] == true) this.x--; 
    if (moveKey[39] == true) this.x++; 
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






// Spawns and attach the nodes 
Piece.prototype.tick_nodes = function () {

    var cnt = 0;

    for (let y =0; y<this.map.length; y++) {
        for (let x =0; x<this.map[y].length; x++) {

            if (this.map[y][x] == 1) { //sets the positions of the nodes to the correct ones
                this.children[cnt].x = this.x + (x - this.type.centerX); // the equation is quite funky, but draw it out
                this.children[cnt].y = this.y + (y - this.type.centerY);

                cnt ++;
            }
        }
    }
}







Piece.prototype.add_child = function (child) {

    this.children.push(child);
    return child;
}