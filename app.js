import * as THREE from "three";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
let OrbitControl = require("three-orbit-controls")(THREE);
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as dat from "dat.gui";

import gsap from "gsap";

// import t from "./images/video-02-first.jpeg";
import t from "./images/video-02-end.jpeg";
import t1 from "./images/video-02-first.jpeg";
// import t2 from "./images/video-02-end.jpeg";
import { TimelineMax } from "gsap";
// init

let time = 0;
let move = 0;

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1500
);

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(400 * 2.1, 820 * 1.75, 480, 820);
const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  color: 0x000000,
  wireframe: true,
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    progress: {type:'f', value: 0},
    time: { type: "f", value: 0 },
    t: { type: "t", value: new THREE.TextureLoader().load(t) },
    t1: { type: "t", value: new THREE.TextureLoader().load(t1) },
    distortion: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
    uvRate1: {
      value: new THREE.Vector2(1, 1),
    },
  },
});
const cube = new THREE.Points(geometry, material);

scene.add(cube);

// const light = new THREE.PointLight(0xff0000, 1, 100);
// light.position.set(50, 50, 50);
// scene.add(light);
camera.position.z = 1500;

// const ambient_light = new THREE.AmbientLight(0xff1); // soft white light
// scene.add(ambient_light);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setAnimationLoop(animation);

renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0x000000, 1);
document.getElementById("container").appendChild(renderer.domElement);
let controls = new OrbitControl(camera, renderer.domElement);

let gui;
let setting = {
  distortion: 0,
  bloomThreshold: 0,
  bloomStrength: 0,
  bloomRadius: 0,
};

function settings() {
  gui = new dat.GUI();
  gui.add(setting, "distortion", 0, 3, 0.01);
  gui.add(setting, "bloomThreshold", 0, 10, 0.01);
  gui.add(setting, "bloomStrength", 0, 1, 0.01);
  gui.add(setting, "bloomRadius", 0, 1, 0.01);
}
settings();

let video = document.getElementById("video1");
video.addEventListener("ended", () => {
  gsap.to(video, {
    duration: 0.1,
    opacity: 0,
  });
  gsap.to(bloomPass, {
    duration: 2,
    strength: 3,
    ease: "power2.in"
  });

  gsap.to(material.uniforms.distortion, {
    duration: 2,
    value: 3,
    ease: "power2.inOut"
  });

  gsap.to(material.uniforms.progress, {
    duration: 1,
    value: 1,
    delay: 1.5
  });

  gsap.to(bloomPass, {
    duration: 2,
    strength: 0,
    delay:2,
    ease: "power2.out"
  });

  gsap.to(material.uniforms.distortion, {
    duration: 2,
    value: 0,
    ease: "power2.inOut",
    delay: 2,
    onComplete :()=>{
      video.currentTime = 0;
      video.play();
      gsap.to(video, {
        duration: 0.1,
        opacity: 1,
      });
    }

  });
});

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = setting.bloomThreshold;
bloomPass.strength = setting.bloomStrength;
bloomPass.radius = setting.bloomRadius;
let composer, mixer, clock;

composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

renderer.setSize(window.innerWidth, window.innerHeight);
composer.setSize(window.innerWidth, window.innerHeight);
// animation

function animation() {
  console.log("Distortion ", setting.distortion);
  time += 0.05;
  material.uniforms.time.value = time;
  // material.uniforms.distortion.value = setting.distortion;
  // bloomPass.strength = setting.bloomStrength;
  bloomPass.threshold = setting.bloomThreshold;
  bloomPass.radius = setting.bloomRadius;
  // renderer.render(scene, camera);
  composer.render();
}
