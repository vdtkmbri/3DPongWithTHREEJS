export var pointsLeft = 0;
export var pointsRight = 0;
var dx;
var dz;
var vel_x;
var vel_z;
var upCount = 0;
var downCount = 0;
var upCountL = 0;
var downCountL = 0;
export function play(sphereMesh, boxMeshL, boxMeshR) {
    if (sphereMesh.position.x < -10 || sphereMesh.position.x > 10) {
        if (hitLeftPlayer(sphereMesh, boxMeshL) || hitRightPlayer(sphereMesh, boxMeshR)) {
            dx = -dx;
        }
        else {
            // const anfangL = boxMeshL.position.z - 4
            // const endeL = boxMeshL.position.z + 4
            // const anfangR = boxMeshR.position.z - 4
            // const endeR = boxMeshR.position.z + 4
            // console.log("Ball pos x: " + sphereMesh.position.x + ", Ball pos z: " + sphereMesh.position.z)
            // console.log("Box L pos x: " + boxMeshL.position.x + ", Box L pos z: " + anfangL + ", " + endeL)
            // console.log("Box R pos x: " + boxMeshR.position.x + ", Box R pos z: " + anfangR + ", " + endeR)
            if (sphereMesh.position.x > 0) {
                pointsRight++;
                console.log(pointsRight);
            }
            else if (sphereMesh.position.x < 0) {
                pointsLeft++;
                console.log(pointsLeft);
            }
            else {
                console.log("Something went wrong with incrementing Points!");
            }
            sphereMesh.position.x = 0;
            sphereMesh.position.z = 0;
            startGame();
        }
    }
    if (sphereMesh.position.z < -11 || sphereMesh.position.z > 11) {
        dz = -dz;
    }
    sphereMesh.translateX(vel_x * dx);
    sphereMesh.translateZ(vel_z * dz);
}
function hitLeftPlayer(sphereMesh, boxMeshL) {
    if (sphereMesh.position.z < (boxMeshL.position.z + 4) &&
        sphereMesh.position.z > (boxMeshL.position.z - 4) &&
        sphereMesh.position.x > 0) {
        return true;
    }
}
function hitRightPlayer(sphereMesh, boxMeshR) {
    if (sphereMesh.position.z < (boxMeshR.position.z + 4) &&
        sphereMesh.position.z > (boxMeshR.position.z - 4) &&
        sphereMesh.position.x < 0) {
        return true;
    }
}
function startGame() {
    dx = Math.random() < .5 ? -1 : 1; // nach Links oder Rechts
    dz = Math.random() < .5 ? -1 : 1; // nach Unten oder Oben
    vel_x = Math.random() / 10 + 0.05; // Geschwindigkeit in x-Richtung
    vel_z = Math.random() / 10 + 0.05; // Geschwindigkeit in Z-Richtung
}
export function newGame() {
    pointsRight = 0;
    pointsLeft = 0;
    startGame();
}
// Spieler links mit w-s tasten steuern, Spieler rechts pfeiltasten steuern
export function keyPressed(event, boxMeshL, boxMeshR) {
    if (event.code === 'ArrowUp') {
        if (upCount < 8) {
            downCount--;
            upCount++;
            boxMeshR.translateZ(1);
        }
        else {
            boxMeshR.translateX(0);
        }
    }
    if (event.code === 'ArrowDown') {
        if (downCount < 8) {
            downCount++;
            upCount--;
            boxMeshR.translateZ(-1);
        }
        else {
            boxMeshR.translateX(0);
        }
    }
    if (event.code === 'KeyW') {
        if (upCountL < 8) {
            downCountL--;
            upCountL++;
            boxMeshL.translateZ(1);
        }
        else {
            boxMeshL.translateX(0);
        }
    }
    if (event.code === 'KeyS') {
        if (downCountL < 8) {
            downCountL++;
            upCountL--;
            boxMeshL.translateZ(-1);
        }
        else {
            boxMeshL.translateX(0);
        }
    }
}
//# sourceMappingURL=rules.js.map