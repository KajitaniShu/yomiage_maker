import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Group,
  Code,
  Title,
  Burger,
  createStyles,
  useMantineTheme,
  ScrollArea
} from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
} from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditSubtitles } from './EditSubtitles';
import { PageNotFound } from './PageNotFound';

const data = [
  { link: '/', label: 'プレビュー', icon: IconBellRinging },
  { link: '/edit-subtitles', label: '字幕編集', icon: IconReceipt2 },
  { link: '', label: 'Security', icon: IconFingerprint },
  { link: '', label: 'SSH Keys', icon: IconKey },
  { link: '', label: 'Databases', icon: IconDatabaseImport },
  { link: '', label: 'Authentication', icon: Icon2fa },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

const useStyles = createStyles((theme, _params, getRef) => {
const icon = getRef('icon');
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
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },
  }
});

export default function App() {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        toggle();
        window.location.href = item.link;
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
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
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

              <a href="/" className={classes.link} onClick={(event) => event.preventDefault()}>
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
          <Title order={3}>読み上げメーカー</Title>
          <Code sx={{ fontWeight: 700 }}>v0.6.0</Code>
        </Group>

        </Header>
      }
    >
      <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<EditSubtitles />} />
        <Route path={"*"} element={<PageNotFound />} />
      </Routes>
      </BrowserRouter>
    
    </AppShell>
  );
}