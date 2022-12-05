import React from 'react'
import { Stage, Sphere, useGLTF, OrbitControls, useAnimations, CameraShake, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { AspectRatio, Container, Image, Alert, Text, MantineProvider, Paper } from '@mantine/core';
import { VRMasset } from './VRMassets';


interface Props {
  isEnd: boolean
}

export function MainScene({isEnd}: Props) {
  
  const stage = useGLTF("./stage.glb");
  const screen = useGLTF("screen.glb");

  return (
    <>
      <directionalLight castShadow intensity={0.4} position={[-10, 50, 300]} shadow-mapSize={[512, 512]} shadow-bias={-0.02}/>
      <hemisphereLight intensity={0.7} color="whtie" position={[0, 1, 1]} />
      <mesh>
        <primitive
          object={stage.scene}
          position={[0, 0, 0.8]}
          rotation={[0, Math.PI/2, 0]}
          scale={[1, 1, 1]}
        />
        <primitive
          object={screen.scene}
          position={[-0.003, 0.71, 0.8]}
          rotation={[0, Math.PI/2, 0]}
          scale={[1.09, 1.08, 1.08]}
        />
      </mesh>
      <VRMasset isEnd={isEnd}/>
    </>
  )
}