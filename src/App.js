import logo from './logo.svg';
import './App.css';

import { useState, useRef, useMemo } from 'react';
import { Canvas, useLoader, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, useBounds, BakeShadows, Sparkles, Stars, Cloud, Clouds, Bounds } from '@react-three/drei';

import * as THREE from 'three'

// Models
import LogoJS from './components/logo_js';
import LogoGithub from './components/logo_github';

import Tower from './components/Tower'
import Gamer from './components/Gamer'

import { Water } from 'three-stdlib'

extend({ Water })


function Ocean() {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, '/textures/water_normal.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 2,
      fog: false,
      format: gl.encoding
    }),
    [waterNormals]
  )
  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta / 4))
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />
}

function generateClouds(numberOfClouds) {
  const clouds = [];
  for (let i = 0; i < numberOfClouds; i++) {
    // Generate positions with exclusion of -10 to 10 range
    const x = generateCloudPosition();
    const y = generateCloudPosition();
    const z = generateCloudPosition();

    // Generate random RGB color
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

    clouds.push(
      <Cloud
        key={i}
        seed={Math.random()}
        scale={Math.random() * 5}
        volume={5}
        color={color}
        fade={200}
        position={[x, y, z]}
      />
    );
  }
  return clouds;
}


// Helper function to generate a random position
function generateCloudPosition() {
  let pos = (Math.random() * 150) - 75; // Range -500 to 500
  const null_sphere = 5
  if (pos > -null_sphere && pos < null_sphere) {
    return pos < 0 ? pos - null_sphere : pos + null_sphere; // Adjust to exclude -10 to 10 range
  }
  return pos;
}

export default function App() {

  const [setFocus] = useState("0");

  const interpolateFunc = (t = 5) => -t * t * t + t * t + t          // Start linearly, finish smoothly

  return (
    <div className='full_vh'>

      <Canvas shadows flat dpr={[1, 2]} camera={{ position: [0, 100, -1000] }}>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={100} speed={1} opacity={1} color={100} scale={500} />

        {/* TODO: Make a cloud generator and prevent making them in the middle of the thing */}
        <Clouds material={THREE.MeshBasicMaterial} scale={3}>
          {/* <Cloud segments={40} bounds={[10, 2, 2]} volume={10} color="orange" /> */}
          {generateClouds(50)}
          {/* <Cloud seed={1} scale={2} volume={5} color="hotpink" fade={100} position={[50, 50, 50]} />
          <Cloud seed={2} scale={2} volume={5} color="hotpink" fade={100} position={[-50, 50, 50]} />
          <Cloud seed={2} scale={2} volume={5} color="hotpink" fade={100} position={[50, -50, 50]} />
          <Cloud seed={2} scale={2} volume={5} color="hotpink" fade={100} position={[50, 50, -50]} />
          <Cloud seed={2} scale={2} volume={5} color="hotpink" fade={100} position={[50, 50, -50]} /> */}
        </Clouds>

        <group position={[0, 0.0, 0]}>

          {/* <Ocean /> */}
        </group>
        <OrbitControls autoRotate={false} enableZoom={true} makeDefault minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} />

        <color attach="background" args={['black']} onClick={() => setFocus(4)} />
        <Bounds fit clip observe margin={1.2} maxDuration={3} interpolateFunc={interpolateFunc}>
          <group position={[0, 0, 0]}>

            {/* <Tower /> */}
            <Gamer />
            <pointLight position={[5, 10, 5]} intensity={5} />


            <BakeShadows />

            {/* <LogoGithub position={[-5, 0, 1]} scale={10} /> */}
            {/* <LogoJS position={[-2, 5, 7]} /> */}

          </group>
        </Bounds>

      </Canvas>
    </div>

  );
}
