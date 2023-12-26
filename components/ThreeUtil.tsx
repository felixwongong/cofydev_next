import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    if (!renderer || !scene || !camera) return;
    renderer!.render(scene, camera);
}

export function createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);;
    camera.position.z = 5;
    return camera;
}

export function setPosition(objects: THREE.Object3D[], position: THREE.Vector3) {
    objects.forEach(obj => obj.position.set(position.x, position.y, position.z))
}

export function setRotation(objects: THREE.Object3D[], rotation: THREE.Vector3) {
    objects.forEach(obj => obj.rotation.set(rotation.x, rotation.y, rotation.z))
}
