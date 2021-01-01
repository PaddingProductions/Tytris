class _Hold {
    constructor (x,y) {
        this.piece = undefined;

        this.container = new PIXI.Container();
        this.container.position.x = x;
        this.container.position.y = y;

        Display.container.addChild(this.container);
    }
}


_Hold.prototype.Destroy_Display = function () {
    while (this.container.children.length != 0)
        this.container.children[0].destroy(); 

    return;
}

_Hold.prototype.Create_Display = function () {
    if (this.piece == undefined) return;

    Display.add_piece(MasterList[this.piece], 0,0, this.container); 
}