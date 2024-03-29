import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ButtonNaked } from '@pagopa/mui-italia';
import * as Yup from 'yup';
import { CallMade } from '@mui/icons-material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import {
  createInitiativeServiceInfo,
  updateInitiativeServiceInfo,
  uploadAndUpdateLogo,
} from '../../../../services/intitativeService';
import {
  initiativeIdSelector,
  additionalInfoSelector,
  setInitiativeId,
  setAdditionalInfo,
  setInitiativeLogo,
} from '../../../../redux/slices/initiativeSlice';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { ServiceScopeEnum } from '../../../../api/generated/initiative/InitiativeAdditionalDTO';
import TitleBoxWithHelpLink from '../../../TitleBoxWithHelpLink/TitleBoxWithHelpLink';
import { parseDataToSend } from './helpers';
import InitiativeNotOnIOModal from './InitiativeNotOnIOModal';
import UploadServiceIcon from './UploadServiceIcon';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const ServiceConfig = ({
  action,
  setAction,
  currentStep,
  setCurrentStep,
  setDisabledNext,
}: Props) => {
  const { t } = useTranslation();
  const initiativeId = useAppSelector(initiativeIdSelector);
  const additionalInfo = useAppSelector(additionalInfoSelector);
  const [openInitiativeNotOnIOModal, setOpenInitiativeNotOnIOModal] = useState(false);
  const addError = useErrorDispatcher();
  const dispatch = useAppDispatch();
  const setLoading = useLoading('SAVE_INITIATIVE_SERVICE');
  const [uploadFile, setUploadFile] = useState<File>();
  const [fileUplodedOk, setFileUploadedOk] = useState<boolean>(false);
  const [fileName, setFileName] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [fileUplodedKo, setFileUploadedKo] = useState(false);
  const handleCloseInitiativeNotOnIOModal = () => setOpenInitiativeNotOnIOModal(false);

  const handleOpenInitiativeNotOnIOModal = () => setOpenInitiativeNotOnIOModal(true);

  const contacts = [
    {
      id: 1,
      value: 'web',
      name: `${t('components.wizard.stepOne.form.webUrl')}`,
    },
    {
      id: 2,
      value: 'email',
      name: `${t('components.wizard.stepOne.form.email')}`,
    },
    {
      id: 3,
      value: 'mobile',
      name: `${t('components.wizard.stepOne.form.phone')}`,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    }
    setAction('');
  }, [action]);

  useEffect(() => {
    if (additionalInfo.logoFileName.length > 0 && additionalInfo.logoUploadDate.length > 0) {
      setFileName(additionalInfo.logoFileName);
      setUploadDate(additionalInfo.logoUploadDate);
      setFileUploadedOk(true);
    }
  }, [JSON.stringify(additionalInfo)]);

  const validateUrl = (value: string | undefined): boolean => {
    const regex = new RegExp(/^(https):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/);
    if (typeof value === 'string') {
      return regex.test(value);
    }
    return false;
  };

  const validatePhoneNumber = (value: string | undefined): boolean => {
    const regex = new RegExp(/^\s*[0-9]{2,4}-?\/?\s?[0-9]{1,10}\s*$/);
    if (typeof value === 'string') {
      return regex.test(value);
    }
    return false;
  };

  const validationSchema = Yup.object().shape({
    initiativeOnIO: Yup.boolean(),
    serviceName: Yup.string().required(t('validation.required')),
    serviceArea: Yup.string().required(t('validation.required')),
    serviceDescription: Yup.string().required(t('validation.required')),
    privacyPolicyUrl: Yup.string()
      .required(t('validation.required'))
      .test('url', t('validation.web'), (value) => validateUrl(value)),
    termsAndConditions: Yup.string()
      .required(t('validation.required'))
      .test('url', t('validation.web'), (value) => validateUrl(value)),
    assistanceChannels: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required(t('validation.required')),
        contact: Yup.string()
          .required(t('validation.required'))
          .when('type', (type, schema) => {
            if (type && type === 'web') {
              return Yup.string()
                .required(t('validation.required'))
                .test('url', t('validation.web'), (value) => validateUrl(value));
            }
            if (type && type === 'email') {
              return Yup.string()
                .required(t('validation.required'))
                .email(t('validation.emailValid'));
            }
            if (type && type === 'mobile') {
              return Yup.string()
                .required(t('validation.required'))
                .test('mobile', t('validation.celNumValid'), (value) => validatePhoneNumber(value));
            }
            return schema;
          }),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      initiativeOnIO: additionalInfo.initiativeOnIO,
      serviceName: additionalInfo.serviceName,
      serviceArea: additionalInfo.serviceArea,
      serviceDescription: additionalInfo.serviceDescription,
      privacyPolicyUrl: additionalInfo.privacyPolicyUrl,
      termsAndConditions: additionalInfo.termsAndConditions,
      assistanceChannels: [...additionalInfo.assistanceChannels],
    },
    validationSchema,
    // validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (values.initiativeOnIO === false) {
        handleOpenInitiativeNotOnIOModal();
      } else {
        sendValues(values, currentStep, setCurrentStep);
      }
    },
  });

  useEffect(() => {
    if (formik.dirty || formik.isValid) {
      setDisabledNext(false);
    } else {
      setDisabledNext(true);
    }
  }, [formik]);

  const waitUpload = () => setCurrentStep(currentStep + 1);

  const sendUploadFile = (
    id: string | undefined,
    file: File | undefined,
    currentStep: number,
    setCurrentStep: Dispatch<SetStateAction<number>>
  ) => {
    if (typeof id !== 'undefined' && typeof file !== 'undefined') {
      uploadAndUpdateLogo(id, file)
        .then((res) => {
          setFileUploadedOk(true);
          setFileUploadedKo(false);
          const fileUploadDate =
            res.logoUploadDate && typeof res.logoUploadDate === 'string'
              ? new Date(res.logoUploadDate).toLocaleString('fr-BE')
              : new Date().toLocaleString('fr-BE');
          setUploadDate(fileUploadDate);
          const data = { ...res, logoUploadDate: fileUploadDate };
          dispatch(setInitiativeLogo(data));
        })
        .then(() => waitUpload())
        .catch((error) => {
          setFileUploadedOk(false);
          addError({
            id: 'UPLOAD_AND_UPDATE_LOGO',
            blocking: false,
            error,
            techDescription: 'An error occurred uploading logo',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
          setFileUploadedKo(true);
        });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const sendValues = (
    values: any,
    currentStep: number,
    setCurrentStep: Dispatch<SetStateAction<number>>
  ) => {
    const data = parseDataToSend(values);
    dispatch(setAdditionalInfo(values));
    if (!initiativeId) {
      setLoading(true);
      createInitiativeServiceInfo(data)
        .then((res) => {
          dispatch(setInitiativeId(res?.initiativeId));
          sendUploadFile(res?.initiativeId, uploadFile, currentStep, setCurrentStep);
        })
        .catch((error) => {
          addError({
            id: 'NEW_SERVICE_INFO_SAVE_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred saving initiative service info',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.invalidDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      updateInitiativeServiceInfo(initiativeId, data)
        .then((_res) => {
          sendUploadFile(initiativeId, uploadFile, currentStep, setCurrentStep);
        })
        .catch((error) => {
          addError({
            id: 'EDIT_SERVICE_INFO_SAVE_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred editing initiative service info',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.invalidDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const addAssistanceChannel = (values: any, setValues: any) => {
    const newAssistanceChannel = [...values.assistanceChannels, { type: '', contact: '' }];
    setValues({ ...values, assistanceChannels: newAssistanceChannel });
  };

  const deleteAssistanceChannel = (i: number, values: any, setValues: any) => {
    const indexValueToRemove = i;
    // eslint-disable-next-line functional/immutable-data
    const newValues = values.assistanceChannels.filter((v: any, i: number) => {
      if (i !== indexValueToRemove) {
        return v;
      }
    });
    setValues({ ...values, assistanceChannels: newValues });
  };

  const handleContactSelect = (e: any, setValues: any, index: number, values: any) => {
    const newValue = e.target.value;
    const newAssistanceChannel = values.assistanceChannels.map(
      (v: { contact: string }, i: number) => {
        if (i === index) {
          return {
            type: newValue,
            contact: v.contact,
          };
        } else {
          return { ...v };
        }
      }
    );
    setValues({ ...values, assistanceChannels: [...newAssistanceChannel] });
  };

  const handleTypeChange = (e: any, i: number, values: any, setValues: any) => {
    const assistanceChannelChanged = [...values.assistanceChannels];
    // eslint-disable-next-line functional/immutable-data
    assistanceChannelChanged[i] = {
      ...assistanceChannelChanged[i],
      contact: e.target.value,
    };
    setValues({ ...values, assistanceChannels: [...assistanceChannelChanged] });
  };

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <InitiativeNotOnIOModal
        openInitiativeNotOnIOModal={openInitiativeNotOnIOModal}
        handleCloseInitiativeNotOnIOModal={handleCloseInitiativeNotOnIOModal}
        values={formik.values}
        sendValues={sendValues}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      <TitleBoxWithHelpLink
        title={t('components.wizard.stepOne.title')}
        subtitle={t('components.wizard.stepOne.subtitle')}
        helpLink={t('helpStaticUrls.wizard.serviceConfig')}
        helpLabel={t('components.wizard.common.links.findOut')}
      />

      <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', pb: 2 }}>
        <FormControlLabel
          sx={{ gridColumn: 'span 2' }}
          control={
            <Switch
              data-testid="initiative-on-io-test"
              checked={formik.values.initiativeOnIO}
              value={formik.values.initiativeOnIO}
              inputProps={{
                checked: formik.values.initiativeOnIO,
                role: 'checkbox',
                name: 'initiativeOnIO',
                id: 'initiativeOnIO',
              }}
              onChange={(e) => formik.handleChange(e)}
              name="initiativeOnIO"
            />
          }
          label={t('components.wizard.stepOne.form.initiativeOnIo')}
        />
      </FormControl>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          borderColor: grey.A200,
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: 1,
          p: 3,
        }}
      >
        <Box sx={{ gridColumn: 'span 1' }}>
          <MenuBookIcon />
        </Box>
        <Box sx={{ gridColumn: 'span 22' }}>
          <Typography variant="subtitle1">
            {t('components.wizard.stepOne.form.description')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 1' }}></Box>

        <Box
          sx={{
            gridColumn: 'span 24',
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gap: 2,
            mt: 3,
          }}
        >
          <FormControl sx={{ gridColumn: 'span 12' }}>
            <TextField
              label={t('components.wizard.stepOne.form.serviceName')}
              placeholder={t('components.wizard.stepOne.form.serviceName')}
              name="serviceName"
              aria-label="serviceName"
              role="input"
              required={true}
              InputLabelProps={{ required: false }}
              value={formik.values.serviceName}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
              helperText={formik.touched.serviceName && formik.errors.serviceName}
              size="small"
              inputProps={{
                'data-testid': 'service-name-test',
              }}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 12' }} size="small">
            <InputLabel>{t('components.wizard.stepOne.form.serviceArea')}</InputLabel>
            <Select
              id="serviceArea"
              inputProps={{
                'data-testid': 'service-area-select',
              }}
              name="serviceArea"
              aria-labelledby="serviceArea"
              label={t('components.wizard.stepOne.form.serviceArea')}
              placeholder={t('components.wizard.stepOne.form.serviceArea')}
              onChange={async (e) => {
                await formik.setFieldValue('serviceArea', e.target.value);
              }}
              error={formik.touched.serviceArea && Boolean(formik.errors.serviceArea)}
              value={formik.values.serviceArea}
            >
              <MenuItem value={ServiceScopeEnum.LOCAL} data-testid="serviceScope-local-test">
                {t('components.wizard.stepOne.form.serviceScopeLocal')}
              </MenuItem>
              <MenuItem value={ServiceScopeEnum.NATIONAL} data-testid="serviceScope-national-test">
                {t('components.wizard.stepOne.form.serviceScopeNational')}
              </MenuItem>
            </Select>
            <FormHelperText
              error={formik.touched.serviceArea && Boolean(formik.errors.serviceArea)}
            >
              {formik.touched.serviceArea && formik.errors.serviceArea}
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 24' }}>
            <TextField
              sx={{ gridColumn: 'span 12' }}
              multiline
              minRows={2}
              maxRows={4}
              label={t('components.wizard.stepOne.form.serviceDescription')}
              placeholder={t('components.wizard.stepOne.form.serviceDescription')}
              name="serviceDescription"
              aria-label="service-description"
              inputProps={{
                'data-testid': 'service-description-test',
              }}
              role="input"
              value={formik.values.serviceDescription}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.serviceDescription && Boolean(formik.errors.serviceDescription)}
              helperText={formik.touched.serviceDescription && formik.errors.serviceDescription}
              required={true}
              InputLabelProps={{ required: false }}
              size="small"
            />
            {formik.values.initiativeOnIO ? (
              <UploadServiceIcon
                setUploadFile={setUploadFile}
                setFileUploadedOk={setFileUploadedOk}
                fileUplodedOk={fileUplodedOk}
                fileUplodedKo={fileUplodedKo}
                fileName={fileName}
                fileUploadDate={uploadDate}
                setFileName={setFileName}
                setUploadDate={setUploadDate}
              />
            ) : null}
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          borderColor: grey.A200,
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: 1,
          p: 3,
          mt: 3,
        }}
      >
        <Box sx={{ gridColumn: 'span 1' }}>
          <PrivacyTipIcon />
        </Box>
        <Box sx={{ gridColumn: 'span 22' }}>
          <Typography variant="subtitle1">
            {t('components.wizard.stepOne.form.legalInfo')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 1' }}></Box>
        <Box
          sx={{
            gridColumn: 'span 24',
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gap: 2,
            mt: 3,
          }}
        >
          <FormControl sx={{ gridColumn: 'span 18' }}>
            <TextField
              label={t('components.wizard.stepOne.form.privacyPolicyUrl')}
              placeholder={t('components.wizard.stepOne.form.privacyPolicyUrl')}
              name="privacyPolicyUrl"
              aria-label="privacyPolicyUrl"
              role="input"
              required={true}
              InputLabelProps={{ required: false }}
              value={formik.values.privacyPolicyUrl}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.privacyPolicyUrl && Boolean(formik.errors.privacyPolicyUrl)}
              helperText={formik.touched.privacyPolicyUrl && formik.errors.privacyPolicyUrl}
              size="small"
              inputProps={{
                'data-testid': 'privacy-policy-url-test',
              }}
            />
          </FormControl>

          <FormControl
            sx={{ gridColumn: 'span 6', alignItems: 'center', justifyContent: 'center' }}
          >
            <ButtonNaked
              size="small"
              href={formik.values.privacyPolicyUrl}
              target="_blank"
              endIcon={<CallMade />}
              sx={{ color: 'primary.main' }}
              weight="default"
              disabled={
                typeof formik.values.privacyPolicyUrl === 'string' &&
                formik.values.privacyPolicyUrl.length === 0
              }
            >
              {t('components.wizard.stepOne.form.tryUrl')}
            </ButtonNaked>
          </FormControl>

          <FormControl sx={{ gridColumn: 'span 18' }}>
            <TextField
              label={t('components.wizard.stepOne.form.termsAndConditions')}
              placeholder={t('components.wizard.stepOne.form.termsAndConditions')}
              name="termsAndConditions"
              aria-label="termsAndConditions"
              role="input"
              required={true}
              InputLabelProps={{ required: false }}
              value={formik.values.termsAndConditions}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.termsAndConditions && Boolean(formik.errors.termsAndConditions)}
              helperText={formik.touched.termsAndConditions && formik.errors.termsAndConditions}
              size="small"
              inputProps={{
                'data-testid': 'terms-and-conditions-test',
              }}
            />
          </FormControl>

          <FormControl
            sx={{ gridColumn: 'span 6', alignItems: 'center', justifyContent: 'center' }}
          >
            <ButtonNaked
              size="small"
              href={formik.values.termsAndConditions}
              target="_blank"
              endIcon={<CallMade />}
              sx={{ color: 'primary.main' }}
              weight="default"
              disabled={
                typeof formik.values.termsAndConditions === 'string' &&
                formik.values.termsAndConditions.length === 0
              }
            >
              {t('components.wizard.stepOne.form.tryUrl')}
            </ButtonNaked>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          borderColor: grey.A200,
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: 1,
          alignItems: 'center',
          p: 3,
          my: 3,
        }}
      >
        <Box sx={{ gridColumn: 'span 1', mt: 1 }}>
          <LinkIcon />
        </Box>
        <Box sx={{ gridColumn: 'span 22' }}>
          <Typography variant="subtitle1">
            {t('components.wizard.stepOne.form.assistanceChannels')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 1' }}></Box>
        <Box
          sx={{
            gridColumn: 'span 24',
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            mt: 3,
          }}
        >
          {
            // eslint-disable-next-line sonarjs/cognitive-complexity
            formik.values.assistanceChannels.map((_o, i) => {
              const channelErrors =
                (formik.errors.assistanceChannels?.length && formik.errors.assistanceChannels[i]) ||
                {};
              const channelTouched =
                (formik.touched.assistanceChannels?.length &&
                  formik.touched.assistanceChannels[i]) ||
                {};

              const typeError = typeof channelErrors === 'string' ? '' : channelErrors.type;
              const typeTouched = channelTouched.type;
              const contactError = typeof channelErrors === 'string' ? '' : channelErrors.contact;
              const contactTouched = channelTouched.contact;
              return (
                <Box
                  key={i}
                  sx={{
                    gridColumn: 'span 24',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(24, 1fr)',
                    mb: 2,
                    gap: 2,
                  }}
                >
                  {i !== 0 && (
                    <Box
                      sx={{ display: 'grid', gridColumn: 'span 1', alignItems: 'center' }}
                      data-testid="remove-channel-test"
                    >
                      <RemoveCircleOutlineIcon
                        color="error"
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => deleteAssistanceChannel(i, formik.values, formik.setValues)}
                        id={`remove_assistanceChannel_${i}`}
                        data-testid="remove-assistance-channel"
                      />
                    </Box>
                  )}
                  <FormControl
                    sx={{ gridColumn: 'span 7' }}
                    error={typeTouched && Boolean(typeError)}
                    size="small"
                  >
                    <InputLabel id={`assistanceChannels[${i}].type_label`}>
                      {t('components.wizard.stepOne.form.channelType')}
                    </InputLabel>
                    <Select
                      id={`assistanceChannels${i}_type`}
                      labelId={`assistanceChannels[${i}].type_label`}
                      name={`assistanceChannels[${i}].type`}
                      label={t('components.wizard.stepOne.form.channelType')}
                      value={formik.values.assistanceChannels[i].type}
                      onChange={(e) => handleContactSelect(e, formik.setValues, i, formik.values)}
                      error={typeTouched && Boolean(typeError)}
                      inputProps={{
                        'data-testid': 'assistance-channel-test',
                      }}
                    >
                      {contacts.map(({ name, value }, id) => (
                        <MenuItem key={id} value={value}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{typeTouched && typeError}</FormHelperText>
                  </FormControl>
                  <FormControl
                    sx={{
                      gridColumn:
                        formik.values.assistanceChannels[i].type === 'web' && i !== 0
                          ? 'span 16'
                          : formik.values.assistanceChannels[i].type === 'web' && i === 0
                          ? 'span 17'
                          : 'span 10',
                    }}
                  >
                    <TextField
                      id={`assistanceChannels_${i}_contact`}
                      name={`assistanceChannels[${i}].contact`}
                      variant="outlined"
                      label={t('components.wizard.stepOne.form.indicateChannel')}
                      sx={{ gridColumn: 'span 10', gridArea: 'Channel' }}
                      placeholder={t('components.wizard.stepOne.form.indicateChannel')}
                      value={formik.values.assistanceChannels[i].contact}
                      onChange={(e) => handleTypeChange(e, i, formik.values, formik.setValues)}
                      error={contactTouched && Boolean(contactError)}
                      helperText={contactTouched && contactError}
                      required
                      InputLabelProps={{ required: false }}
                      size="small"
                      inputProps={{
                        'data-testid': 'indicated-channel-test',
                      }}
                    />
                  </FormControl>
                </Box>
              );
            })
          }
        </Box>
        <Box sx={{ gridColumn: 'span 24' }}>
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => addAssistanceChannel(formik.values, formik.setValues)}
            startIcon={<AddIcon />}
            sx={{ color: 'primary.main' }}
            weight="default"
            data-testid="add-channel-test"
          >
            {t('components.wizard.stepOne.form.addChannel')}
          </ButtonNaked>
        </Box>
      </Box>
    </Paper>
  );
};

export default ServiceConfig;
