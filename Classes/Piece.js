class Piece {

    constructor (x, y, type, color) {

        this.type = MasterList[type];
        this.shape = type;
        
        this.children = [];
        this.rotation = 'O'; // O, R, L, 2

        this.x = x;
        this.y = y;

        this.map = [];

        this.contact = false; //if touching floor

        this.gravity_tick = 0; // gravity counter 

        this.lock_delay = 0; // lock delay

        //sets up the default map
        this.add_child(new Block());
        this.add_child(new Block());
        this.add_child(new Block());
        this.add_child(new Block());

        switch (type) {
            case 't': 
                this.map = this.type["O"];
        } 
        this.tick_blocks(); // creates child blocks
    } 
}




Piece.prototype.tick = function () {
    

    this.input_handle();

    //Gravity falls
    this.gravity_tick  += game.gravity;

    if (this.contact == false)  {   // if the piece is contacting floor, enter lock delay phase, meaning no gravity
        if (this.gravity_tick >= game.gravity_tick_limit) { //if gravity tick's up
            this.gravity_tick = 0;
            this.y ++;
        }
    } else  {  // suppose you leave contact by rotating, the gravity tick would need to begin at 0 again
        this.gravity_tick = 0;
    }

    // updates block position to account for gravity
    this.tick_blocks();

    // blocks check boarder/stack contact
    for (let i=0; i<this.children.length; i++) {
        var curr = this.children[i];
        var message;

        message = curr.if_contact();

        for (let k=0; k<message.length; k++)  // anaylze return message
        {
        if (message[k].ID ==  1 || message[k].ID == 2) {  // if contacting floor
            this.contact = true;
        }
        }
    }

    // updates block position again to account for contact/ boarder checks
    this.tick_blocks();



    // blocks check                                                                         


    if (this.contact) { // locks if needed
        if (this.lock_delay == game.lock_limit) {
            this.lock();
            this.lock_delay = 0;
        } else {
            this.lock_delay ++;
        }
    }  
}







Piece.prototype.input_handle = function () {

    if (moveKey[37] == true) this.x--; //left
    if (moveKey[39] == true) this.x++; //right

    this.tick_blocks();

    // to shift the piece back into the playfield
    var revert = false;

    for (let i=0; i<this.children.length; i++) { // checks if input is valid 

        var curr = this.children[i];

        var message; 
        message = curr.if_contact();

        
        for (let k=0; k<message.length; k++) { // only check if stack overlap(bump into stack while xshifting)
                                               // and boarders
            if (message[k].ID == 4 || message[k].ID == 3.1 || message[k].ID == 3.2) {
                revert = true;
            } 

        }
    }
    
    if (revert) {
        if (moveKey[37] == true) this.x++; //left
        if (moveKey[39] == true) this.x--; //right
    }





    // it is placed in this order to make sure if one operation fails the other will continue and not be reverte
    // all other input command should have their own check, excluding rotation

    if (commandKey[38] == true) {  // up 
        var newRotation;

        if (this.rotation == "O") newRotation = "R";
        if (this.rotation == "R") newRotation = "2";
        if (this.rotation == "2") newRotation = "L";
        if (this.rotation == "L") newRotation = "O";

        RotatingSystem.rotate(this, newRotation);
    } 
    this.tick_blocks();

}








Piece.prototype.draw = function () {
    
    for (let i=0; i<this.children.length; i++) {
        this.children[i].draw();
    }
}








Piece.prototype.lock = function () {
    // add lock delay sumtime

    // lock all block
    for (let i=0; i<this.children.length; i++) {
        this.children[i].lock();
    }

    // spawn next piece as needed
    Current_piece = game.Spawn_Piece("t");


    return;
}






// Spawns and attach the block 
Piece.prototype.tick_blocks = function () {

    var cnt = 0;

    for (let y =0; y<this.map.length; y++) {
        for (let x =0; x<this.map[y].length; x++) {

            if (this.map[y][x] == 1) { //sets the positions of the blocks to the correct ones
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