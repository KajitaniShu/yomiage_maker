import { createStyles, Image, Container, Title, Text, Button, SimpleGrid, Center } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

export function PageNotFound() {
  const { classes } = useStyles();

  return (
    <Center style={{ height: "90vh" }}>
    <Container className={classes.root} p={"lg"}>
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <Image src={'../pagenotfound.png'} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>ページが見つかりませんでした．</Title>
          <Text color="dimmed" size="lg">
          タイプミスがないかご確認ください．
          そうでない場合は「お問い合わせ」からお知らせください．
          </Text>
          <Button  component="a" href="/" color="yellow" variant="outline" size="md" mt="xl" className={classes.control}>
            ホームに戻る
          </Button>
        </div>
        <Image src={'../pagenotfound.png'} height={200} withPlaceholder className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
    </Center>
  );
}