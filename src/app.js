import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

import { addGUI } from "./gui";
import { changeColor, changePosition } from "./utils";
import "./global.css";

document.querySelector("body").style.cssText = `
  margin:0;
  padding:0;
`;

export default function init() {
  const canvas = document.querySelector(".scene");
  const size = { width: window.innerWidth, height: window.innerHeight };
  const gui = new dat.GUI({ width: 300, closed: true });

  const params = {
    rotate: false,
    size: 0.05,
    numberOfPoints: 33000,
    edgeMult: 1,
    centerColor: "#fc8c03",
    edgeColor: "#000000",
  };

  const fs = {
    createHeatBox,
    changeColor: () => changeColor(points, params, true),
  }

  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
  });

  const scene = new THREE.Scene();
  window.scene = scene;

  //////////////
  //  Camera  //
  //////////////

  const fov = 45;
  const aspectRatio = size.width / size.height;
  const camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.01, 100);
  camera.position.set(-3, 3, 3);
  scene.add(camera);

  ////////////////
  //  Controls  //
  ////////////////

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  //////////////
  //  Meshes  //
  //////////////

  let pointsGeometry;
  let pointsMaterial;
  let points;

  function createHeatBox() {
    if (points) {
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      scene.remove(points);
    }

    const centerColor = new THREE.Color(params.centerColor);
    const edgeColor = new THREE.Color(params.edgeColor);

    const numberOfPoints = params.numberOfPoints;
    const vertices = changePosition(params);
    const colors = changeColor(vertices, params);

    pointsGeometry = new THREE.BufferGeometry();

    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    pointsMaterial = new THREE.PointsMaterial({
      size: params.size,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
  }
  createHeatBox();

  ////////////////
  //  Renderer  //
  ////////////////

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(size.width, size.height);

  ///////////
  //  GUI  //
  ///////////

  addGUI(gui, fs, params);

  let lastTime = performance.now();
  let currRotation = 0;
  const tick = (currTime) => {
    const delta = currTime - lastTime;
    if (delta >= 16) {
      if (params.rotate) {
        currRotation += 0.001;
        if (points) {
          points.rotation.y = currRotation;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      lastTime = currTime;
    }

    requestAnimationFrame(tick);
  };
  tick();
}
