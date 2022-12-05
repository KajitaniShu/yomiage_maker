import { useState } from 'react';
import { Group, TextInput, Box, Text, Code, Button,Textarea,Container, Menu, ActionIcon, Badge, Divider, SimpleGrid, Grid, createStyles, Card, Image, LoadingOverlay} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useScrollLock, randomId  } from '@mantine/hooks';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { IconTrashOff , IconTrash, IconPhotoEdit} from '@tabler/icons';
import { db, storage } from './firebase';
import { doc, writeBatch} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dropzone, MIME_TYPES  } from '@mantine/dropzone';


const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  disabled: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
    cursor: 'not-allowed',

    '& *': {
      color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    },
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

interface Props {
  database: any,
  id: string
}

export function EditSubtitles({database, id}: Props) {
  console.log(id);
  const form = useForm({
    initialValues: {
      subtitles: database
    },
  });

  const old_form = useForm({
    initialValues: {
      subtitles: database
    },
  });

  const [visible, setVisible] = useState(true);
  const [scrollLocked, setScrollLocked] = useScrollLock();  

  async function upload(form: any, old_form: any){
    try {
      // ボタンが押せないようにする
      setScrollLocked(true);
      setVisible(false);

      // 使わなくなったファイルを削除
      /*
      const _old_form = old_form.values.subtitles.filter((element: any, index: number, self: any) => 
        self.findIndex((e: any) => e.image === element.image) === index
      )
      if(_old_form.values.subtitles.length){
        for(let index=0; index < _old_form.values.subtitles.length; index++){
          console.log(index);
          if(!form.some((item: any) => item.image === _old_form.values.subtitles[index].image)) {
            console.log(_old_form.values.subtitles[index].image);
            deleteObject(ref(storage, _old_form.values.subtitles[index].image)).then(() => {
              // success
              console.log("success")
            }).catch((error) => {
              // error
              console.log("error")
            });
          }
        }
      }
      */

      // ファイルアップロード
      for(let index=0; index < form.values.subtitles.length; index++){
        if(form.values.subtitles[index].image.path !== undefined) {
          const localPath = form.values.subtitles[index].image;
          const filePath = "id0001/"+"images/"+randomId();
          const imageRef = ref(storage, filePath);
          
          await uploadBytes(imageRef, form.values.subtitles[index].image);
          const fileURL = await getDownloadURL(imageRef);
          
          form.insertListItem('subtitles', {'image': fileURL, 'subtitle': form.values.subtitles[index].subtitle, 'time': form.values.subtitles[index].time}, index)
          form.removeListItem('subtitles', index+1);
          
          form.values.subtitles.filter((element: any, index: number, self: any) => {
            if(element.image === localPath) {
              form.insertListItem('subtitles', {'image': fileURL, 'subtitle': element.subtitle, 'time': element.time}, index)
              form.removeListItem('subtitles', index+1);
            }
          });
        }
      }

      // (Cloud Firestoreのインスタンスを初期化してdbにセット)
      const batch = writeBatch(db);
      
      // "test"の部分がidに対応する
      for(let index=0; index < old_form.values.subtitles.length; index++){
        console.log("delete " + form.values.subtitles[index])
        batch.delete(doc(db, "test", String(index)));
      }
      
      // "test"の部分がidに対応する
      for(let index=0; index < form.values.subtitles.length; index++){
        console.log("set " + form.values.subtitles[index])
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
  // 画像ファイルの種類
  const [fileCount, setFileCount] = useState<number>(form.values.subtitles.filter((element: any, index: number, self: any) => 
    self.findIndex((e: any) => e.image === element.image) === index
  ).length); 


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
          <Menu.Item 
            color="red" 
            onClick={() => { 
              form.removeListItem('subtitles', index)
              setFileCount(form.values.subtitles.filter((element: any, index: number, self: any) => 
                self.findIndex((e: any) => e.image === element.image) === index
              ).length);
            }} 
            icon={<IconTrash size={14} />}
          >
              削除する
          </Menu.Item>
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
                <ActionIcon size="xs" variant="light">
                  <IconPhotoEdit size={18} />
                </ActionIcon>
                
                <ActionIcon size="xs" variant="light" onClick={() => { 
                  form.insertListItem('subtitles', {'image': "", 'subtitle': fieldData.subtitle, 'time': fieldData.time}, index)
                  form.removeListItem('subtitles', index+1);
                  setFileCount(form.values.subtitles.filter((element: any, index: number, self: any) => 
                    self.findIndex((e: any) => e.image === element.image) === index
                  ).length);
                }}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
              <Divider my="xs" />
              <Box>
              {(fieldData.image === "") ? 
                <Dropzone
                  h={110} 
                  maxSize={3 * 1024 ** 2}
                  disabled={fileCount < 6 ? false : true}
                  className={fileCount < 6 ? ("") : (classes.disabled)}
              
                  onDrop={(file) => {
                    if(fileCount < 6){
                      form.insertListItem('subtitles', {'image': file[0], 'subtitle': fieldData.subtitle, 'time': fieldData.time}, index)
                      form.removeListItem('subtitles', index+1)
                      setFileCount(form.values.subtitles.filter((element: any, index: number, self: any) => 
                        self.findIndex((e: any) => e.image === element.image) === index
                      ).length);
                    }
                  }}
                  accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                >
                  <Text align="center" size="sm" mt="xs" color="dimmed">
                    <Dropzone.Reject>png, jpgのみ選択してください</Dropzone.Reject>
                    <Dropzone.Idle>
                      {fileCount < 6 ? "画像(png, jpg)を選択してください" : "登録できる画像は5種類までです"}
                    </Dropzone.Idle>
                  </Text>
                </Dropzone>
                :
                
                <Image
                  key={index}
                  src={(fieldData.image.path === undefined) ? fieldData.image : URL.createObjectURL(fieldData.image)} 
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
      
        <Button variant="outline" color="yellow" onClick={() => {
          if(form.values.subtitles.length > 0) {form.insertListItem('subtitles', { subtitle: '', time: '2', image: form.values.subtitles[form.values.subtitles.length-1].image})}
          else {form.insertListItem('subtitles', { subtitle: '', time: '2', image:""})}
          }}>
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