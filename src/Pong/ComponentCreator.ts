import * as THREE from 'three';
import { GUI } from 'dat.gui';

function createMeshSphere(): THREE.Mesh {
    const radius = 1;
    const widthSegments = 10;
    const heightSegments = 10;
    const geo = new THREE.SphereGeometry(
        radius, widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({ color: 'white', emissive: 'grey' });
    material.flatShading = true;
    const mesh = new THREE.Mesh(geo, material);
    return mesh;
}

function createMeshBox(): THREE.Mesh {
    const geo = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 'white', emissive: 'grey' });
    material.flatShading = false;
    const mesh = new THREE.Mesh(geo, material);
    mesh.scale.set(1, 1, 8);
    return mesh;
}

export function createComponents(scene: THREE.Scene, objects: THREE.Object3D[]) {

    const gamefield = new THREE.Object3D();
    scene.add(gamefield);
    objects.push(gamefield);

    const playerL: THREE.Mesh = createMeshBox();
    playerL.position.x = 19;
    gamefield.add(playerL);
    objects.push(playerL);

    const playerR: THREE.Mesh = createMeshBox();
    playerR.position.x = -19;
    gamefield.add(playerR);
    objects.push(playerR);

    const boundaryTop: THREE.Mesh = createMeshBox();
    boundaryTop.position.z = 12;
    boundaryTop.scale.set(40, 1, 1);
    gamefield.add(boundaryTop);
    objects.push(boundaryTop);

    const boundaryBottom: THREE.Mesh = createMeshBox();
    boundaryBottom.position.z = -12;
    boundaryBottom.scale.set(40, 1, 1);
    gamefield.add(boundaryBottom);
    objects.push(boundaryBottom);

    const ball: THREE.Mesh = createMeshSphere();
    gamefield.add(ball);
    objects.push(ball);

}

// ____________________ Grid and Axis _____________________
class AxisGridHelper {

    _visible: boolean;

    constructor(node: THREE.Object3D, units = 10) {
        const axes: THREE.AxesHelper = new THREE.AxesHelper();
        (<any>axes.material).depthTest = false;
        axes.renderOrder = 2;  // after the grid
        node.add(axes);

        const grid: THREE.GridHelper = new THREE.GridHelper(units, units);
        (<any>axes.material).depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        (<any>this).grid = grid;
        (<any>this).axes = axes;
        this.visible = true;

    }
    get visible(): boolean {
        return this._visible;
    }
    set visible(v: boolean) {
        this._visible = v;
        (<any>this).grid.visible = v;
        (<any>this).axes.visible = v;
    }
}

export function makeAxisGrid(gui: GUI, node: THREE.Object3D, label: string, units: number = 25): void {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}
