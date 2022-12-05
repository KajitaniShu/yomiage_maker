import { useState, useEffect } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Avatar,
  MediaQuery,
  Group,
  Code,
  Title,
  Burger,
  createStyles,
  useMantineTheme,
  ScrollArea,
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
import { Preview } from './Preview';
import { Login } from './Login';
import { db }  from './firebase';
import {collection, doc, getDocs, setDoc, writeBatch} from 'firebase/firestore';
import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const data = [
  { link: '/', label: 'プレビュー', icon: IconDeviceTv },
  { link: '/edit-subtitles', label: '字幕編集', icon: IconEdit },
  { link: '/account', label: 'アカウント', icon: IconUserCircle },
];

const useStyles = createStyles((theme, _params, getRef) => {
  const icon:any = getRef('icon');
    return {
      header: {
      color: '#393E46',
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: "yellow.1" })
          .background,
        color: theme.fn.variant({ variant: 'light', color: "yellow.6" }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: "yellow.6" }).color,
        },
      },
    },
  }
});


export default function App() {
  const [user, initialising] = useAuthState(auth);
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState('プレビュー');
  const [database, setDatabase] = useState(); 

  useEffect(() => {
    console.log(user)
    if(user && database === undefined){
      console.log("access")
      // データを取得
      const dataList = collection(db, "test");
      getDocs(dataList).then((snapShot)=>{
        const _data = JSON.stringify(snapShot.docs.map((doc) => ({...doc.data()})));
        setDatabase(JSON.parse(_data));
      })
    }
  }, [user]);

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        toggle();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : "#ffffff",
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <ScrollArea offsetScrollbars scrollbarSize={6}>
            <Navbar.Section grow>
              {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>

              <a href="/" className={classes.link} onClick={() => auth.signOut()}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Logout</span>
              </a>

            
            </Navbar.Section>  
            <Navbar.Section className={classes.footer}>
              <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                <span>お問い合わせ</span>
              </a>
              <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                <span>使い方</span>
              </a>
              <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                <span>リリース</span>
              </a>
            
            </Navbar.Section>
            </ScrollArea>
          </Navbar>
        
        
      }
      header={
        <Header height={70} p="md">
        <Group className={classes.header} >
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </MediaQuery>
          <Title color="gray.7" order={3}>読み上げメーカー</Title>
          <Code sx={{ fontWeight: 700 }}>v0.6.0</Code>
        </Group>
        <Group position="center" my="xl">
      </Group>

        </Header>
      }

      
      
    >
      {(() => {
        if(user && database !== undefined) {
          if (active === "プレビュー") {
            return (
            <>
            <Avatar src={auth.currentUser?.photoURL} alt="it's me" />
            <Preview database={database} />
          </>);
          } else if (active === "字幕編集") {
            return <EditSubtitles database={database} />;
          } else return  <PageNotFound />            
        } else {

          return <Login />;
        }
      })()}
    </AppShell>
  );
}