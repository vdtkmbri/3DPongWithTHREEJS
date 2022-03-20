import * as THREE from 'three';
import { createComponents, makeAxisGrid } from './ComponentCreator';
import { GUI } from 'dat.gui';
import { keyPressed, play, resetPoints } from './Rules';
import { pointsLeft, pointsRight } from './Rules';
import { initWSClient, 
        sendKeyDownEventToWSServer, 
        sendKeyUpEventToWSServer, 
        sendBtnEventToWSServer, 
        sendInitDirAndVel, 
        sendChosenPlayer } from '../WebSocket/WSClient';

// const gui = new GUI();

let lastTimeStamp: DOMHighResTimeStamp;

const canvas = document.querySelector<HTMLCanvasElement>('#c');
const divCanvas = document.querySelector<HTMLCanvasElement>('.divCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
let camera: THREE.PerspectiveCamera;

const scene = new THREE.Scene();
let light: THREE.PointLight;

const pointsLeftPlayer: HTMLDivElement = document.querySelector<HTMLDivElement>('#pointsLeftPlayer');
const pointsRightPlayer: HTMLDivElement = document.querySelector<HTMLDivElement>('#pointsRightPlayer');
const result: HTMLDivElement = document.querySelector<HTMLDivElement>('.result');

let inPlayMode = false;
let showResult = 1;
let dontShowResult = -1;
let keyDownArray: String[] = [];

let objects: THREE.Mesh[] = [];

let gamefield: THREE.Object3D;
let playerL: THREE.Mesh;
let playerR: THREE.Mesh;
let boundaryTop: THREE.Mesh;
let boundaryBottom: THREE.Mesh;
let ball: THREE.Mesh;

const CHOOSE_PLAYER_EVENT: String = 'choosePlayerEvent';
const LEFT_CHOSEN = "leftChosen";
const RIGHT_CHOSEN = "rightChosen";
const LEFT_PLAYER = "leftPlayer";
const RIGHT_PLAYER = "rightPlayer";
const chooseLeftBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#chooseLeftBtn');
const chooseRightBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#chooseRightBtn');
const divChooseBtns: HTMLDivElement = document.querySelector<HTMLDivElement>('.divChooseBtns');

const startBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#startBtn');
const pauseBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#pauseBtn');
const stopBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#stopBtn');

//------------------------------- THREEJS FUNCTIONS -----------------------------------------
function createCamera(
    fov: number = 40,
    aspect: number = window.innerWidth / window.innerHeight,
    near: number = 0.1,
    far: number = 1000
): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 60, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    return camera;
}

function createLight(): THREE.PointLight {
    const color = 0xFFFFFF; // White
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0,0,0);
    return light;
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        // false verhindert jegliche Stiländerungen in Output-Canvas
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function setScene(){
    camera = createCamera();
    scene.background = new THREE.Color(0x000000);
    light = createLight();
    scene.add(light);

    createComponents(scene, objects);
    gamefield = objects[0];
    playerL = objects[1];
    playerR = objects[2];
    boundaryTop = objects[3];
    boundaryBottom = objects[4];
    ball = objects[5];
}

//------------------------------- GAME FUNCTIONS -----------------------------------------

function setEventListeners(){
    // Button Events
    chooseLeftBtn.onclick = () => {
        sendChosenPlayer(CHOOSE_PLAYER_EVENT, LEFT_PLAYER);
        divChooseBtns.style.display = "none";
    }

    chooseRightBtn.onclick = () => {
        sendChosenPlayer(CHOOSE_PLAYER_EVENT, RIGHT_PLAYER);
        divChooseBtns.style.display = "none";
    }
    // Button Events im Spiel
    startBtn.onclick = () => {
        sendBtnEventToWSServer("btnEvent", "start");
        sendInitDirAndVel("start");
        divCanvas.focus();
    };

    pauseBtn.onclick = () => { sendBtnEventToWSServer("btnEvent", "pause"); };
    
    stopBtn.onclick = () => { sendBtnEventToWSServer("btnEvent", "stop"); };
    
    // KeyEvents
    document.onkeydown = (event) => {
        sendKeyDownEventToWSServer("keyDown", event);
    }
    document.onkeyup = (event) => {
        sendKeyUpEventToWSServer("keyUp", event);
    }
}

