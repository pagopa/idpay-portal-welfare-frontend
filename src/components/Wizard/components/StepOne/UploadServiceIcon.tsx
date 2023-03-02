import { Box } from '@mui/system';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@mui/material';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import LoadingFile from '../../../LoadingFile/LoadingFile';
import InitUploadBox from '../../../InitUploadBox/InitUploadBox';
import AcceptedFile from '../../../AcceptedFile/AcceptedFile';

interface Props {
  setUploadFile: Dispatch<SetStateAction<File | undefined>>;
  setFileUploadedOk: Dispatch<SetStateAction<boolean>>;
  fileUplodedOk: boolean;
  fileUplodedKo: boolean;
  fileName: string | undefined;
  fileUploadDate: string | undefined;
  setFileName: Dispatch<SetStateAction<string>>;
  setUploadDate: Dispatch<SetStateAction<string>>;
}

const UploadServiceIcon = ({
  setUploadFile,
  setFileUploadedOk,
  fileUplodedOk,
  fileUplodedKo,
  fileName,
  fileUploadDate,
  setFileName,
  setUploadDate,
}: Props) => {
  const { t } = useTranslation();
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileIsAcceppted, setFileIsAcceppted] = useState(false);
  const [fileIsRejected, setFileIsRejected] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertDescription, setAlertDescription] = useState<string>('');

  useEffect(() => {
    if (fileUplodedOk) {
      setFileIsLoading(false);
      setFileIsRejected(false);
      setFileIsAcceppted(true);
    }
  }, [fileUplodedOk]);

  useEffect(() => {
    if (fileUplodedKo) {
      resetStatus();
    }
  }, [fileUplodedKo]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 1048576,
    accept: 'image/png',
    onDrop: () => {
      setFileIsLoading(true);
    },
    onDropAccepted: (files) => {
      setUploadFile(files[0]);
      setFileName(files[0].name);
      const dateField =
        Object.prototype.toString.call(files[0].lastModified) === '[object Date]'
          ? files[0].lastModified
          : new Date();
      const fileDate = dateField && dateField.toLocaleString('fr-BE');
      setUploadDate(fileDate || '');
      setFileIsLoading(false);
      setFileIsRejected(false);
      setFileIsAcceppted(true);
    },
    onDropRejected: (files) => {
      const errorKey = files[0].errors[0].code;
      switch (errorKey) {
        case 'file-invalid-type':
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileTitle'));
          setAlertDescription(
            t('components.wizard.stepOne.uploadIcon.invalidFileTypeLogoDescription')
          );
          break;
        case 'file-too-large':
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileTitle'));
          setAlertDescription(
            t('components.wizard.stepOne.uploadIcon.overMaxUploadLogoDescription')
          );
          break;
        default:
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileTitle'));
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileDescription'));
          break;
      }
      setFileIsLoading(false);
      setFileIsRejected(true);
      setFileIsAcceppted(false);
    },
  });

  const resetStatus = () => {
    setFileIsLoading(false);
    setFileIsRejected(false);
    setFileIsAcceppted(false);
    setUploadFile(undefined);
    setFileUploadedOk(false);
  };

  const InitStatusPartial = (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
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
        {...getRootProps()}
      >
        <input {...getInputProps()} data-testid="drop-input" />
        <InitUploadBox
          text={t('components.wizard.stepOne.uploadIcon.dragAreaText')}
          link={t('components.wizard.stepOne.uploadIcon.dragAreaLink')}
        />
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          alignItems: 'center',
          justifyItems: 'center',
          width: '100%',
        }}
      >
        <FormHelperText sx={{ fontSize: '12px', fontWeight: 600, color: '#5C6F82' }}>
          {t('components.wizard.stepOne.uploadIcon.helperText')}
        </FormHelperText>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'grid', width: '100%', pt: 2 }}>
      {fileIsRejected && (
        <Toast
          open={fileIsRejected}
          title={alertTitle}
          message={alertDescription}
          onCloseToast={() => {
            setFileIsRejected(false);
          }}
          logo={InfoOutlinedIcon}
          leftBorderColor="#FE6666"
          toastColorIcon="#FE6666"
          showToastCloseIcon={true}
        />
      )}

      {fileIsLoading ? (
        <LoadingFile message={t('components.wizard.stepOne.uploadIcon.IconIsLoading')} />
      ) : fileIsAcceppted ? (
        <AcceptedFile
          fileName={fileName}
          fileDate={fileUploadDate}
          chipLabel={t('components.wizard.stepOne.uploadIcon.validIcon')}
          buttonLabel={t('components.wizard.stepOne.uploadIcon.changeIcon')}
          buttonHandler={resetStatus}
        />
      ) : (
        InitStatusPartial
      )}
    </Box>
  );
};

export default UploadServiceIcon;
