import { vec3 } from 'gl-matrix';

import Program from './Program';
import Texture from './Texture';
import Renderer from './Renderer';
import Pipeline from './Pipeline';
import Camera from './Camera';
import Cube from './Cube';
import Floor from './Floor';

let canvas = document.getElementById('webgl-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

let renderer = new Renderer(glContext, canvas.width, canvas.height);

let camera = new Camera(0, 0, 10);
renderer.setCamera(camera)

let program = new Program(glContext);
program.setVertexShader('shader-vs');
program.setFragmentShader('shader-fs');
program.setUniform('uSampler', 0,  'uniform1i');

let texture = new Texture(glContext, 'img/box.png');
let zTranslate = 0;
for (let i = 0; i < 3; i++) {
    let cube = new Cube(glContext, texture, {translate: [0, 0, zTranslate], isCollided: true});
    renderer.addGeometry(cube.geometry);
    zTranslate += 2;
}

let floorTex = new Texture(glContext, 'img/grass.jpg');
let floor = new Floor(glContext, floorTex, {translate: [0, 0, 10], scale: [100, 1, 100]});
renderer.addGeometry(floor.geometry);

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
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

let currentlyPressedKeys = {};

document.onkeydown = function(e) {
    currentlyPressedKeys[e.keyCode] = true;
};

document.onkeyup = function(e) {
    currentlyPressedKeys[e.keyCode] = false;

    if (e.keyCode == 32) {
        let block = new Geometry(glContext, true);
        block.addAttribute('vertexPosition', new Float32Array(vertices), 3);
        block.setIndices(new Uint16Array(indices));
        block.addAttribute('textureCoord', new Float32Array(textureCoords), 2);
        block.setTexture(texture);
        let cameraPos = camera.getPosition();
        let cameraMatrix = camera.getCameraMatrix();
        let diff = [0, 0, 0];

        if (cameraMatrix[2] > 0.5) {
            diff[0] = -3;
        }
        else if (cameraMatrix[2] < -0.5) {
            diff[0] = 3;
        }

        if (cameraMatrix[10] > 0.5) {
            diff[2] = -3;
        }
        else if (cameraMatrix[10] < -0.5) {
            diff[2] = 3;
        }

        block.setTranslate(cameraPos.x + diff[0], cameraPos.y + diff[1], cameraPos.z + diff[2]);
        renderer.addGeometry(block);
    }
}

function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
        camera.setPitchRate(0.2);
    } else if (currentlyPressedKeys[34]) {
        // Page Down
        camera.setPitchRate(-0.2);
    } else {
        camera.setPitchRate(0);
    }

    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        camera.setYawRate(0.2);
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        camera.setYawRate(-0.2);
    } else {
        camera.setYawRate(0);
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        camera.setSpeed(0.01);
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        camera.setSpeed(-0.01);
    }
    else {
        camera.setSpeed(0);
    }

    let newPos = camera.getNextPosition();

    if (checkCollision(newPos)) {
        camera.setSpeed(0);
    }
}

function checkCollision(point) {
    let geometries = renderer.getGeometries();

    for (let geom of geometries) {
        let minVec = geom.getMinVertex();
        let maxVec = geom.getMaxVertex();
        let eps = 0.2;

        if (geom.canCollided() &&
            (point.x - eps <= maxVec.x) &&
            (point.x + eps >= minVec.x) &&
            (point.y - eps <= maxVec.y) &&
            (point.y + eps >= minVec.y) &&
            (point.z - eps <= maxVec.z) &&
            (point.z + eps >= minVec.z)) {
                return true;
        }
    }

    return false;
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
