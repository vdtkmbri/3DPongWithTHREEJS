import * as THREE from 'three';
import { sendInitDirAndVel } from '../WebSocket/WSClient';

export let pointsLeft: number = 0;
export let pointsRight: number = 0;

let dx: number;
let dz: number;
let vel: number;

export function play(
    boundaryTop: THREE.Mesh,
    boundaryBottom: THREE.Mesh,
    ball: THREE.Mesh,
    playerL: THREE.Mesh,
    playerR: THREE.Mesh,
    elapsedTime: DOMHighResTimeStamp
) {
    if (ball.position.x < (playerR.position.x + playerR.scale.x)  || 
        ball.position.x > (playerL.position.x - playerL.scale.x)) {
        if (hitLeftPlayer(ball, playerL) || hitRightPlayer(ball, playerR)) {
            dx = -dx;
        } else {
            if (ball.position.x > 0) {
                pointsRight++;
            } else if (ball.position.x < 0) {
                pointsLeft++;
            } else {
                console.log("Something went wrong with incrementing Points!");
            }
            ball.position.x = 0;
            ball.position.z = 0;
            dx = 0;
            dz = 0;
            vel = 0;
            sendInitDirAndVel("play");
            
        }
    }else if (ball.position.z < (boundaryBottom.position.z + boundaryBottom.scale.z/2) || 
            ball.position.z > (boundaryTop.position.z - boundaryTop.scale.z/2)) {
        dz = -dz;
    }
    //Bewegung des Balls
    ball.translateX(vel * dx * elapsedTime);
    ball.translateZ(vel * dz * elapsedTime);

}

function hitLeftPlayer(ball: THREE.Mesh, playerL: THREE.Mesh) {
    if (ball.position.z < (playerL.position.z + playerL.scale.z/2) &&
        ball.position.z > (playerL.position.z - playerL.scale.z/2) &&
        ball.position.x > 0
    ) {
        return true;
    }
}

function hitRightPlayer(ball: THREE.Mesh, playerR: THREE.Mesh) {
    if (ball.position.z < (playerR.position.z + playerR.scale.z/2) &&
        ball.position.z > (playerR.position.z - playerR.scale.z/2) &&
        ball.position.x < 0
    ) {
        return true;
    }
}

export function resetPoints(){
    pointsLeft = 0;
    pointsRight = 0;
}

export function setDirAndVel(_dx: number, _dz: number, _vel: number) {
    dx = _dx; // nach Links oder Rechts
    dz = _dz; // nach Unten oder Oben
    vel = _vel; // Geschwindigkeit
}

// Spieler links mit w-s tasten steuern, Spieler rechts pfeiltasten steuern
export function keyPressed(
    key: String, 
    playerL: THREE.Mesh, 
    playerR: THREE.Mesh,
    boundaryTop: THREE.Mesh,
    boundaryBottom: THREE.Mesh) {
    if (key === 'ArrowUp') {
        if ((playerR.position.z + playerR.scale.z/2-1) < (boundaryTop.position.z-1)) {
            playerR.translateZ(.3);
        } else { playerR.translateX(0); }
    }

    if (key === 'ArrowDown') {
        if ((playerR.position.z - playerR.scale.z/2+1) > (boundaryBottom.position.z + 1)) {
            playerR.translateZ(-.3);
        } else { playerR.translateX(0); }
    }

    if (key === 'KeyW') {
        if ((playerL.position.z + playerL.scale.z/2-1) < (boundaryTop.position.z-1)) {
            playerL.translateZ(.3);
        } else { playerL.translateX(0); }
    }

    if (key === 'KeyS') {
        if ((playerL.position.z - playerL.scale.z/2+1) > (boundaryBottom.position.z + 1)) {
            playerL.translateZ(-.3);
        } else { playerL.translateX(0); }
    }

}



