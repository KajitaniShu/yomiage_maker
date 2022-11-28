import React from 'react'
import { Stage, Sphere, useGLTF, OrbitControls, useAnimations, CameraShake, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { AspectRatio, Container, Image, Alert, Text, MantineProvider, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { VRMasset } from './VRMassets';
import { IconBone  } from '@tabler/icons'; 


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
            zoom: 4,
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
            <VRMasset url='./inuinu.vrm' />

            <Html zIndexRange={[2, 1]} position={[-0.543, 0.755, 0.75]} transform occlude distanceFactor={1.4} center >
              <AspectRatio ratio={16 / 9} w={370} >
                <Image  src={'./test.png'} radius="md" withPlaceholder  />
              </AspectRatio>
            </Html>
            <Html zIndexRange={[2, 1]} position={[0.708, 0.738, 0.75]} scale={[0.23, 0.23, 0.23]} transform occlude distanceFactor={1.4} center >
              <AspectRatio ratio={16 / 10} w={500} >
                <Image src={'./ad.png'} radius="lg" withPlaceholder  />
              </AspectRatio>
            </Html>

            <Html zIndexRange={[2, 1]} position={[-0.55, 0.15, 1]} scale={[1, 1, 1]} transform  distanceFactor={1.2} center >
              <Paper w={"450px"} bg="dark" radius="md" p="xs">

              <Text color="gray.1" >皆さんはテキストと画像を設定するだけで3Dキャラクターがプレゼンしてくれたら楽だと思いませんか？？</Text>
            </Paper>
            </Html>
          </Stage>
        </Canvas>
        </AspectRatio>
    </Container>
      </React.Suspense>
  )
}
