import React, { useState, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { Stage, Sphere, useGLTF, OrbitControls, useAnimations, CameraShake, Html } from '@react-three/drei'

import { VRM, VRMUtils, VRMSchema } from '@pixiv/three-vrm'
import { Scene, Group } from 'three'

interface Props {
  url: string
}

export function VRMasset({ url }: Props) {

  const [inuinu, setInuinu] = useState<VRM>()
  // VRMの読み込み
  const loader = new GLTFLoader()
  loader.load('./inuinu.vrm',
    (gltf) => {
      VRM.from(gltf).then( (vrm) => {
        // シーンへの追加
        setInuinu(vrm)
      })
    }
  )

  

  // delta をかけることによって速度がデバイスの処理速度に依存しない
  useFrame((_, delta) => {
    if(inuinu){
      inuinu.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Fun, 1.0)
      inuinu.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.O, 1.0)
      inuinu.blendShapeProxy.update()
    }
    
  });

  return (
    <>
    {inuinu ? (
      <primitive object={inuinu.scene} position={[0.5, -0.02, 1]}
      rotation={[0, Math.PI, 0]}
      scale={[1, 1, 1]}  />
    ) : ""}
    </>
  )
}