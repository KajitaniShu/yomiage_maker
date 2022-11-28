import React, { useState, useEffect, useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { Stage, Sphere, useGLTF, OrbitControls, useAnimations, CameraShake, Html } from '@react-three/drei'

import { VRM, VRMUtils, VRMSchema, VRMHumanoidImporter, VRMHumanoid } from '@pixiv/three-vrm'
import { Scene, Group } from 'three'

interface Props {
  url: string
}

export function VRMasset({ url }: Props) {

  const [inuinu, setInuinu] = useState<VRM>();
  const lip = useRef<number>(0.0);
  const animVec = useRef<number>(1);
  var leftShoulder: VRMHumanoid;
  var rightShoulder: VRMHumanoid;
  
  // VRMの読み込み
  const loader = new GLTFLoader()
  loader.load('./inuinu.vrm',
    (gltf) => {
      VRM.from(gltf).then( (vrm) => {
        setInuinu(vrm)
      })
    })
  
  

  // delta をかけることによって速度がデバイスの処理速度に依存しない
  useFrame((_, delta) => {
    if(inuinu){
      // @ts-ignore
      if(!leftShoulder) leftShoulder = inuinu.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.LeftShoulder);
      // @ts-ignore
      if(!rightShoulder) rightShoulder = inuinu.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.RightShoulder);
      
      // @ts-ignore
      leftShoulder.rotation.z = Math.PI/5;
      // @ts-ignore
      rightShoulder.rotation.z = -Math.PI/5;
  

      inuinu.blendShapeProxy?.setValue(VRMSchema.BlendShapePresetName.Fun, 0.0);
      inuinu.blendShapeProxy?.setValue(VRMSchema.BlendShapePresetName.O, lip.current);
      inuinu.blendShapeProxy?.update()
      
      // 口パク
      if(Math.abs(lip.current + animVec.current * delta * 8) > 0.8) animVec.current = -1 * animVec.current;
      lip.current += animVec.current * delta * 8;
    }
    
  });

  return (
    <>
    {inuinu ? (
      <primitive object={inuinu.scene} position={[0.53, -0.02, 1.2]}
      rotation={[0, Math.PI, 0]}
      scale={[1, 1, 1]}  />
    ) : ""}
    </>
  )
}