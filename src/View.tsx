import React, {useEffect, useState, useRef, Suspense} from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { AspectRatio, Container, Card, Image, Paper, Text, Box, ActionIcon, Slider } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { MainScene } from './MainScene';
import { OrbitControls, ContactShadows, Environment, Html, useGLTF } from '@react-three/drei';
import './mainScene.css';
import { MeshBasicMaterial, Vector3, TextureLoader } from 'three';
import { IconReload, IconCircleDot } from '@tabler/icons';



interface Props {
  database: any,
  id: string
}


export function View({database, id}: Props) {
  const seconds = useRef<number>(0);
  const [data, setData] = useState<string>();
  const index = useRef<number>(0);
  const [image, setImage] = useState<string>();
  const [isEnd, setIsEnd] = useState<boolean>(false);
  

  function replay() {
    seconds.current = 0;
    index.current = 0;
    setIsEnd(false);
  }

  const interval = useInterval(() => {
    if(!isEnd) {
      if(database[index.current].time > seconds.current) {
        seconds.current++;
      }
      else if (index.current >= database.length-1) {
        setIsEnd(true);
      }
      else {
        seconds.current = 0;
        index.current++;
        setImage(database[index.current].image);
        setData(database[index.current].subtitle);
        console.log("upadate: ", seconds.current, " ", index);
      }
    }
  }, 1000);
  

  useEffect(() => {
    console.log()
    if(!isEnd && database.length > 0){  
      console.log("start")
      interval.start();
      setImage(database[index.current].image);
      setData(database[index.current].subtitle);
    } else {
      console.log("stop")
      interval.stop();
    }
  }, [isEnd]);

  return (
        <Container pt={"md"} w={"100%"}>
        <div className="relative">
          <AspectRatio ratio={16 / 9} >
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{
                position: [0, 0.7, 3.9],
                zoom: 3,
              }}
              style={{
                borderRadius:"12px",
                border: "1px solid #E9ECEF",
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
              }}
              onCreated={({ camera, gl, scene }) => {
                gl.setPixelRatio(16/9);
                gl.shadowMap.enabled = true;
                camera.lookAt(new Vector3(0, 0.7, 0));
              }}
            >
              
              <MainScene isEnd={isEnd} />
              <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
              <Environment preset="city" />
            </Canvas>
          <div className="absolute">
            <AspectRatio ratio={16 / 9} w={"50%"} >
              <Image src={(data !== undefined ) ? image: "./yomiagemaker.png"} withPlaceholder />
            </AspectRatio>
            
          </div>
          {isEnd && 
            <div className="absolute">
              <ActionIcon color="dark" size="xl" radius="xl" variant="light" onClick={replay}>
                <IconReload size={20} />
              </ActionIcon>
            </div>
          }
          
          </AspectRatio>
        </div>
        <Slider
          mt={"sm"}
          mx={"auto"}
          color="yellow"
          w={"98%"}
          max={database.length-1}
          step={database.length-1}
          min={0}
          value={index.current}
          size={5}
          radius={10}
        />
        <Paper  withBorder bg="dark" radius="md" p="xs" mx={"lg"} my={"md"} px={"lg"} >
          <Text color="gray.1" >{(data !== undefined ) ? data : "loading..."}</Text>
        </Paper>
    </Container>
  )
}