export function disableChooseBtn(btn: String){
    if (btn === LEFT_CHOSEN) {
        chooseLeftBtn.disabled = true;
    }else if (btn === RIGHT_CHOSEN) {
        chooseLeftBtn.disabled = true;
    }
}

function maxPointsAchieved(pointsLeft: number, pointsRight: number): boolean {
    if (pointsRight === 10 || pointsLeft === 10) {
        return true;
    } else { return false; }
}

function gameOver() {
    inPlayMode = false;
    ball.position.x = 0;
    ball.position.z = 0;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    if (pointsRight > pointsLeft) {
        result.innerHTML = "Right WON";
    } else {
        result.innerHTML = "Left WON";
    }
    
    result.style.zIndex = showResult.toString();
    resetPoints()
}

export function keyDown(key: String): void {
    if (key === "ArrowUp") {
        keyDownArray[0] = key;
    } else if (key === "ArrowDown") {
        keyDownArray[1] = key;
    } else if (key === "KeyW") {
        keyDownArray[2] = key;
    } else if (key === "KeyS") {
        keyDownArray[3] = key;
    }
}

export function keyUp(key: String): void {
    if (key === "ArrowUp") {
        keyDownArray[0] = "";
    } else if (key === "ArrowDown") {
        keyDownArray[1] = "";
    } else if (key === "KeyW") {
        keyDownArray[2] = "";
    } else if (key === "KeyS") {
        keyDownArray[3] = "";
    }
}

function checkKeyMovement(){
    if (keyDownArray[0] === "ArrowUp") {
        keyPressed("ArrowUp", playerL, playerR, boundaryTop, boundaryBottom);
    }
    if (keyDownArray[1] === "ArrowDown") {
        keyPressed("ArrowDown", playerL, playerR, boundaryTop, boundaryBottom);
    }
    if (keyDownArray[2] === "KeyW") {
        keyPressed("KeyW", playerL, playerR, boundaryTop, boundaryBottom);
    }
    if (keyDownArray[3] === "KeyS") {
        keyPressed("KeyS", playerL, playerR, boundaryTop, boundaryBottom);
    }
}

export function startGame(): void {
    inPlayMode = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    result.style.zIndex = dontShowResult.toString();
}

export function pauseGame(): void {
    inPlayMode = !inPlayMode;
}

export function stopGame(): void {
    inPlayMode = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    result.style.zIndex = dontShowResult.toString();
    ball.position.x = 0;
    ball.position.z = 0;
    playerL.position.z = 0;
    playerR.position.z = 0;
    resetPoints();
}
//------------------------------------------ MAIN -------------------------------------
function main() {
    
    // WebSocketClient initialisieren
    initWSClient();

    // Scene vorbereiten
    setScene();

    // makeAxisGrid(gui ,gameField, 'gameFieldGrid');

    // Um die Spieler zu bewegen
    setEventListeners();
    
    function render(time: DOMHighResTimeStamp): void {
        if (lastTimeStamp === undefined) {
            lastTimeStamp = time;
        }

        const elapsed = (time - lastTimeStamp) / 1000; //Milisek -> Sek

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        checkKeyMovement();
        
        if (inPlayMode) {

            play(boundaryTop, boundaryBottom, ball, playerL, playerR, elapsed);

            if (maxPointsAchieved(pointsLeft, pointsRight)) {
                gameOver();
            } else {
                pointsLeftPlayer.innerHTML = pointsLeft.toString();
                pointsRightPlayer.innerHTML = pointsRight.toString();
            }
        }

        lastTimeStamp = time;

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

export { main as mainPong };

