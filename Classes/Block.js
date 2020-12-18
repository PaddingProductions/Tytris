class Block {

    constructor (x, y, color) {
        //position
        this.x = x;
        this.y = y; 

        //rendering
        //this.color = color;
        this.color = color;

        // if touching thing
        this.contact = false;
    }
}






Block.prototype.if_contact = function () {
        
    // this contains messages and possibly variables, this code confirms their existance
    // and the Piece willhanddle the message
    // the ID is to speed up checking, string comparision is not that fastest
    var return_message = [];


    
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
    if (OccupationChart[this.y+1][this.x] == 1) {   // checks stack contact downwards, meaning begin lock delay
        
        return_message.push({
            message: "stack contact",
            ID: 1,
        });
    }
    if (OccupationChart[this.y][this.x] == 1) {

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
    OccupationChart[this.y][this.x] = 1;

    //change into a entity for drawing;
    stack.push(this);

    return;
}







Block.prototype.draw = function () {

    ctx.save();
    ctx.translate(game.fieldx, game.fieldy);

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x*game.block_size, this.y*game.block_size, game.block_size, game.block_size);

    ctx.restore();
}