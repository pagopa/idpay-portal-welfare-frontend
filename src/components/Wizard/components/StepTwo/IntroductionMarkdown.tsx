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

interface Obj {
  label: string;
  formikValue: string;
}

interface IntroductionMarkdownProps {
  textToRender: Array<Obj>;
  serviceName: string | undefined;
  selectedParty: string | undefined;
}

const IntroductionMarkdown = ({
  textToRender,
  serviceName,
  selectedParty,
}: IntroductionMarkdownProps) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [value, setValue] = useState(0);

  const { t } = useTranslation();

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setShowMarkdown(true);
  };

  // check if array.value has undefined or empty string. return object with label and formik value
  const fiteredForEmptyString = () =>
    textToRender.filter((item) => item?.formikValue !== '' && item?.formikValue !== undefined);

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
              <Typography variant="h6" component="h6">
                Anteprima testo introduttivo
              </Typography>
              <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleTabChange}
                aria-label="tabs"
                sx={{ py: 3 }}
              >
                {fiteredForEmptyString().map((item, index) => (
                  <Tab key={index} label={item.label} />
                ))}
              </Tabs>

              <Alert severity="info" variant="standard" sx={{ py: 3 }}>
                {t('components.wizard.stepTwo.previewModal.alertDescription')}
                <Link
                  href="#"
                  target="_blank"
                  underline="none"
                  // variant="body2"
                  sx={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  {t('components.wizard.stepTwo.previewModal.checkGuide')}
                </Link>
              </Alert>
              <Typography variant="h4" component="h4" sx={{ pt: 3 }}>
                {serviceName ?? ''}
              </Typography>
              <Typography variant="body1">{selectedParty ?? ''}</Typography>

              {fiteredForEmptyString().map((item, index) => (
                <IntrudoctionTabPanel key={index} value={value} index={index} {...a11yProps(index)}>
                  <ReactMarkdown>{`${item?.formikValue}` ?? ''}</ReactMarkdown>
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
                {t('components.wizard.stepTwo.previewModal.title')}
              </Typography>
              <Alert severity="info" variant="standard">
              {t('components.wizard.stepTwo.previewModal.alertDescription')}
                <Link
                  href="#"
                  target="_blank"
                  underline="none"
                  // variant="body2"
                  sx={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  {t('components.wizard.stepTwo.previewModal.checkGuide')}
                </Link>
              </Alert>
              <Typography variant="h4" component="h4" sx={{ pt: 3 }}>
                {serviceName ?? ''}
              </Typography>
              <Typography variant="body1">{selectedParty ?? ''}</Typography>

              <ReactMarkdown>{fiteredForEmptyString()[0]?.formikValue ?? ''}</ReactMarkdown>

              <Box sx={{ display: 'grid' }}>
                <Button
                  variant="outlined"
                  sx={{ justifySelf: 'right' }}
                  onClick={() => setShowMarkdown(false)}
                >
                  {t('components.wizard.stepTwo.previewModal.closeBtn')}
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
