import logo from './logo.svg';
import './App.css';

import { useState, useRef, useMemo } from 'react';
import { Canvas, useLoader, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, useBounds, BakeShadows } from '@react-three/drei';

import * as THREE from 'three'

// Models
import LogoJS from './components/logo_js';
import LogoGithub from './components/logo_github';

import Tower from './components/Tower'

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


export default function App() {

  const [setFocus] = useState("0");

  return (
    <div className='full_vh'>

      <Canvas shadows flat dpr={[1, 2]}>

        <group position={[0, 0.0, 0]}>

          <Ocean />
        </group>
        <OrbitControls autoRotate={false} enableZoom={true} makeDefault minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} />

        <color attach="background" args={['black']} onClick={() => setFocus(4)} />
        <group position={[0, 0, 0]}>

          <Tower />

          <BakeShadows />

          <LogoGithub position={[-5, 0, 1]} scale={10} />
          <LogoJS position={[-2, 5, 7]} />

        </group>
      </Canvas>
    </div>

  );
}
