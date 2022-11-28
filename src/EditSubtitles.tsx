import { useRef, useEffect, useState } from 'react';
import { Group, TextInput, Box, Text, Code, Button,Textarea,Container, NumberInputHandlers, NumberInput, Transition, Center, Menu, ActionIcon, Badge, Divider, Tooltip, AspectRatio, CopyButton, SimpleGrid, Grid, Skeleton,  createStyles, Card, Image, Avatar, LoadingOverlay, Overlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useScrollLock } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconTrashOff , IconTrash, IconPhotoEdit, IconCheck } from '@tabler/icons';
import { db, storage } from './firebase';
import {collection, doc, getDocs, setDoc, writeBatch} from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath, MIME_TYPES  } from '@mantine/dropzone';


const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },

  body: {
    padding: theme.spacing.md,
  },

  imageWrapper: {
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[4]
    }`,
  }
}));


export function EditSubtitles(database: any) {
  const form = useForm({
    initialValues: {
      subtitles: database.database
    },
  });

  const old_form = useForm({
    initialValues: {
      subtitles: database.database
    },
  });

  const [visible, setVisible] = useState(true);
  const [scrollLocked, setScrollLocked] = useScrollLock();  

  async function upload(form: any, old_form: any){
    try {
      // ボタンが押せないようにする
      setScrollLocked(true);
      setVisible(false);

      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
      const batch = writeBatch(db);
      
      // "test"の部分がidに対応する
      for(let index=0; index < old_form.values.subtitles.length; index++){
        batch.delete(doc(db, "test", String(index)));
      }

      // ファイルアップロードテスト
      if(files){
        const imageRef = ref(storage, "id0001/"+"images/"+files);
        uploadBytes(imageRef, files);
      }
      
      
      // "test"の部分がidに対応する
      for(let index=0; index < form.values.subtitles.length; index++){
        batch.set(doc(db, "test", String(index)), form.values.subtitles[index]);
      }

      // 送信
      await batch.commit().then(() => {
        setScrollLocked(false);
        setVisible(true);
      });
      
    } catch (err) {
      setScrollLocked(false);
      setVisible(true);
    }
  }
  
  
  
    
  
  const { classes } = useStyles();
  const [files, setFiles] = useState<FileWithPath>();
  const openRef = useRef<() => void>(null);

  const fields = form.values.subtitles.map((fieldData: any, index: any) => (
    <Card key={index} withBorder radius="md" p={10} mb={"2em"} className={classes.card}>
      <LoadingOverlay loaderProps={{ color: 'yellow'}} visible={!visible} overlayBlur={2} />
      <Group mx={10} mt={3} position="apart">
        <Badge color="yellow" variant="dot">{index+1}</Badge>
        <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon color="red" variant="light">
            <IconTrash size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>本当に削除しますか</Menu.Label>
          <Menu.Divider />
          <Menu.Item icon={<IconTrashOff size={14} />}>キャンセル</Menu.Item>
          <Menu.Item color="red" onClick={() => form.removeListItem('subtitles', index)} icon={<IconTrash size={14} />}>削除する</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      </Group>
      <Divider my="sm" variant="dashed" />
      <SimpleGrid cols={2} spacing="md" mx={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        
        <Grid gutter="md">
          <Grid.Col>
            <Box h={130} >
            <Text ml={5} size="xs" color="dimmed">
              字幕 (60文字以内)
            </Text>
            <Textarea
              placeholder="字幕を入力する"
              radius="md"
              size="md"
              minRows={3}
              {...form.getInputProps(`subtitles.${index}.subtitle`)} 
            />
            </Box>
            <Box h={50} mb={15}>
              <Text ml={5} size="xs" color="dimmed">
                字幕の表示時間 (秒)
              </Text>
              
              <TextInput
                placeholder="表示時間を入力"
                radius="md"
                size="md"
                type="number"
                {...form.getInputProps(`subtitles.${index}.time`, {type: 'input'})}
              />
            </Box>
          </Grid.Col>
        </Grid>
        <Grid gutter="md">
          <Grid.Col>
            
            <Text ml={5} size="xs" color="dimmed">
              スクリーンに表示する画像
            </Text>
            <Box h={150} p={10} className={classes.imageWrapper}>
              <Group position="right" mx={4}>
                <ActionIcon size="xs" variant="light" onClick={() => {if(openRef.current) openRef.current()}}>
                  <IconPhotoEdit size={18} />
                </ActionIcon>
                
                <ActionIcon size="xs" variant="light">
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
              <Divider my="xs" />
              <Box>
              {!files ? 
                <Dropzone
                  h={110} 
                  maxSize={3 * 1024 ** 2}
                  
                  onDrop={(file) => {
                    file.map((_file, index) => {
                      setFiles(_file);
                    })
                  }}
                  accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                >
                  <Text align="center" size="sm" mt="xs" color="dimmed">
                    <Dropzone.Reject>png, jpgのみ選択してください</Dropzone.Reject>
                    <Dropzone.Idle>画像(png, jpg)を選択してください</Dropzone.Idle>
                  </Text>
                </Dropzone>
                :
                <Image
                  key={index}
                  src={files.path} 
                  height={110} 
                  radius="md"
                  withPlaceholder
                />
              }
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Card>
  ));


  return (
    <Container size="xs" px="md">
        <DragDropContext
          onDragEnd={({ destination, source } :any) =>
            form.reorderListItem('subtitles', { from: source.index, to: destination.index })
          }
        >
          
          <Droppable droppableId="dnd-list" direction="vertical">
            
            {(provided: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields}
                {provided.placeholder}
                </div>
            )}
          </Droppable>
        </DragDropContext>

      <Group position="center" mt="md">
      
        <Button variant="outline" color="yellow" onClick={() => form.insertListItem('subtitles', { subtitle: '', time: '2', image: ''})}>
          字幕を追加
        </Button>
        <Button onClick={async() => upload(form, old_form)} variant="filled" color='yellow' >
          保存
        </Button>
        
      </Group>
      

      <Text size="sm" weight={500} mt="md">
        Form values:
      </Text>
      <Code block>{JSON.stringify(form.values.subtitles)}</Code>
      
    </Container>
    
  );
}