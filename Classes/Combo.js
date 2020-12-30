class Combo { 

    constructor (offsetx, offsety) {
        this.offsetx = offsetx;
        this.offsety = offsety;

        this.priority = [
            [],
            [],
            [],
        ];
        this.p1_size = 30;
        this.p2_size = 25;
        this.p3_size = 20;
    }
}

Combo.prototype.add = function (text, priority, color, size) {

    var curr = document.createElement("span");      // create DOM span type element
    curr.innerText = text;

    curr.style.color = color;                       // set color
    curr.style.fontSize = size + "px";              // set size

    this.priority[priority].push(curr);             // set priority

    curr.style.position = "absolute";               // 0,0 offset

    const threePosx = this.offsetx;
    const threePosy = this.offsety + 
        (priority >= 1 * this.priority[0].length * this.p1_size) + // add p1 diff if p1 and below
        (priority >= 2 * this.priority[1].length * this.p2_size) + // add p2 diff if p2 and below
        (priority >= 3 * this.priority[2].length * this.p3_size);  // add p3 diff if p3 
        
        

    const position = Three_to_document_position(threePosx, threePosy); // convert

    curr.position.x = position.x;
    curr.position.y = position.y;

    document.documentElement.appendChild (curr);
}