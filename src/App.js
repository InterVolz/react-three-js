import logo from './logo.svg';
import './App.css';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree, extend } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { OrbitControls, useBounds, BakeShadows, Sparkles, Stars, Cloud, Clouds, Bounds, Environment } from '@react-three/drei';

import * as THREE from 'three'

// Models
import LogoJS from './components/logo_js';
import LogoGithub from './components/logo_github';

import Tower from './components/Tower'
import Gamer from './components/Gamer2'

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


function EnvironmentSetup() {
  const { scene } = useThree();
  const texture = useLoader(RGBELoader, '/textures/nebula.hdr');

  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = texture; // Set as visible background
      console.log("Environment texture set");
    }
  }, [texture, scene]);

  return null;
}

export default function App() {
  const [setFocus] = useState("0");

  const interpolateFunc = (t = 5) => -t * t * t + t * t + t          // Start linearly, finish smoothly

  return (
    <div className='full_vh'>

      <Canvas shadows flat dpr={[1, 2]} camera={{ position: [0, 100, -500] }}>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={1000} speed={1} opacity={1} color={100} scale={100} />

        <EnvironmentSetup />

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
            <pointLight position={[-5, 10, 5]} intensity={5} />
            <pointLight position={[0, .8, 1]} intensity={5} />

            <pointLight position={[-2.8, .8, 6]} intensity={5} />
            <pointLight position={[2.8, .8, 6]} intensity={5} />

            <pointLight position={[-5, .8, 5.2]} intensity={5} />
            <pointLight position={[5, .8, 5.2]} intensity={5} />

            <pointLight position={[-5, .8, 3.5]} intensity={5} />
            <pointLight position={[5, .8, 3.5]} intensity={5} />

            <pointLight position={[-5, .8, 2]} intensity={5} />
            <pointLight position={[5, .8, 2]} intensity={5} />


            <BakeShadows />

            {/* <LogoGithub position={[-5, 0, 1]} scale={10} /> */}
            {/* <LogoJS position={[-2, 5, 7]} /> */}

          </group>
        </Bounds>

      </Canvas>
    </div>

  );
}
