CreateLine = function (vertices , width, color) {

    for (let i=1; i<vertices.length; i++) {

        var diffx = Math.abs(vertices[i][0] - vertices[i-1][0]);
        var diffy = Math.abs(vertices[i][1] - vertices[i-1][1]);

        var length = Math.sqrt(diffx*diffx + diffy*diffy) + width;

        var posx = Math.min(vertices[i][0], vertices[i-1][0]) + diffx / 2;
        var posy = Math.min(vertices[i][1], vertices[i-1][1]) + diffy / 2;

        var rect_geometry = new THREE.PlaneGeometry( width, length );
        var rect_material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        var rect = new THREE.Mesh( rect_geometry, rect_material );

        rect.position.x = posx;
        rect.position.y = posy;
        
        if (diffy != 0) 
            rect.rotation.z = Math.atan(diffx/diffy);
        else 
            rect.rotation.z = 0.5*Math.PI;

        scene.add( rect );
    }
}


Three_to_document_position = function (posx, posy) {
    var camH = 1000*Math.tan(75/2 * Math.PI/180);                         // camera fov width
    var camW = window.innerHeight/window.innerWidth * camH; // camera fov height
    var Rposx = posx/camW;                                  // THREE.js posx in ratio form
    var Rposy = posy/camH;                                  // THREE.js posy in ratio form
    var Tposx = Rposx*window.innerWidth;                    // true on screen posx, THREE.js origin
    var Tposy = Rposy*window.innerHeight;                   // true on screen posy, THREE.js origin
    var outx = Tposx;                                       // origin change doesn't affect posx
    var outy = window.innderHeight - Tposy;                 // origin change requires y change

    return {
        x: outx,
        y: outy,
    }
}