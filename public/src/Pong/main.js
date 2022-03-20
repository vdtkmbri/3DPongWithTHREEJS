import * as THREE from 'three';
import { createComponents } from './components';
import { GUI } from 'dat.gui';
import { keyPressed, newGame, play } from './rules';
import { pointsLeft, pointsRight } from './rules';
var gui = new GUI();
function createCamera(fov, aspect, near, far) {
    if (fov === void 0) { fov = 40; }
    if (aspect === void 0) { aspect = window.innerWidth / window.innerHeight; }
    if (near === void 0) { near = 0.1; }
    if (far === void 0) { far = 1000; }
    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 60, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    return camera;
}
function createLight() {
    var color = 0xFFFFFF;
    var intensity = 3;
    var light = new THREE.PointLight(color, intensity);
    return light;
}
function resizeRendererToDisplaySize(renderer) {
    var canvas = renderer.domElement;
    var pixelRatio = window.devicePixelRatio;
    var width = canvas.clientWidth * pixelRatio | 0;
    var height = canvas.clientHeight * pixelRatio | 0;
    var needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        // false verhindert jegliche Stiländerungen in Output-Canvas
        renderer.setSize(width, height, false);
    }
    return needResize;
}
function maxPointsAchieved(pointsLeft, pointsRight) {
    if (pointsRight === 10 || pointsLeft === 10) {
        return true;
    }
    else {
        return false;
    }
}
function gameOver(playMode, sphereMesh, result) {
    playMode = false;
    sphereMesh.position.x = 0;
    sphereMesh.position.z = 0;
    if (pointsRight > pointsLeft) {
        result.innerHTML = "Right WON";
    }
    else {
        result.innerHTML = "Left WON";
    }
}
function main() {
    var canvas = document.querySelector('#c');
    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    var camera = createCamera();
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    var light = createLight();
    scene.add(light);
    var pointsLeftPlayer = document.querySelector('#pointsLeftPlayer');
    var pointsRightPlayer = document.querySelector('#pointsRightPlayer');
    var result = document.querySelector('.result');
    var playMode = false;
    var showResult = 1;
    var dontShowResult = -1;
    // an array of objects whose rotation to update
    var objects = [];
    createComponents(scene, objects);
    var gameField = objects[0];
    var boxMeshL = objects[1];
    var boxMeshR = objects[2];
    var boxMeshTop = objects[3];
    var boxMeshBottom = objects[4];
    var sphereMesh = objects[5];
    // makeAxisGrid(gui ,gameField, 'gameFieldGrid');
    // Bewege Boxmesh
    document.onkeydown = function (event) { keyPressed(event, boxMeshL, boxMeshR); };
    var startBtn = document.querySelector('#startBtn');
    startBtn.onclick = function () {
        newGame();
        playMode = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        result.style.zIndex = dontShowResult.toString();
    };
    var pauseBtn = document.querySelector('#pauseBtn');
    pauseBtn.onclick = function () {
        playMode = !playMode;
    };
    var stopBtn = document.querySelector('#stopBtn');
    stopBtn.onclick = function () {
        newGame();
        playMode = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        result.style.zIndex = dontShowResult.toString();
        sphereMesh.position.x = 0;
        sphereMesh.position.z = 0;
    };
    function render(time) {
        time *= 0.001; // convert time to seconds
        if (resizeRendererToDisplaySize(renderer)) {
            var canvas_1 = renderer.domElement;
            camera.aspect = canvas_1.clientWidth / canvas_1.clientHeight;
            // NICHT EMPFOHLEN besser über die Methode resizeRendererToDisplaySize(...)
            // renderer.setPixelRatio(window.devicePixelRatio); 
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        if (playMode) {
            play(sphereMesh, boxMeshL, boxMeshR);
            if (maxPointsAchieved(pointsLeft, pointsRight)) {
                gameOver(playMode, sphereMesh, result);
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
                result.style.zIndex = showResult.toString();
            }
            else {
                pointsLeftPlayer.innerHTML = pointsLeft.toString();
                pointsRightPlayer.innerHTML = pointsRight.toString();
            }
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
export { main as mainPong };
//# sourceMappingURL=main.js.map