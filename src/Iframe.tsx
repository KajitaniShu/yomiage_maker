import { useState, useEffect } from 'react';
import {
  useMantineTheme,
  Center
} from '@mantine/core';
import {
  IconLogout,
  IconDeviceTv,
  IconEdit,
  IconUserCircle 
} from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { EditSubtitles } from './EditSubtitles';
import { PageNotFound } from './PageNotFound';
import { Login } from './Login';
import { db }  from './firebase';
import {collection, doc, getDocs, setDoc, writeBatch} from 'firebase/firestore';
import { auth } from './firebase'
import { View } from './View'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useParams } from 'react-router-dom'


export function Iframe() {
  const theme = useMantineTheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [database, setDatabase] = useState<any>(); 
  const { viewId } = useParams()

  useEffect(() => {
    console.log(viewId)
    if(viewId && database === undefined){
      // データを取得
      const dataList = collection(db, viewId);
      if(dataList){
        getDocs(dataList).then((snapShot)=>{
          const _data = JSON.stringify(snapShot.docs.map((doc) => ({...doc.data()})));
          setDatabase(JSON.parse(_data));
          console.log(JSON.parse(_data))
        })
      }
    }
  }, []);


  return (
    <>
      {(database && database.length > 0 && viewId) ? 
        <View database={database} id={viewId} /> : 
        <Center style={{ height: "90vh" }}><PageNotFound /></Center>
        
      }
    </>
  );
}