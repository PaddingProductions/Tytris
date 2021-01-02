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
        
        this.gravity = game.gravity;
        this.gravity_tick = 0; // gravity counter 

        this.lock_delay = 0; // lock delay
        this.lock_reset_limit = 0; // amount of times you can reset the lock limit

        // handling 
        this.ARM = false;  // true/false variable, identifies if is in auto repeat movement
        this.ARR_tick = 0; // a tick variable to identify if need to shift in this frame
        this.DAS_tick = 0; // a tick variable to track DAS time
        this.ARM_direct;   // a variable to track direction of ARM

        //sets up the default map
        this.children.push(new Block(x,y,color, 1));
        this.children.push(new Block(x,y,color, 1));
        this.children.push(new Block(x,y,color, 1));
        this.children.push(new Block(x,y,color, 1));

        this.map = this.type["O"];
        
        this.tick_blocks(); // creates child blocks
    } 
}




Piece.prototype.tick = function () {
    

    this.input_handle();

    if (this.toBeDestroyed) {
        return;
    } 

    //Gravity falls
    this.gravity_tick  += this.gravity;

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
        if (this.lock_reset_counter == game.lock_reset_limit) {
            this.lock();
        }
        if (this.lock_delay == game.lock_limit) {
            this.lock();
        } else {
            this.lock_delay += this.gravity;
        }
    }  
}










Piece.prototype.input_handle = function () {

    if (commandKey[67] == true) {        // hold
        if (!this.hold_limit)  {
            newType = Hold.piece;
            Hold.piece = Current_piece.shape;

            Current_piece.Destroy_Display();            // remove display
            Shadow_piece.Destroy_Display();
            Hold.Destroy_Display();

            Hold.Create_Display();
            Current_piece = game.SpawnPiece(newType);   // remove and add new piece
            Shadow_piece = new Shadow(Current_piece);
            Current_piece.hold_limit = true;
        }
    }



    if (commandKey[37] == true) {        // left
        
        if (this.ARM_direct == 1) {       //cancel ARM because you commanded it to move the other way
            this.ARM = false; 
            this.DAS_tick = 0; 
        } 
        if (!this.ARM)                  // only move if !ARM because you would move at 2x speed if so.
            this.x --;
    }
        

    if (commandKey[39] == true) {         //right
        
        if (this.ARM_direct == -1) {  
            this.ARM = false; 
            this.DAS_tick = 0; 
        } 
        if (!this.ARM) 
            this.x ++;
    }
    
        
    if (moveKey[40] == true) {
        this.gravity = game.SDF* ((game.gravity > 0) * game.gravity + game.gravity == 0 * 1);
    }  else {
        this.gravity = game.gravity;
    }


    // note that movekey is true if command key is true, but converse and inverse of the statment isn't true
    if (moveKey[37] == true) {             // tick DAS if needed
        
        this.ARM_direct = -1;             // set ARM direct for when it begins
        this.DAS_tick ++;

    } else if (moveKey[39] == true) {

        this.ARM_direct = 1; 
        this.DAS_tick ++;
        
    } else {
        this.DAS_tick = 0;                //reset if keys is not pressed
    }

    
    if (this.DAS_tick == game.DAS) {       // if DAS time up, begin ARM
        this.ARM = true;
        this.DAS_tick = 0;
    }

    if (this.ARM) {                         //ARM; auto repeat movement
        if (this.ARR_tick == game.ARR) {    // if ARR tick is up
            this.x += this.ARM_direct;
            this.ARR_tick = 0;
        }
        this.ARR_tick ++;
    }



    
    // to shift the piece back into the playfield
    var revert = !this.check_blocks();
    
   
    if (revert) {
        this.x -= this.ARM_direct;         // this works because ARM direct is set before ARM starts
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
    }
}








Piece.prototype.lock = function () {
    // add lock delay sumtime
    
    // lock all block
    for (let i=0; i<this.children.length; i++) {
        this.children[i].lock();
    }
    if (this.y <= -1) game.top_out_handler();

    this.toBeDestroyed = true;
    Current_piece = undefined; // goodbye world


    return;
}







// Spawns and attach the block 
Piece.prototype.tick_blocks = function () {

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
}











Piece.prototype.check_blocks = function () { // checks for overlaps without requireing to tick nodes beforehand

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





Piece.prototype.Update_Display = function () {
    for (let i=0; i<this.children.length; i++) {

        this.children[i].display.position.x = this.children[i].x * game.block_size + Display.boardx;
        this.children[i].display.position.y = this.children[i].y * game.block_size + Display.boardy;
    }
}

Piece.prototype.Destroy_Display = function () {
    for (let i=0; i<this.children.length; i++) {

        this.children[i].display.destroy();
    }
}