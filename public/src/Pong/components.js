import * as THREE from 'three';
function createSphere() {
    // use just one sphere for everything
    var radius = 1;
    var widthSegments = 6;
    var heightSegments = 6;
    var sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    return sphereGeometry;
}
function createBox() {
    var width = 8;
    var height = 8;
    var depth = 8;
    return new THREE.BoxGeometry(width, height, depth);
}
function createMesh(geo) {
    var material = new THREE.MeshPhongMaterial({ color: 'white', emissive: 'grey' });
    material.flatShading = true;
    var mesh = new THREE.Mesh(geo, material);
    mesh.scale.set(.1, .5, 1);
    return mesh;
}
export function createComponents(scene, objects) {
    var gameField = new THREE.Object3D();
    scene.add(gameField);
    objects.push(gameField);
    var boxMeshL = createMesh(createBox());
    boxMeshL.position.x = 11;
    gameField.add(boxMeshL);
    objects.push(boxMeshL);
    var boxMeshR = createMesh(createBox());
    boxMeshR.position.x = -11;
    gameField.add(boxMeshR);
    objects.push(boxMeshR);
    var boxMeshTop = createMesh(createBox());
    boxMeshTop.position.z = 12;
    boxMeshTop.scale.set(3.15, .5, .1);
    gameField.add(boxMeshTop);
    objects.push(boxMeshTop);
    var boxMeshBottom = createMesh(createBox());
    boxMeshBottom.position.z = -12;
    boxMeshBottom.scale.set(3.15, .5, .1);
    gameField.add(boxMeshBottom);
    objects.push(boxMeshBottom);
    var sphereMesh = createMesh(createSphere());
    sphereMesh.scale.set(1, 1, 1);
    gameField.add(sphereMesh);
    objects.push(sphereMesh);
}
// ____________________ Grid and Axis _____________________
var AxisGridHelper = /** @class */ (function () {
    function AxisGridHelper(node, units) {
        if (units === void 0) { units = 10; }
        var axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2; // after the grid
        node.add(axes);
        var grid = new THREE.GridHelper(units, units);
        axes.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);
        this.grid = grid;
        this.axes = axes;
        this.visible = true;
    }
    Object.defineProperty(AxisGridHelper.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (v) {
            this._visible = v;
            this.grid.visible = v;
            this.axes.visible = v;
        },
        enumerable: false,
        configurable: true
    });
    return AxisGridHelper;
}());
export function makeAxisGrid(gui, node, label, units) {
    if (units === void 0) { units = 25; }
    var helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}
//# sourceMappingURL=components.js.map