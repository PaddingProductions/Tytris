class _SideLineDisplay {
    constructor (x,y) {
        this.P1style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#c200cc',
            strokeThickness: 5,
        });

        this.x = x;
        this.y = y;

        this.container = new PIXI.Container();
        this.container.x = this.x;
        this.container.y = this.y;

        Display.container.addChild(this.container);



        this.priority1 = new PIXI.Text("", this.P1style);
        this.priority1.x = this.x;
        this.priority1.y = this.y;
        this.priority1.alpha = 0;

        this.container.addChild(this.priority1)



        this.timers = [];
    }
}

// it will display a text with a pre-defined location&style, and also begin a timer
_SideLineDisplay.prototype.Text = function(object, text, life, fade) { 
    object.alpha = 1;
    object.text = text;
    this.timers.push({object: object,life: life, fade: fade});
}



_SideLineDisplay.prototype.Update_Display = function() {

    for (let i=0; i< this.timers.length; i++) {

        if (this.timers[i].life == -1) continue;    // if designed to have infinite life

        this.timers[i].life --;

        if (this.timers[i].life <= this.timers[i].fade) {
            this.timers[i].object.alpha -= 1/this.timers[i].fade;
        }
        if (this.timers[i].life == 0) {
            this.timers.splice(i,1);
            i --;
        }
    }
}