import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
// import { Alert } from '@pagopa/mui-italia/dist/components';
import { WIZARD_ACTIONS } from '../../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  // currentStep: number;
  // setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const FileUpload = ({
  action,
  setAction,
  setDisabledNext /* , currentStep, setCurrentStep */,
}: Props) => {
  const { t } = useTranslation();
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: 'text/csv',
    onDrop: (files) => {
      console.log(files);
      setFileIsLoading(true);

      setTimeout(() => {
        setFileIsLoading(false);
        setDisabledNext(false);
      }, 1000);
    },
  });

  // TEMP
  useEffect(() => {
    setDisabledNext(true);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      //   formik.handleSubmit();
    } else {
      return;
    }
    setAction('');
  }, [action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepTwo.upload.title')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">{t('components.wizard.stepTwo.upload.subTitle')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Button size="small" href="" sx={{ p: 0 }}>
            {t('components.wizard.common.links.findOut')}
          </Button>
        </Box>
      </Box>
      {/* {!fileIsLoading && fileOnError ? (
        <Alert  severity="error"
        variant="standard"> </Alert>
      )} */}

      {fileIsLoading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            py: 2,
          }}
        >
          <Box
            sx={{
              gridColumn: 'span 12',
              alignItems: 'center',
              width: '100%',
              border: '1px solid #E3E7EB',
              borderRadius: '10px',
              p: 3,
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
            }}
          >
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {t('components.wizard.stepTwo.upload.fileIsLoading')}
            </Typography>
            <Box sx={{ gridColumn: 'span 9' }}>
              <LinearProgress />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            py: 2,
          }}
        >
          <Box
            sx={{
              gridColumn: 'span 12',
              alignItems: 'center',
              justifyItems: 'center',
              width: '100%',
              border: '1px dashed #0073E6',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 115, 230, 0.08)',
              p: 3,
            }}
            {...getRootProps({ className: 'dropzone' })}
          >
            <input {...getInputProps()} />
            <Box sx={{ textAlign: 'center', gridColumn: 'span 12' }}>
              <FileUploadIcon sx={{ verticalAlign: 'bottom', color: '#0073E6' }} />
              <Typography variant="body2" sx={{ textAlign: 'center', display: 'inline-grid' }}>
                {t('components.wizard.stepTwo.upload.dragAreaText')}&#160;
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: 'center', display: 'inline-grid', color: '#0073E6' }}
              >
                {t('components.wizard.stepTwo.upload.dragAreaLink')}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
