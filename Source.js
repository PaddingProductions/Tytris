const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 500;
camera.position.x = window.innerWidth/2;
camera.position.y = window.innerHeight/2;



game.update_preview();

function MainLoop () {
    
    game.init();
}

SOURCE_LOOP = setInterval(MainLoop, 30);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);