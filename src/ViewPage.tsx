import { useState, useEffect } from 'react';
import {
  useMantineTheme,
  Center,
  Header,
  Container,
  Group,
  Title,
  Code,
  createStyles,
  Button
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


const useStyles = createStyles((theme, _params, getRef) => {
  const icon:any = getRef('icon');
    return {
        header: {
        color: '#393E46',
        paddingBottom: theme.spacing.md,
        marginBottom: theme.spacing.md * 1.5,
      }
    }
});


export function ViewPage() {
  const { classes, cx } = useStyles();
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
      <Header height={70} p="md">
        <Group className={classes.header} >
          <Button color="gray" variant="subtle" component="a" href="/"><Title color="gray.7" order={3} >読み上げメーカー</Title></Button>
          <Code sx={{ fontWeight: 700 }}>v0.6.0</Code>
        </Group>
        <Group position="center" my="xl">
      </Group>

        </Header>
      {(database && database.length > 0 && viewId) ? 
        <Center style={{ height: "90vh" }}><View database={database} id={viewId} /></Center> : 
        <Center style={{ height: "90vh" }}><PageNotFound /></Center>
        
      }
    </>
  );
}