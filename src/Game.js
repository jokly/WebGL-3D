import { vec3 } from 'gl-matrix';

import Program from './Program';
import Texture from './Texture';
import Renderer from './Renderer';
import Pipeline from './Pipeline';
import Camera from './Camera';
import Cube from './Cube';
import Floor from './Floor';
import AmbientLight from './AmbientLight';
import LightingDirection from './LightingDirection'
import PointLights from './PointLights';

let canvas = document.getElementById('webgl-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

let renderer = new Renderer(glContext, canvas.width, canvas.height);

let camera = new Camera(0, 2, 10);
renderer.setCamera(camera)

let program = new Program(glContext);
program.setVertexShader('shader-vs');
program.setFragmentShader('shader-fs');
program.setUniform('uSampler', 'uniform1i', 0);
renderer.setProgram(program);

let ambientLight = new AmbientLight(program);
let lightingDirection= new LightingDirection(program);
let pointLights = new PointLights(program);

let pipeline = new Pipeline();
pipeline.setPerspective(canvas.width, canvas.height);
renderer.setPipeline(pipeline);

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

function getSpawnPosition() {
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

    return [cameraPos.x + diff[0], cameraPos.y + diff[1], cameraPos.z + diff[2]];
}

function spawnLight(r, g, b, x = -1, y = -1, z = -1) {
    let pos;
    if (x == -1 || y == -1 || z == -1) {
        pos = getSpawnPosition();
    }
    else {
        pos = [x, y, z];
    }

    let values = [pos[0], pos[1], pos[2],
                  r, g, b];
    let lenL = pointLights.setLight([values[0], values[1], values[2]],
        [values[3], values[4], values[5]]);
    let id = lenL - 1;

    let ui = document.getElementById('ui');
    var elements = ['l_x_' + id, 'l_y_' + id, 'l_z_' + id,
                    'l_r_' + id, 'l_g_' + id, 'l_b_' + id];

    for (let i = 0; i < elements.length; i++) {
        let input = document.createElement('input');
        input.id = elements[i];
        input.type = 'text';
        input.size = 3;
        input.placeholder = elements[i];
        input.value = values[i];

        input.oninput = (e) => {
            let index = parseFloat(e.target.id.substr(4));
            let x = parseFloat(document.getElementById('l_x_' + index).value);
            let y = parseFloat(document.getElementById('l_y_' + index).value);
            let z = parseFloat(document.getElementById('l_z_' + index).value);
            let r = parseFloat(document.getElementById('l_r_' + index).value);
            let g = parseFloat(document.getElementById('l_g_' + index).value);
            let b = parseFloat(document.getElementById('l_b_' + index).value);
            pointLights.setLight([x, y, z], [r, g, b], index);
        }

        ui.appendChild(input);
    }
    ui.appendChild(document.createElement('br'));
}

document.onkeyup = function(e) {
    currentlyPressedKeys[e.keyCode] = false;

    if (e.keyCode == 32) {
        renderer.addGeometry(new Cube(glContext, cubeTex,
            {translate: getSpawnPosition(),
            isCollided: true}).geometry);
    }

    if (e.keyCode == 76) {
        spawnLight(0, 0.5, 0);
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

function saveGame(saveName) {

}

function loadGame(savedGame) {
    // load Camera
    let cameraPos = savedGame.camera;
    camera.setPosition(camera.x, camera.y, camera.z);
    camera.setSYP(camera.speed, camera.yaw, camera.pitch);

    // load Textures
    let textures = {}
    for (let texture of savedGame.textures) {
        textures[texture.name] = new Texture(glContext, texture.path);
    }

    // load Objects
    for (let shape of savedGame.shapes) {
        switch (shape.type) {
            case 'Floor':
                renderer.addGeometry([new Floor(glContext, textures[shape.texture],
                    {translate: shape.translate, scale: shape.scale, isCollided: shape.isCollided}).geometry]);
                break;
            case 'Cube':
                renderer.addGeometry(new Cube(glContext, textures[shape.texture],
                    {translate: shape.translate, scale: shape.scale, isCollided: shape.isCollided}).geometry);
                break;
        }
    }

    // load Ambient Light
    let ambLight = savedGame.ambientLight;
    ambientLight.setRGB(ambLight.r, ambLight.g, ambLight.b);

    // load Lighting Direction
    let lightingDir = savedGame.lightingDirection;
    lightingDirection.setDirection(lightingDir.x, lightingDir.y, lightingDir.z);
    lightingDirection.setRGB(lightingDir.r, lightingDir.g, lightingDir.b);

    // load Point Lights
    for (let light of savedGame.pointLights) {
        spawnLight(light.r, light.g, light.b, light.x, light.y, light.z);
    }
}

window.onSaveClick = function() {

}

var saveFile;
window.onLoadClick = function() {
    let saveName = document.getElementById('saveName').value;

    if (saveName === '') {
        saveName = 'newGame';
    }

    if (saveFile === undefined) {
        saveFile = require('../saves/saves.json');
    }

    loadGame(saveFile[saveName]);
}

window.uiMouseDown = function (keyCode) {
    currentlyPressedKeys[keyCode] = true;
}

window.uiMouseUp = function (keyCode) {
    currentlyPressedKeys[keyCode] = false;

    if (keyCode === 'c') {
        renderer.addGeometry(new Cube(glContext, cubeTex,
            {translate: getSpawnPosition(),
            isCollided: true}).geometry);
    }

    if (keyCode === 'l') {
        spawnLight();
    }
}

window.toggleUI = function() {
    let ui = document.getElementById('mobile-controls');

    if (ui.style.display === 'block') {
        ui.style.display = 'none';
    }
    else {
        ui.style.display = 'block';
    }
}

document.getElementById('ambientR').oninput = () => {
    ambientLight.updateAmbientLightUniform();
}

document.getElementById('ambientG').oninput = () => {
    ambientLight.updateAmbientLightUniform();
}

document.getElementById('ambientB').oninput = () => {
    ambientLight.updateAmbientLightUniform();
}

document.getElementById('directionX').oninput = () => {
    lightingDirection.updateDirection();
}

document.getElementById('directionY').oninput = () => {
    lightingDirection.updateDirection();
}

document.getElementById('directionZ').oninput = () => {
    lightingDirection.updateDirection();
}

document.getElementById('directionR').oninput = () => {
    lightingDirection.updateColor();
}

document.getElementById('directionG').oninput = () => {
    lightingDirection.updateColor();
}

document.getElementById('directionB').oninput = () => {
    lightingDirection.updateColor();
}

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pipeline.setPerspective(canvas.width, canvas.height);
    renderer.setViewport(canvas.width, canvas.height);
};

document.addEventListener('contextmenu', event => event.preventDefault());

window.onmousemove = function(event) {
    // change camera matrix on mouse move
};

// Loading new Game
window.onLoadClick();
render();
