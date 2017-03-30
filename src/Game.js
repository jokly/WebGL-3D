import { vec3 } from 'gl-matrix';

import Program from './Program';
import Geometry from './Geometry';
import Renderer from './Renderer';
import Pipeline from './Pipeline';
import Camera from './Camera';

let canvas = document.getElementById('webgl-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
glContext.enable(glContext.DEPTH_TEST);

let renderer = new Renderer(glContext, canvas.width, canvas.height);

let camera = new Camera(0, 0, 10);
renderer.setCamera(camera)

let program = new Program(glContext);
program.setVertexShader('shader-vs');
program.setFragmentShader('shader-fs');

let vertices = [
    // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,
      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,
      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,
      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
];

let indices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];

let colors = [
    [1.0, 0.0, 0.0, 1.0],     // Front face
    [1.0, 1.0, 0.0, 1.0],     // Back face
    [0.0, 1.0, 0.0, 1.0],     // Top face
    [1.0, 0.5, 0.5, 1.0],     // Bottom face
    [1.0, 0.0, 1.0, 1.0],     // Right face
    [0.0, 0.0, 1.0, 1.0],     // Left face
];

let unpackedColors = [];
for (let i in colors) {
    let color = colors[i];
    for (let j = 0; j < 4; j++) {
        unpackedColors = unpackedColors.concat(color);
    }
}

let geometries = [];
let zTranslate = 0;

for (let i = 0; i < 3; i++) {
    let geometry = new Geometry(glContext);
    geometry.addAttribute('vertexPosition', new Float32Array(vertices), 3);
    geometry.setIndices(new Uint16Array(indices));
    geometry.addAttribute('vertexColor', new Float32Array(unpackedColors), 4);
    geometry.setTranslate(vec3.fromValues(0, 0, zTranslate));
    renderer.addGeometry(geometry);

    zTranslate += 2;
}

let pipeline = new Pipeline();
pipeline.setPerspective(canvas.width, canvas.height);
renderer.setPipeline(pipeline);

renderer.setProgram(program);

function render() {
    window.requestAnimFrame(render);
    handleKeys();
    camera.updateCameraMatrix();
    renderer.render();
    camera.animate();
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.ieRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

let currentlyPressedKeys = {};

document.onkeydown = function(e) {
    currentlyPressedKeys[e.keyCode] = true;
};

document.onkeyup = function(e) {
    currentlyPressedKeys[e.keyCode] = false;  
}

function handleKeys() {
    if (currentlyPressedKeys[33]) {
        camera.setPitchRate(0.1);
    } else if (currentlyPressedKeys[34]) {
        camera.setPitchRate(-0.1);
    } else {
        camera.setPitchRate(0);
    }


    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        camera.setYawRate(0.1);
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        camera.setYawRate(-0.1);
    } else {
        camera.setYawRate(0);
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        camera.setSpeed(0.003);
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        camera.setSpeed(-0.003);
    } else {
        camera.setSpeed(0);
    }
}

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pipeline.setPerspective(canvas.width, canvas.height);
    renderer.setViewport(canvas.width, canvas.height);
};

window.onmousemove = function(event) {
    // change camera matrix on mouse move
};

render();