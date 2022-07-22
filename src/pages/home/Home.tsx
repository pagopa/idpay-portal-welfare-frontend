/* eslint-disable react/no-children-prop */
// import { Box, Paper } from '@mui/material';
// import { TitleBox } from '@pagopa/selfcare-common-frontend';
// import { useTranslation } from 'react-i18next';
// import ReactDom from 'react-dom';
// import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

const Home = () => {
  const [markdownContent, setMarkDownContent] = useState('');
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/pagopa/idpay-portal-welfare-tos/main/README.md')
      .then(
        (response) => response.text()
        // setContent(response?.body);
      )
      .then((responseText) => setMarkDownContent(responseText))
      .catch((error) => console.log(error));
  }, []);

  return <ReactMarkdown children={markdownContent} remarkPlugins={[remarkGfm]} />;
  // const { t } = useTranslation();
  // <Box width="100%" px={2}>
  //   <TitleBox
  //     title={t('pages.home.title')}
  //     subTitle={t('pages.home.title')}
  //     mbTitle={2}
  //     mtTitle={2}
  //     mbSubTitle={5}
  //     variantTitle="h4"
  //     variantSubTitle="body1"
  //   />
  //   <Paper sx={{ padding: '16px' }}>Some content</Paper>
  //  */}
  // </Box>
};
export default Home;
