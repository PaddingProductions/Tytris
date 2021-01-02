class Block {

    constructor (x, y, color, z) {
        //position
        this.x = x;
        this.y = y; 

        //rendering
        this.color = color;

        // if touching thing
        this.contact = false;

        this.display = Display.add_block(this);
        this.display.zIndex = z;
    }
}






Block.prototype.if_contact = function () {
        
    // this contains messages and possibly variables, this code confirms their existance
    // and the Piece willhanddle the message
    // the ID is to speed up checking, string comparision is not that fastest
    var return_message = [];

    let x = this.x;
    
    if (this.x < 0) {               // checks left wall contact
        return_message.push({
            message: "passed left bound",
            ID: 3.1,
            shiftX: -this.x,
        });
    }

    if (this.x >= 10) {            // checks right wall contact
        return_message.push({
            message: "passed right bound",
            ID: 3.2,
            shiftX: -(this.x - 9),
        });
    }

    if (this.y < 19 && this.x <10 && this.x >=0)   // makes sure that it doesn't go out of bounds as this is the stack chart
    {           
    if (getChart(this.x,this.y+1) == 1) {   // checks stack contact downwards, meaning begin lock delay
        
        return_message.push({
            message: "stack contact",
            ID: 1,
        });
    }
    if (getChart(this.x,this.y) == 1) {

        return_message.push({
            message: "overlap stack, input shiftx request invalid",
            ID: 4,
            
        });
    }
    }

    if (this.y < -BoarderIndent || this.y+1 >= 20)  {// if past boardars        
        return_message.push({
            message: "floor contact",
            ID: 2,
        });
    }
    

    return return_message;
}






Block.prototype.lock = function () {    
    // add block as "occupied"
    setChart(this.x,this.y,1);

    //change into a entity for drawing;
    stack.push(this);

    return;
}




Block.prototype.Update_Display = function () {
    this.display.position.x = this.x * game.block_size + Display.boardx;
    this.display.position.y = this.y * game.block_size + Display.boardy;
}