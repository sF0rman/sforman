import { ReactElement, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useTheme, { Theme } from "../../hooks/useTheme";
import GlobeModel from "../../resources/models/globe.glb";
import StarAlphamap from "../../resources/models/particle_mask.png";
import "./Canvas.scss";

const Canvas = (): ReactElement => {
  const theme = useTheme();
  const threeDCanvas = useRef<HTMLCanvasElement>(null);

  let isMobile = window.innerWidth < 768;
  useEffect(() => {
    window.addEventListener("resize", detectDeviceChange, true);
    document.addEventListener("mousemove", moveCamera, true);
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", moveCameraGyro);
    }

    return () => {
      document.removeEventListener("mousemove", moveCamera);
      window.removeEventListener("resize", detectDeviceChange);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", moveCameraGyro);
      }
    };
  }, []);

  useLayoutEffect(() => {
    setUpScene();
  }, []);

  
  const cameraStartPoint = {
    x: isMobile ? 0 : -2,
    y: isMobile ? 1 : 0,
    z: 5.5,
  };
  const starCount = 10000;
  const starPositionLimit = {
    x: 20,
    y: 20,
    z: 5,
  };
  const dayLight = { x: -1, y: 1, z: 1 };
  const nightLight = { x: -1.5, y: 1, z: -4 };
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let sunLight: THREE.DirectionalLight;
  let starGeometry: THREE.BufferGeometry;
  let stars: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  let starPositions: Float32Array;
  let starMovement: Float32Array;
  let renderer: THREE.WebGLRenderer;
  let globe: THREE.Group;

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

    const textureLoader = new THREE.TextureLoader();

    // Create Camera
    camera = new THREE.PerspectiveCamera(50, windowSize.x / windowSize.y, 0.2);
    camera.position.x = cameraStartPoint.x;
    camera.position.y = cameraStartPoint.y;
    camera.position.z = cameraStartPoint.z;
    scene.add(camera);

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      GlobeModel,
      gltf => {
        globe = gltf.scene;
        scene.add(gltf.scene);
      },
      undefined,
      err => {
        console.log(err);
      }
    );

    if (theme.value === "dark") {
      // Stars
      const starAlpha = textureLoader.load(StarAlphamap);
      starGeometry = new THREE.BufferGeometry();
      starMovement = new Float32Array(starCount * 3);
      starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * starPositionLimit.x;
        starPositions[i + 1] = (Math.random() - 0.5) * starPositionLimit.y;
        starPositions[i + 2] = (Math.random() - 0.5) * starPositionLimit.z - 3;

        starMovement[i] = (Math.random() - 0.5) * 0.0001;
        starMovement[i + 1] = (Math.random() - 0.5) * 0.0001;
        starMovement[i + 2] = (Math.random() - 0.5) * 0.0001;
      }
      starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({
        size: 0.07,
        sizeAttenuation: true,
        color: "#ffffff",
        opacity: 0.4,
        map: starAlpha,
      });
      stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    }

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight("#ffffff", 4);
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

  const moveCamera = (ev: MouseEvent): void => {
    const cameraMovement = {
      x: (ev.clientX / windowSize.x - 0.5) * 0.15,
      y: (ev.clientY / windowSize.y - 0.5) * 0.15,
    };

    camera.position.x = cameraStartPoint.x + cameraMovement.x;
    camera.position.y = cameraStartPoint.y + cameraMovement.y;
  };

  const moveCameraGyro = (ev: DeviceOrientationEvent): void => {
    const cameraMovement = {
      x: ev.gamma ? ev.gamma * 0.01 : 0,
      y: ev.beta ? ev.beta * 0.01 : 0,
    };

    camera.position.x = cameraStartPoint.x + cameraMovement.x;
    camera.position.y = cameraStartPoint.y + cameraMovement.y;
  };

  const detectDeviceChange = (event: any): void => {
    console.log(event);
    if(isMobile && event.target.innerWidth > 768) {
      isMobile = false;
      camera.position.x = -2;
      camera.position.y = 0;
      cameraStartPoint.x = -2;
      cameraStartPoint.y = 0;
    } else if (!isMobile && event.target.innerWidth <= 768) {
      isMobile = true;
      camera.position.x = 0;
      camera.position.y = 1;
      cameraStartPoint.x = 0;
      cameraStartPoint.y = 1;
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

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
      sunLight.intensity = 2;
      sunLight.position.set(dayLight.x, dayLight.y, dayLight.z);
    }
    if (globe) {
      globe.rotation.y -= 0.0001;
    }
    if (isMobile && window.innerHeight < 768) {
      isMobile = !isMobile;
      console.log("test1");
      camera.position.x = -2;
    } else if (!isMobile && window.innerHeight <= 768) {
      isMobile = !isMobile;
      console.log("test2");
      camera.position.x = 0;
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    // Loop animations
    window.requestAnimationFrame(animate);
  };

  return (
    <>
      <canvas className="canvas-3d" ref={threeDCanvas}></canvas>
    </>
  );
};

export default Canvas;
