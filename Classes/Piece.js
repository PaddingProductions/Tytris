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

        // handling 
        this.ARM = false;  // true/false variable, identifies if is in auto repeat movement
        this.ARR_tick = 0; // a tick variable to identify if need to shift in this frame
        this.DAS_tick = 0; // a tick variable to track DAS time
        this.ARM_direct;   // a variable to track direction of ARM

        //sets up the default map
        this.add_child(new Block());
        this.add_child(new Block());
        this.add_child(new Block());
        this.add_child(new Block());

        
        this.map = this.type["O"];
        
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





    this.contact = false; // to reset contact, if it really is touching it will reset

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
            Current_piece = undefined; // goodbye world
        } else {
            this.lock_delay ++;
        }
    }  
}









Piece.prototype.input_handle = function () {

    if (commandKey[37] == true) {
        this.x--; //left
        this.ARM_direct = -1; // set ARM direct for when it begins
    }
    if (commandKey[39] == true) {
        this.x++; //right
        this.ARM_direct = 1; // set ARM direct for when it begins
    }

    // not that movekey is true if command key is true, but converse and inverse of the statment isn't true
    if (moveKey[37] == true) { // tick DAS if needed
        this.DAS_tick ++;

        if (this.ARM_direct == -1) {  // if ARM is cancelled because you commanded it to move the other way
            this.ARM = false; 
            this.DAS_tick = 0; 
        } 
    }
    if (moveKey[39] == true) {
        this.DAS_tick ++;

        if (this.ARM_direct == 1) {  // if ARM is cancelled because you commanded it to move the other way
            this.ARM = false; 
            this.DAS_tick = 0; 
        } 
    }    

    
    if (this.DAS_tick == game.DAS) { // if DAS time up, begin ARM
        this.ARM = true;
        this.DAS_tick = 0;
    }

    if (this.ARM) {     //ARM; auto repeat movement

        if (this.ARR_tick == game.ARR) { // if ARR tick is up

            this.x += this.ARM_direct;
            this.ARR_tick = 0;
        }
        this.ARR_tick ++;
    }



    
    // to shift the piece back into the playfield
    var revert = !this.check_blocks();
    
    if (revert) {
        this.x -= this.ARM_direct; // this works because ARM direct is set before ARM starts
    }







    // it is placed in this order to make sure if one operation fails the other will continue and not be reverte
    // all other input command should have their own check, excluding rotation

    if (commandKey[38] == true) {  // up , cw rotation
        var newRotation;

        if (this.rotation == "O") newRotation = "R";
        if (this.rotation == "R") newRotation = "2";
        if (this.rotation == "2") newRotation = "L";
        if (this.rotation == "L") newRotation = "O";

        RotatingSystem.rotate(this, newRotation);
    } 
    if (commandKey[90] == true) {  // z, ccw rotation 
        var newRotation;

        if (this.rotation == "O") newRotation = "L";
        if (this.rotation == "L") newRotation = "2";
        if (this.rotation == "2") newRotation = "R";
        if (this.rotation == "R") newRotation = "O";

        RotatingSystem.rotate(this, newRotation);
    } 
    this.tick_blocks();



    // harddrop
    if (commandKey[32]) { // space key

        while (this.check_blocks()) {  //I can check blocks without updating because it 
                                       // only uses x,y and map, not individually checking each child
            this.y++;
        }
        this.y--;
        this.tick_blocks();
        this.lock();
        Current_piece = undefined;
    }
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










Piece.prototype.check_blocks = function () { // checks for overlaps without requireing to tick nodes beforehand

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