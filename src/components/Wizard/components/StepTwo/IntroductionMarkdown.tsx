import { useState, SyntheticEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  Modal,
  Fade,
  Backdrop,
  Typography,
  Alert,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import IntrudoctionTabPanel from './IntrudoctionTabPanel';

interface IntroductionMarkdownProps {
  textToRender: Array<string>;
}

const IntroductionMarkdown = ({ textToRender }: IntroductionMarkdownProps) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [value, setValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { t } = useTranslation();

  const handleClick = () => {
    setShowMarkdown(true);
    console.log('textToRender', textToRender);
    const fiteredForEmptyString = textToRender.filter((item) => item !== '' && item !== undefined);
    console.log('textToRender', fiteredForEmptyString, fiteredForEmptyString.length);
    console.log('textToRenderKeys', Object.keys(textToRender));
    
  };

  // check if array has undefined or empty string
  const fiteredForEmptyString = () =>
    textToRender.filter((item) => item !== '' && item !== undefined);

  // check how many text fields have been compiled
  const moreThanOneTextAreaCompiled = (): boolean => {
    if (fiteredForEmptyString().length <= 1) {
      return false;
    }

    return fiteredForEmptyString().length > 1;
  };

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <Box>
        <ButtonNaked
          size="small"
          component="button"
          sx={{ color: 'primary.main', ml: '35px', mt: '25px' }}
          weight="default"
          onClick={handleClick}
        >
          {t('components.wizard.stepTwo.form.preview')}
        </ButtonNaked>
      </Box>
      <Modal
        aria-labelledby="introduction-modal-title"
        aria-describedby="introduction-modal-description"
        open={showMarkdown}
        onClose={() => setShowMarkdown(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showMarkdown}>
          {moreThanOneTextAreaCompiled() ? (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                borderRadius: '4px',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography sx={{ py: 3 }} variant="h6" component="h6">
                Anteprima testo introduttivo
              </Typography>
              <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleTabChange}
                aria-label="tabs"
                sx={{ py: 3 }}
              >
                {fiteredForEmptyString().map((_item, index) => (
                  <Tab key={index} label={index} />
                ))}
              </Tabs>

              <Alert severity="info" variant="standard" sx={{ py: 3 }}>
                Qui puoi vedere come gli utenti visualizzeranno il contenuto su IO. Per maggiori
                informazioni,
                <Link
                  href="#"
                  target="_blank"
                  underline="none"
                  // variant="body2"
                  sx={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  consulta la guida.
                </Link>
              </Alert>
              <Typography variant="h4" component="h4" sx={{ py: 3 }}>
                18app
              </Typography>
              <Typography variant="body1">Ministero della Cultura</Typography>

              {fiteredForEmptyString().map((item, index) => (
                <IntrudoctionTabPanel key={index} value={value} index={index} {...a11yProps(index)}>
                  <ReactMarkdown>{item}</ReactMarkdown>
                </IntrudoctionTabPanel>
              ))}

              <Box sx={{ display: 'grid' }}>
                <Button
                  variant="outlined"
                  sx={{ justifySelf: 'right' }}
                  onClick={() => setShowMarkdown(false)}
                >
                  Chiudi
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                borderRadius: '4px',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography sx={{ py: 3 }} variant="h6" component="h6">
                Anteprima testo introduttivo
              </Typography>
              <Alert severity="info" variant="standard">
                Qui puoi vedere come gli utenti visualizzeranno il contenuto su IO. Per maggiori
                informazioni,
                <Link
                  href="#"
                  target="_blank"
                  underline="none"
                  // variant="body2"
                  sx={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  consulta la guida.
                </Link>
              </Alert>
              <Typography variant="h4" component="h4" sx={{ py: 3 }}>
                18app
              </Typography>
              <Typography variant="body1">Ministero della Cultura</Typography>

              <ReactMarkdown>{fiteredForEmptyString()[0]}</ReactMarkdown>

              <Box sx={{ display: 'grid' }}>
                <Button
                  variant="outlined"
                  sx={{ justifySelf: 'right' }}
                  onClick={() => setShowMarkdown(false)}
                >
                  Chiudi
                </Button>
              </Box>
            </Box>
          )}
        </Fade>
      </Modal>
    </Box>
  );
};

export default IntroductionMarkdown;
