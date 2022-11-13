import React from 'react'
import { Stage, Sphere, useGLTF, OrbitControls, useAnimations, CameraShake, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { AspectRatio, Container, Image } from '@mantine/core';

export function Preview(database: any) {
  const stage = useGLTF("./stage.glb");
  const player = useGLTF("./knight.glb");
  const playerScene = player.scene;
  const playerAnimation = player.animations;


  return (
    
      <React.Suspense fallback={null}>
        <Container>
        <AspectRatio ratio={16 / 9} >
        <Canvas
          camera={{
            position: [0,0,0],
            zoom: 3,
            fov: 50,
          }}
          style={{
            borderRadius:"10px",
            border: "1px solid #E9ECEF",
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor:'gray.100'
          }}
        >
            <Stage>
            <mesh>
              <primitive
                object={stage.scene}
                position={[0, 0, 0.8]}
                rotation={[0, Math.PI/2, 0]}
                scale={[1, 1, 1]}
              />
              
            </mesh>
            <mesh>
            <primitive
                object={player.scene}
                position={[0.44, -0,1, 0]}
                rotation={[0, 0, 0]}
                scale={[0.3, 0.3, 0.3]}
              />
            </mesh>

            <Html zIndexRange={[2, 1]} position={[-0.324, 0.83, 0.75]}  transform occlude distanceFactor={1.4} center >
              <AspectRatio ratio={16 / 9} w={330} >
                <Image src={'https://images.unsplash.com/phot552245715-77d79bbf6fe2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80'} radius="md" withPlaceholder  />
              </AspectRatio>
            </Html>
            <Html zIndexRange={[2, 1]} position={[0.654, 0.878, 0.75]} scale={[0.23, 0.23, 0.23]} transform occlude distanceFactor={1.4} center >
              <AspectRatio ratio={16 / 10} w={500} >
                <Image src={'./ad.png'} radius="lg" withPlaceholder  />
              </AspectRatio>
            </Html>
          </Stage>
        </Canvas>
        </AspectRatio>
    </Container>
      </React.Suspense>
  )
}
