class _Preview {
    constructor (x,y) {

        this.previews = [];
        this.bag = ["l","j","s","z","o","i","t"];
        
        this.update_preview();

        this.x = x;
        this.y = y;

        this.container = new PIXI.Container();
        this.container.position.x = x;
        this.container.position.y = y;

        Display.container.addChild(this.container);

        for (let i=0; i<this.previews.length; i++) {
            Display.add_piece(
                MasterList[this.previews[i]],
                 0, i * 4 * game.block_size, // indent by 4 blocks cuz idk
                 this.container
            );
        }
    }
}

_Preview.prototype.Update_Display = function () { 

    for (let i=0; i<this.previews.length; i++) {            // for all previews
        curr_type = MasterList[this.previews[i]];

        let cnt = 0;
        for (let y=0; y<curr_type["O"].length; y++) {
            for (let x=0; x<curr_type["O"][y].length; x++) {     // for all nodes

                if (curr_type["O"][y][x] == 0) continue;         // if not occupied
                
                // NOTE: each children are blocks not pieces, so this.
                let curr = this.container.children[cnt + 4*i];  

                curr.position.x = x * game.block_size;
                curr.position.y = y * game.block_size + i * 4 * game.block_size;

                curr.clear()                          // remove prev rect to change color
                curr.beginFill(curr_type.color);
                curr.lineStyle(2, 0x4444444);     

                curr.drawRect(0, 0, game.block_size, game.block_size);  

                cnt ++;
            }
        }
        cnt =0;
    }
}

_Preview.prototype.update_preview = function () {

    for (let i = this.previews.length; i < 5; i++) {

        if (this.bag.length == 0) { // reset bag if it's all used
            // Bag = ["l","j","s","z","o","i","t"];
            this.bag = ["l","j","s","z","o","i","t"];
        }

        var randint = Math.floor( Math.random()* this.bag.length ); // gets random index from bag 
        this.previews.push(  // push the random piece into the previews
            this.bag[randint]
        );
        this.bag.splice(randint, 1); // remove the used piece

        
    }
}
