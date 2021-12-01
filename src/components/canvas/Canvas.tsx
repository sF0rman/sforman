import { useEffect, useRef } from "react";
import * as THREE from "three";
import useTheme from "../../hooks/useTheme";
import "./Canvas.scss";

const Canvas = () => {
  const theme = useTheme();
  const threeDCanvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    setUpScene();
  }, [theme]);

  const setUpScene = () => {
    // Create Scene
    const scene = new THREE.Scene();
    // Create Camera
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1);
    camera.position.z = 2.5;
    camera.position.x = -1.5;
    scene.add(camera);

    // Globe
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x007eff });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Stars
    /* 
    const starCount = 500;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i > starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 1;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.5, sizeAttenuation: true, color: "#ffffff" });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    */

    const ambientLight = new THREE.AmbientLight("0xffffff", 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight("0xffffff", 2);
    theme.value === "light" ? directionalLight.position.set(-1, 1, 1) : directionalLight.position.set(7, 4, -1);
    scene.add(directionalLight);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: threeDCanvas.current as HTMLCanvasElement,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  const animate = () => {
    window.requestAnimationFrame(() => {});
  };
  return <canvas className="canvas-3d" ref={threeDCanvas}></canvas>;
};

export default Canvas;
