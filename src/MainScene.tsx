import React from 'react'
import { Stage, Sphere, useGLTF, OrbitControls, useAnimations, CameraShake, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { AspectRatio, Container, Image, Alert, Text, MantineProvider, Paper } from '@mantine/core';
import { VRMasset } from './VRMassets';


export function MainScene(isEnd: any) {
  
  const stage = useGLTF("./stage.glb");
  const screen = useGLTF("./screen.glb");

  return (
    <>
      <mesh>
        <primitive
          object={stage.scene}
          position={[0, 0, 0.8]}
          rotation={[0, Math.PI/2, 0]}
          scale={[1, 1, 1]}
        />
        <primitive
          object={screen.scene}
          position={[0, 0, 0.8]}
          rotation={[0, Math.PI/2, 0]}
          scale={[1, 1, 1]}
        />
      </mesh>
      <VRMasset isEnd={isEnd}/>
    </>
  )
}