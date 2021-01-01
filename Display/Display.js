class _Display {
    constructor (boardx, boardy) {
        this.container = new PIXI.Container();  // create container 
        app.stage.addChild(this.container);

        this.boardx = boardx;                   // set board locations
        this.boardy = boardy;

        this.board = new PIXI.Graphics();       // create boarder graphics
        this.board.position.x = this.boardx;
        this.board.position.y = this.boardy;
        
        this.board.beginFill(0x000000);    
        this.board.lineStyle(10, 0xffffff);     
        this.board.drawRect(0 -10, 0 -10, 10*game.block_size +10*2, 20*game.block_size +10*2);  
        
        this.container.addChild(this.board)     
    }
}



_Display.prototype.add_block = function(block)  {

    let graphic = new PIXI.Graphics();
    
    graphic.position.x = block.x * game.block_size + this.boardx;
    graphic.position.y = block.y * game.block_size + this.boardy;


    graphic.beginFill(block.color);    
    graphic.lineStyle(1, 0x4444444);     // linewidth, color
    graphic.drawRect(0, 0, game.block_size, game.block_size);  

    app.stage.addChild(graphic);
    this.container.addChild(graphic);

    return graphic;
}


_Display.prototype.add_piece = function(type, offsetx, offsety, container) {

    for (let y=0; y<type["O"].length; y++) {
        for (let x=0; x<type["O"][0].length; x++) {
            
            if (type["O"][y][x] == 0) continue;

            let graphic = new PIXI.Graphics();
            
            graphic.position.x = x*game.block_size + offsetx;
            graphic.position.y = y*game.block_size + offsety;
            
            graphic.beginFill(type.color);    
            graphic.lineStyle(1, 0x4444444);     // linewidth, color
            graphic.drawRect(0, 0, game.block_size, game.block_size);  

            app.stage.addChild(graphic);
            container.addChild(graphic);        
        }
    }
}
