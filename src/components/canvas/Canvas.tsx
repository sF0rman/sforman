import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeshStandardMaterial, SphereGeometry } from "three";
import useTheme, { Theme } from "../../hooks/useTheme";
import "./Canvas.scss";

const Canvas = () => {
  const theme = useTheme();
  const threeDCanvas = useRef<HTMLCanvasElement>(null);

  const [alphaValue, setAlphaValue] = useState<number | string>("null");
  const [betaValue, setBetaValue] = useState<number | string>("null");
  const [gammeValue, setGammeValue] = useState<number | string>("null");

  useEffect(() => {
    document.addEventListener("mousemove", moveCamera, true);
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", moveCameraGyro);
    }

    return () => {
      document.removeEventListener("mousemove", moveCamera);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", moveCameraGyro);
      }
    };
  }, []);

  useLayoutEffect(() => {
    setUpScene();
  }, []);

  const cameraStartPoint = {
    x: -1.5,
    y: 0,
    z: 3.5,
  };
  const starCount = 5000;
  const starPositionLimit = {
    x: 20,
    y: 20,
    z: 20,
  };
  const dayLight = { x: -1, y: 1, z: 1 };
  const nightLight = { x: 7, y: 4, z: -1 };
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let sunLight: THREE.DirectionalLight;
  let starGeometry: THREE.BufferGeometry;
  let stars: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  let starPositions: Float32Array;
  let starMovement: Float32Array;
  let globe: THREE.Mesh<SphereGeometry, MeshStandardMaterial>;
  let renderer: THREE.WebGLRenderer;
  let currentTheme: Theme;

  const windowSize = {
    x: window.innerWidth,
    y: window.innerHeight,
    halfSize: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
  };

  const setUpScene = () => {
    // Create Scene
    scene = new THREE.Scene();
    // Create Camera
    camera = new THREE.PerspectiveCamera(60, windowSize.x / windowSize.y, 0.2);
    camera.position.x = cameraStartPoint.x;
    camera.position.y = cameraStartPoint.y;
    camera.position.z = cameraStartPoint.z;
    scene.add(camera);

    // Globe
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x007eff });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    if (theme.value === "dark") {
      // Stars
      starGeometry = new THREE.BufferGeometry();

      starMovement = new Float32Array(starCount * 3);
      starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * starPositionLimit.x;
        starPositions[i + 1] = (Math.random() - 0.5) * starPositionLimit.y;
        starPositions[i + 2] = (Math.random() - 0.5) * starPositionLimit.z;

        starMovement[i] = (Math.random() - 0.5) * 0.0001;
        starMovement[i + 1] = (Math.random() - 0.5) * 0.0001;
        starMovement[i + 2] = (Math.random() - 0.5) * 0.0001;
      }
      starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({
        size: 0.015,
        sizeAttenuation: true,
        color: "#ffffff",
        opacity: 0.2,
      });
      stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    }

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight("#ffffff", 2);
    theme.value === "light"
      ? sunLight.position.set(dayLight.x, dayLight.y, dayLight.z)
      : sunLight.position.set(nightLight.x, nightLight.y, nightLight.z);
    scene.add(sunLight);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: threeDCanvas.current as HTMLCanvasElement,
    });
    renderer.setSize(windowSize.x, windowSize.y);
    renderer.render(scene, camera);

    animate();
  };

  const moveCamera = (ev: MouseEvent): any => {
    const cameraMovement = {
      x: (ev.clientX / windowSize.x - 0.5) * 0.15,
      y: (ev.clientY / windowSize.y - 0.5) * 0.15,
    };

    camera.position.x = cameraStartPoint.x + cameraMovement.x;
    camera.position.y = cameraStartPoint.y + cameraMovement.y;
  };

  function moveCameraGyro(ev: DeviceOrientationEvent) {
    const cameraMovement = {
      x: ev.gamma ? ev.gamma * 0.01 : 0,
      y: ev.beta ? ev.beta * 0.01 : 0,
    };

    camera.position.x = cameraStartPoint.x + cameraMovement.x;
    camera.position.y = cameraStartPoint.y + cameraMovement.y;
  }

  const animate = () => {
    if (theme.value === "dark") {
      sunLight.position.set(nightLight.x, nightLight.y, nightLight.z);
      for (let i = 0; i < starCount; i += 3) {
        starPositions[i] += starMovement[i];
        starPositions[i + 1] += starMovement[i + 1];
        starPositions[i + 2] += starMovement[i + 2];
        if (starPositions[i] > 10 || starPositions[i] < -10) starPositions[i] = starPositions[i] * -1;
        if (starPositions[i + 1] > 10 || starPositions[i + 1] < -10) starPositions[i + 1] = starPositions[i + 1] * -1;
        if (starPositions[i + 2] > 10 || starPositions[i + 1] < -10) starPositions[i + 2] = starPositions[i + 2] * -1;
      }
      starGeometry?.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    } else {
      sunLight.position.set(dayLight.x, dayLight.y, dayLight.z);
    }

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };
  return (
    <>
      <canvas className="canvas-3d" ref={threeDCanvas}></canvas>
    </>
  );
};

export default Canvas;
