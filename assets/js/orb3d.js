import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';

const container = document.getElementById('orb-3d');

/* ===== BASIC SETUP ===== */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

camera.position.z = 4;

/* PERFORMANCE OPTIMIZED RENDERER */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 🔥 KEY
renderer.setSize(container.clientWidth, container.clientHeight);

container.appendChild(renderer.domElement);

/* ===== ORB ===== */
const geometry = new THREE.SphereGeometry(1.2, 128, 128);

const material = new THREE.MeshPhysicalMaterial({
  color: 0xc8a96a,
  metalness: 0.95,
  roughness: 0.15,
  clearcoat: 1,
  clearcoatRoughness: 0.05
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

/* ===== LIGHTS ===== */
const light1 = new THREE.PointLight(0xffffff, 2);
light1.position.set(5, 5, 5);

const light2 = new THREE.PointLight(0xc8a96a, 3);
light2.position.set(-5, -3, 4);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);

scene.add(light1, light2, ambient);

/* ===== PARTICLES (DEPTH EFFECT) ===== */
const particlesCount = 1500;
const particlesGeometry = new THREE.BufferGeometry();

const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 12;
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xc8a96a,
  size: 0.02,
  transparent: true,
  opacity: 0.6
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/* ===== MOUSE PARALLAX ===== */
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

/* ===== ANIMATION LOOP ===== */
function animate(){
  requestAnimationFrame(animate);

  /* ORB */
  sphere.rotation.y += 0.002;

  sphere.rotation.x += mouseY * 0.03;
  sphere.rotation.y += mouseX * 0.03;

  /* PARTICLES */
  particles.rotation.y += 0.0005;

  /* CAMERA PARALLAX */
  camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

/* ===== RESPONSIVE ===== */
window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});
