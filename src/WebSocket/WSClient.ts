import { 
            disableChooseBtn, 
            keyDown, 
            keyUp, 
            pauseGame, 
            startGame, 
            stopGame 
        } from "../Pong/Game";

import { setDirAndVel } from "../Pong/Rules";

let ws: WebSocket;
const LEFT_CHOSEN = "leftChosen";
const RIGHT_CHOSEN = "rightChosen";
const KEY_DOWN_EVENT: String = 'keyDown';
const KEY_UP_EVENT: String = 'keyUp';

const BALL_EVENT: String = 'ballEvent';

const BTN_EVENT: String = 'btnEvent';
const START: String = 'start';
const PAUSE: String = 'pause';
const STOP: String = 'stop';

const INIT_DIR_VEL: String = 'init_dir_vel';

// ----------------- HILFSMETHODEN UM DIE PARAMETER AUS DEN JSON-FILES ZU ENTZIEHEN ---------------------
function getBtnMsg(data: any): String {
    let btn: String;
    try {
        btn = JSON.parse(data).btn;
    } catch (error) { console.error(); }

    return btn;
}

function getKeyMsg(data: any): String {
    let key: String;
    try {
        key = JSON.parse(data).key;
    } catch (error) { console.error(); }

    return key;
}

function getBallMsg(data: any): number[] {
    let ballParameter: number[] = [];
    try {
        data = JSON.parse(data);
        ballParameter[0] = data.dx;
        ballParameter[1] = data.dz;
        ballParameter[2] = data.vel;
    } catch (error) { console.error(); }

    return ballParameter;
}

// ----------------- HILFSMETHODEN UM DIE EVENTS DES CLIENTS ZU SENDEN UND ZU SETZEN ---------------------

export function sendChosenPlayer(CHOOSE_PLAYER_EVENT: String, PLAYER: String){
    ws.send(JSON.stringify({
        event: CHOOSE_PLAYER_EVENT,
        origin: PLAYER,
    }));
}

export function sendBtnEventToWSServer(origin: String, btn: String) {
    ws.send(JSON.stringify({
        event: origin,
        btn: btn,
    }));
}

function buttonMessage(message: String): void {
    if (message === START) {
        startGame();
    } else if (message === PAUSE) {
        pauseGame();
    } else if (message === STOP) {
        stopGame();
    }
}

export function sendInitDirAndVel(origin: String){
    ws.send(JSON.stringify({
        event: INIT_DIR_VEL,
        origin: origin,
    }));
}

function dirAndVel(dx: number, dz: number, vel: number) { setDirAndVel(dx, dz, vel); }

export function sendKeyDownEventToWSServer(origin: String, key: KeyboardEvent) {
    if(key.code === "ArrowUp" || key.code === "ArrowDown" ||
        key.code === "KeyW" || key.code === "KeyS"){
        ws.send(JSON.stringify({
            event: origin,
            key: key.code,
        }));
    }
}

function setKeyDown(message: String): void { keyDown(message); }

export function sendKeyUpEventToWSServer(origin: String, key: KeyboardEvent) {
    if(key.code === "ArrowUp" || key.code === "ArrowDown" ||
        key.code === "KeyW" || key.code === "KeyS" ){
        ws.send(JSON.stringify({
            event: origin,
            key: key.code,
        }));
    }
}

function setKeyUp(message: String): void {  keyUp(message);  }


export function initWSClient() {
    ws = new WebSocket('ws://localhost:8081');
    // ws://localhost:8081
    // ws://pcwinf004:8081
    ws.onopen = () => { console.log('Connection opened!'); }
    ws.onmessage = ({ data }) => {
        console.log("WSClient received: " + data);

        // Finde heraus welcher Event es ist
        let _event: String;
        try { _event = JSON.parse(data).event; }
        catch (error) { console.error(); }

        //----------------------------------------------------------------
        if (_event === LEFT_CHOSEN) {
            disableChooseBtn(LEFT_CHOSEN);
            console.log("LEFT_CHOSEN: " + LEFT_CHOSEN);
        }else if (_event === RIGHT_CHOSEN) {
            disableChooseBtn(RIGHT_CHOSEN);
            console.log("RIGHT_CHOSEN: " + RIGHT_CHOSEN);
        }else if (_event === BTN_EVENT) {
            const msg: String = getBtnMsg(data);
            buttonMessage(msg);
        } else if (_event === KEY_DOWN_EVENT) {
            const msg: String = getKeyMsg(data);
            setKeyDown(msg);
        } else if (_event === KEY_UP_EVENT) {
            const msg: String = getKeyMsg(data);
            setKeyUp(msg);
        } else if (_event === BALL_EVENT) {
            const param: number[] = getBallMsg(data);
            const dx: number = param[0];
            const dz: number = param[1];
            const vel: number = param[2];

            dirAndVel(dx, dz, vel);
        }
    }

    ws.onclose = function () {
        ws = null;
    }
}
