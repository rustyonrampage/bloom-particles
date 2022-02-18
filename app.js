import * as THREE from "three";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
let OrbitControl = require("three-orbit-controls")(THREE);

import gsap from "gsap";

// init

let time = 0;
let move = 0;

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(1,1,10,10);
const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  color: 0x000000,
  wireframe: true,
  vertexShader: vertex,
  unfirms: {
    time: {type:'f', value: 0},
    resolution: {type:'v4', value: new THREE.Vector4()},
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    }
  }
});
const cube = new THREE.Points(geometry, material);

scene.add(cube);

// const light = new THREE.PointLight(0xff0000, 1, 100);
// light.position.set(50, 50, 50);
// scene.add(light);
camera.position.z = 5;

// const ambient_light = new THREE.AmbientLight(0xff1); // soft white light
// scene.add(ambient_light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animation);

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setClearColor(0xfffaaa)
document.getElementById("container").appendChild(renderer.domElement);
let controls = new OrbitControl(camera, renderer.domElement);

// animation

function animation() {
  time++;

  renderer.render(scene, camera);
}
