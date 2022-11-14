import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Modal, Fade, Backdrop, Typography, Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';

interface IntroductionMarkdownProps {
  textToRender: string;
}

const IntroductionMarkdown = ({ textToRender }: any) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    setShowMarkdown(true);
    console.log('textToRender', textToRender);
  };

  return (
    <Box>
      <Box>
        <ButtonNaked
          size="small"
          component="button"
          sx={{ color: 'primary.main', pl: '30px' }}
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
            <Typography variant="h4" component="h4">
              18app
            </Typography>
            <Typography variant="body1">Ministero della Cultura</Typography>

            <ReactMarkdown>{textToRender}</ReactMarkdown>
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
        </Fade>
      </Modal>
    </Box>
  );
};

export default IntroductionMarkdown;
