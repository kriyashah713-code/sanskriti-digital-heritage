import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PageId } from '../components/Header';
import {
  Box,
  RotateCcw,
  Sun,
  Eye,
  Sliders,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface ThreeDGalleryPageProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

type ModelExhibit = 'konark-wheel' | 'hampi-pillar' | 'stepwell-pavilion';
type LightingPreset = 'golden-hour' | 'archaeological-lab' | 'solstice-night';

export const ThreeDGalleryPage: React.FC<ThreeDGalleryPageProps> = ({ onNavigate }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeExhibit, setActiveExhibit] = useState<ModelExhibit>('konark-wheel');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [exploded, setExploded] = useState(0); // 0 to 1
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('golden-hour');
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  // References for mutable Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const explodedPartsRef = useRef<Array<{ mesh: THREE.Object3D; originalY: number; targetYOffset: number }>>([]);
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
    rimLight: THREE.PointLight;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a120e);
    scene.fog = new THREE.FogExp2(0x0a120e, 0.035);
    sceneRef.current = scene;

    // PMREM Room Environment for PBR metallic & stone specular reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera sinking under ground
    controls.minDistance = 2.5;
    controls.maxDistance = 16;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffeedd, 0x1a2b22, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffe2b8, 2.4);
    dirLight.position.set(6, 10, 5);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xd4af37, 1.5, 20);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    lightsRef.current = { dirLight, hemiLight, rimLight };

    // Ground Contact Shadow & Grid Plate
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x070d0a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Subtle Decorative Concentric Astrolabe Rings on Ground
    const ringGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc5a059,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
    scene.add(ring);

    // Build the initial 3D exhibit
    buildExhibit(activeExhibit, scene);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        if (autoRotate && currentModelGroupRef.current) {
          currentModelGroupRef.current.rotation.y += 0.004;
        }
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  // Update exhibit model when activeExhibit changes
  useEffect(() => {
    if (sceneRef.current) {
      buildExhibit(activeExhibit, sceneRef.current);
    }
  }, [activeExhibit]);

  // Update wireframe state
  useEffect(() => {
    if (currentModelGroupRef.current) {
      currentModelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => (m.wireframe = wireframe));
          } else {
            child.material.wireframe = wireframe;
          }
        }
      });
    }
  }, [wireframe]);

  // Update exploded view separation
  useEffect(() => {
    explodedPartsRef.current.forEach((part) => {
      part.mesh.position.y = part.originalY + part.targetYOffset * exploded;
    });
  }, [exploded]);

  // Update lighting presets
  useEffect(() => {
    if (!lightsRef.current) return;
    const { dirLight, hemiLight, rimLight } = lightsRef.current;
    if (lightingPreset === 'golden-hour') {
      dirLight.color.setHex(0xffcb85);
      dirLight.intensity = 2.8;
      hemiLight.color.setHex(0xffeedd);
      hemiLight.groundColor.setHex(0x1a2b22);
      rimLight.color.setHex(0xd4af37);
      rimLight.intensity = 1.6;
    } else if (lightingPreset === 'archaeological-lab') {
      dirLight.color.setHex(0xffffff);
      dirLight.intensity = 2.0;
      hemiLight.color.setHex(0xeef5f0);
      hemiLight.groundColor.setHex(0x33443b);
      rimLight.color.setHex(0x90c0a0);
      rimLight.intensity = 1.0;
    } else if (lightingPreset === 'solstice-night') {
      dirLight.color.setHex(0x6080b0);
      dirLight.intensity = 1.2;
      hemiLight.color.setHex(0x20354b);
      hemiLight.groundColor.setHex(0x050d0a);
      rimLight.color.setHex(0xc5a059);
      rimLight.intensity = 2.4;
    }
  }, [lightingPreset]);

  // Procedural 3D model generator conforming to 3-12 part group standards
  function buildExhibit(exhibit: ModelExhibit, scene: THREE.Scene) {
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current = null;
    }
    explodedPartsRef.current = [];

    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    // Stone PBR materials with varied roughness/metalness
    const khondaliteMat = new THREE.MeshStandardMaterial({
      color: 0x9e7b57,
      roughness: 0.85,
      metalness: 0.08,
      wireframe,
    });
    const sandstoneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xc89f67,
      roughness: 0.72,
      metalness: 0.12,
      wireframe,
    });
    const carvedReliefMat = new THREE.MeshStandardMaterial({
      color: 0x826445,
      roughness: 0.9,
      metalness: 0.05,
      wireframe,
    });
    const graniteGreyMat = new THREE.MeshStandardMaterial({
      color: 0x6e7670,
      roughness: 0.75,
      metalness: 0.15,
      wireframe,
    });
    const antiqueGoldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85,
      wireframe,
    });

    if (exhibit === 'konark-wheel') {
      // EXHIBIT 1: KONARK SUN TEMPLE 24-SPOKE SUNDIAL CHARIOT WHEEL
      // 1. Heavy Stone Base Pedestal
      const baseGeo = new THREE.BoxGeometry(4.2, 0.4, 1.8);
      const baseMesh = new THREE.Mesh(baseGeo, khondaliteMat);
      baseMesh.position.y = 0.2;
      baseMesh.castShadow = true;
      group.add(baseMesh);

      // 2. Chariot Axle Support Frame
      const axleSupportGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.2, 16);
      const axleSupport = new THREE.Mesh(axleSupportGeo, carvedReliefMat);
      axleSupport.position.set(0, 1.8, -0.4);
      axleSupport.rotation.x = Math.PI / 2;
      group.add(axleSupport);

      // Wheel Assembly Group (elevated on Y = 1.8)
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0, 1.8, 0);

      // 3. Heavy Outer Carved Tire Rim
      const outerRimGeo = new THREE.TorusGeometry(1.6, 0.16, 20, 64);
      const outerRim = new THREE.Mesh(outerRimGeo, khondaliteMat);
      outerRim.castShadow = true;
      wheelGroup.add(outerRim);

      // 4. Concentric Beaded Inner Rim (Hour Markers)
      const innerRimGeo = new THREE.TorusGeometry(1.36, 0.07, 16, 48);
      const innerRim = new THREE.Mesh(innerRimGeo, sandstoneGoldMat);
      wheelGroup.add(innerRim);

      // 5. Central Wheel Hub
      const hubGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 32);
      const hub = new THREE.Mesh(hubGeo, sandstoneGoldMat);
      hub.rotation.x = Math.PI / 2;
      hub.castShadow = true;
      wheelGroup.add(hub);

      // 6. Central Sun Medallion (Axle Boss)
      const bossGeo = new THREE.SphereGeometry(0.25, 24, 24);
      const boss = new THREE.Mesh(bossGeo, antiqueGoldAccentMat);
      boss.position.z = 0.22;
      wheelGroup.add(boss);

      // 7. Eight Major Spokes with Carved Diamond Medallions
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const spokeGroup = new THREE.Group();
        spokeGroup.rotation.z = angle;

        const spokeGeo = new THREE.CylinderGeometry(0.065, 0.08, 1.2, 12);
        const spoke = new THREE.Mesh(spokeGeo, khondaliteMat);
        spoke.position.y = 0.72;
        spoke.castShadow = true;
        spokeGroup.add(spoke);

        // Medallion on each major spoke
        const medallionGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
        const medallion = new THREE.Mesh(medallionGeo, antiqueGoldAccentMat);
        medallion.position.set(0, 0.72, 0.08);
        medallion.rotation.x = Math.PI / 2;
        spokeGroup.add(medallion);

        wheelGroup.add(spokeGroup);
      }

      // 8. Eight Minor Spokes (Slender intermediate beads)
      for (let j = 0; j < 8; j++) {
        const angle = (j * Math.PI) / 4 + Math.PI / 8;
        const minorSpoke = new THREE.Group();
        minorSpoke.rotation.z = angle;

        const spokeGeo = new THREE.CylinderGeometry(0.035, 0.045, 1.15, 8);
        const spoke = new THREE.Mesh(spokeGeo, carvedReliefMat);
        spoke.position.y = 0.7;
        minorSpoke.add(spoke);

        wheelGroup.add(minorSpoke);
      }

      group.add(wheelGroup);

      // Track exploded view layer
      explodedPartsRef.current.push({ mesh: wheelGroup, originalY: 1.8, targetYOffset: 1.2 });
      explodedPartsRef.current.push({ mesh: baseMesh, originalY: 0.2, targetYOffset: -0.4 });
    } else if (exhibit === 'hampi-pillar') {
      // EXHIBIT 2: VIJAYANAGARA (HAMPI) MONOLITHIC MUSICAL PILLAR SHRINE
      // 1. Tiered Dravidian Upapitha (Plinth)
      const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 2.4), graniteGreyMat);
      plinth1.position.y = 0.125;
      plinth1.receiveShadow = true;
      group.add(plinth1);

      const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 2.0), graniteGreyMat);
      plinth2.position.y = 0.375;
      group.add(plinth2);

      // 2. Central Fluted Granite Pillar Shaft
      const mainShaft = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.6, 0.7), graniteGreyMat);
      mainShaft.position.y = 1.8;
      mainShaft.castShadow = true;
      group.add(mainShaft);

      // 3. Acoustic Resonant Colonnettes (The musical pillars)
      const colonnettesGroup = new THREE.Group();
      colonnettesGroup.position.set(0, 1.8, 0);

      const colPositions = [
        [0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6],
        [0.45, 0.45], [-0.45, 0.45], [0.45, -0.45], [-0.45, -0.45]
      ];
      colPositions.forEach(([x, z]) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 2.4, 12), sandstoneGoldMat);
        col.position.set(x, 0, z);
        col.castShadow = true;
        colonnettesGroup.add(col);
      });
      group.add(colonnettesGroup);

      // 4. Ornate Lotus Capital (Bodegai)
      const capitalGroup = new THREE.Group();
      capitalGroup.position.set(0, 3.2, 0);

      const capBlock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.6), graniteGreyMat);
      capitalGroup.add(capBlock);

      // 5. Yali / Lion Mythical Bracket Projection
      const yaliBracket = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 1.2), carvedReliefMat);
      yaliBracket.position.set(0, -0.15, 0.5);
      capitalGroup.add(yaliBracket);

      // 6. Cornice (Kapotha) with Temple finial
      const cornice = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.7, 4), graniteGreyMat);
      cornice.rotation.y = Math.PI / 4;
      cornice.position.y = 0.55;
      capitalGroup.add(cornice);

      const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 0.4, 16), antiqueGoldAccentMat);
      finial.position.y = 1.1;
      capitalGroup.add(finial);

      group.add(capitalGroup);

      // Exploded parts
      explodedPartsRef.current.push({ mesh: capitalGroup, originalY: 3.2, targetYOffset: 1.4 });
      explodedPartsRef.current.push({ mesh: colonnettesGroup, originalY: 1.8, targetYOffset: 0.6 });
    } else {
      // EXHIBIT 3: RANI KI VAV SUBTERRANEAN STEPPED PAVILION
      // 1. Descending Multi-Tier Terraces
      const terr1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 3.6), sandstoneGoldMat);
      terr1.position.y = 0.15;
      group.add(terr1);

      const terr2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 3.0), sandstoneGoldMat);
      terr2.position.y = 0.45;
      group.add(terr2);

      // 2. Subterranean Pavilion Pillars (4 Corners)
      const pavilionPillars = new THREE.Group();
      pavilionPillars.position.set(0, 1.4, 0);

      const pillarCoords = [
        [1.2, 1.0], [-1.2, 1.0], [1.2, -1.0], [-1.2, -1.0],
        [0.4, 1.0], [-0.4, 1.0], [0.4, -1.0], [-0.4, -1.0]
      ];
      pillarCoords.forEach(([x, z]) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.6, 12), khondaliteMat);
        pillar.position.set(x, 0, z);
        pillar.castShadow = true;
        pavilionPillars.add(pillar);
      });
      group.add(pavilionPillars);

      // 3. Upper Pavilion Architrave & Torana Roof
      const roofGroup = new THREE.Group();
      roofGroup.position.set(0, 2.3, 0);

      const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, 2.6), sandstoneGoldMat);
      roofGroup.add(roofSlab);

      const roofCupola = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.4, 16), carvedReliefMat);
      roofCupola.position.y = 0.3;
      roofGroup.add(roofCupola);

      const kalasha = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), antiqueGoldAccentMat);
      kalasha.position.y = 0.65;
      roofGroup.add(kalasha);

      group.add(roofGroup);

      // 4. Stepped Well Shaft Opening in Centre
      const shaftRim = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 16, 32), carvedReliefMat);
      shaftRim.rotation.x = Math.PI / 2;
      shaftRim.position.y = 0.62;
      group.add(shaftRim);

      // Exploded parts
      explodedPartsRef.current.push({ mesh: roofGroup, originalY: 2.3, targetYOffset: 1.5 });
      explodedPartsRef.current.push({ mesh: pavilionPillars, originalY: 1.4, targetYOffset: 0.7 });
    }

    scene.add(group);
    currentModelGroupRef.current = group;
  }

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 3.2, 7.5);
      controlsRef.current.target.set(0, 1.2, 0);
      controlsRef.current.update();
      if (currentModelGroupRef.current) {
        currentModelGroupRef.current.rotation.set(0, 0, 0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070d0a] text-[#f7f3eb] flex flex-col relative overflow-hidden">
      {/* Top Banner & Archaeological Disclaimer */}
      <div className="bg-[#0b140f] border-b border-[#c5a059]/15 px-6 py-4 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-sm text-[#f7f3eb] uppercase tracking-wider">
              Three.js Heritage Visualisation Studio
            </span>
            <span className="text-[#c5a059]">·</span>
            <span className="text-[#9eb0a5]">Interactive Lithic Kinematics</span>
          </div>

          {/* Mandatory Archaeological Transparency Notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#e0b76e] bg-[#1a251c] px-3 py-1 rounded-sm border border-[#c5a059]/30">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
            <span>
              <strong>Scholarly Note:</strong> Procedural architectural studies; not raw photogrammetric reconstructions.
            </span>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport Canvas Container */}
      <div data-lenis-prevent className="flex-1 relative w-full h-[650px] min-h-[550px] bg-[#070d0a] flex items-center justify-center">
        {/* Isolated Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Minimal Spec Overlay (Top Left) */}
        <div className="absolute top-5 left-6 z-10 bg-[#09110d]/85 backdrop-blur-md border border-[#c5a059]/25 p-3 rounded-sm text-xs space-y-1 pointer-events-none">
          <div className="text-[#c5a059] font-bold uppercase tracking-wider font-cinzel">
            {activeExhibit === 'konark-wheel'
              ? 'Konark Surya Sundial Wheel (1250 CE)'
              : activeExhibit === 'hampi-pillar'
              ? 'Vijayanagara Vittala Musical Pillar (1513 CE)'
              : 'Rani ki Vav Stepwell Pavilion (1063 CE)'}
          </div>
          <div className="text-[11px] text-[#9eb0a5]">
            Drag to Rotate · Scroll to Zoom · Shift + Drag to Pan
          </div>
        </div>

        {/* Collapsible Ergonomic Bottom Control Dock (Following Three.js Skill Directives) */}
        <div
          className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[920px] transition-all duration-300 ${
            isHudCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
          }`}
        >
          {/* Collapse / Expand Toggle Button */}
          <div className="flex justify-center -mb-px">
            <button
              onClick={() => setIsHudCollapsed(!isHudCollapsed)}
              className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#101b15] border border-b-0 border-[#c5a059]/30 rounded-t-sm text-[11px] uppercase tracking-wider text-[#c5a059] hover:text-[#f7f3eb] cursor-pointer"
            >
              {isHudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isHudCollapsed ? 'Show Studio Controls' : 'Hide Controls (Zen Mode)'}</span>
            </button>
          </div>

          {/* Unified Horizontal Control Strip */}
          <div className="bg-[#101b15]/95 backdrop-blur-lg border border-[#c5a059]/30 p-4 rounded-sm shadow-2xl space-y-3.5 text-xs">
            {/* Row 1: Exhibit Selection Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5a059]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#9eb0a5] font-semibold text-xs uppercase tracking-wider">
                  Exhibit:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveExhibit('konark-wheel')}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                      activeExhibit === 'konark-wheel'
                        ? 'bg-[#c5a059] text-[#09110d] font-bold'
                        : 'bg-[#15231c] text-[#c7d5cd] hover:text-[#f7f3eb]'
                    }`}
                  >
                    Konark Wheel
                  </button>
                  <button
                    onClick={() => setActiveExhibit('hampi-pillar')}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                      activeExhibit === 'hampi-pillar'
                        ? 'bg-[#c5a059] text-[#09110d] font-bold'
                        : 'bg-[#15231c] text-[#c7d5cd] hover:text-[#f7f3eb]'
                    }`}
                  >
                    Hampi Pillar
                  </button>
                  <button
                    onClick={() => setActiveExhibit('stepwell-pavilion')}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                      activeExhibit === 'stepwell-pavilion'
                        ? 'bg-[#c5a059] text-[#09110d] font-bold'
                        : 'bg-[#15231c] text-[#c7d5cd] hover:text-[#f7f3eb]'
                    }`}
                  >
                    Vav Pavilion
                  </button>
                </div>
              </div>

              {/* Reset Camera Button */}
              <button
                onClick={resetCamera}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#15231c] hover:bg-[#1e3227] text-[#c5cfc8] hover:text-white rounded-xs transition-colors cursor-pointer"
                title="Reset Camera Orientation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Reset View</span>
              </button>
            </div>

            {/* Row 2: Lighting, Exploded View, Wireframe & Rotation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Lighting Preset Selector */}
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span className="text-[#9eb0a5] shrink-0">Light:</span>
                <select
                  value={lightingPreset}
                  onChange={(e) => setLightingPreset(e.target.value as LightingPreset)}
                  className="bg-[#09110d] border border-[#c5a059]/25 text-[#f7f3eb] px-2 py-1 rounded-xs text-xs outline-none cursor-pointer w-full"
                >
                  <option value="golden-hour">Golden Hour (Solar Equinox)</option>
                  <option value="archaeological-lab">Archaeological Lab (Neutral White)</option>
                  <option value="solstice-night">Solstice Night (Deep Cyan/Gold)</option>
                </select>
              </div>

              {/* Exploded View Slider */}
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span className="text-[#9eb0a5] shrink-0">Exploded View:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={exploded}
                  onChange={(e) => setExploded(parseFloat(e.target.value))}
                  className="w-full accent-[#c5a059] cursor-pointer"
                />
              </div>

              {/* Viewport Toggles (Wireframe & Auto-rotate) */}
              <div className="flex items-center justify-end gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#c5cfc8]">
                  <input
                    type="checkbox"
                    checked={wireframe}
                    onChange={(e) => setWireframe(e.target.checked)}
                    className="accent-[#c5a059]"
                  />
                  <span>Wireframe Mesh</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#c5cfc8]">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="accent-[#c5a059]"
                  />
                  <span>Slow Orbit</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Exhibit Briefing Strip */}
      <div className="bg-[#09110d] border-t border-[#c5a059]/15 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#9eb0a5]">
          <div className="p-4 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-1.5">
            <h4 className="font-cinzel font-bold text-[#c5a059] text-sm">
              01. Structural Deconstruction
            </h4>
            <p className="leading-relaxed text-[#c7d5cd]">
              Slide the Exploded View slider to disengage the upper lintels, spires, and capitals from their weight-bearing lithic shafts, illustrating classical joinery.
            </p>
          </div>

          <div className="p-4 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-1.5">
            <h4 className="font-cinzel font-bold text-[#c5a059] text-sm">
              02. Archaeo-Astronomy Rig
            </h4>
            <p className="leading-relaxed text-[#c7d5cd]">
              Switch lighting presets to study shadow casting across the Konark wheel spokes and how solar azimuth changes illuminated the sanctuary.
            </p>
          </div>

          <div className="p-4 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-1.5">
            <h4 className="font-cinzel font-bold text-[#c5a059] text-sm">
              03. Monograph Correlation
            </h4>
            <p className="leading-relaxed text-[#c7d5cd]">
              Each 3D study correlates with verified historical field notes in the Sanskriti Digital Archive and high-resolution documentary captures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
