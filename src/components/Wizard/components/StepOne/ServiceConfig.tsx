import {
  Box,
  Button,
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
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import {
  createInitiativeServiceInfo,
  updateInitiativeServiceInfo,
} from '../../../../services/intitativeService';
import {
  initiativeIdSelector,
  additionalInfoSelector,
  setInitiativeId,
  setAdditionalInfo,
} from '../../../../redux/slices/initiativeSlice';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { ServiceScopeEnum } from '../../../../api/generated/initiative/InitiativeAdditionalDTO';
import { contacts, parseDataToSend } from './helpers';
import InitiativeNotOnIOModal from './InitiativeNotOnIOModal';

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

  const handleCloseInitiativeNotOnIOModal = () => setOpenInitiativeNotOnIOModal(false);

  const handleOpenInitiativeNotOnIOModal = () => setOpenInitiativeNotOnIOModal(true);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    }
    setAction('');
  }, [action]);

  const validationSchema = Yup.object().shape({
    initiativeOnIO: Yup.boolean(),
    serviceName: Yup.string().required(t('validation.required')),
    serviceArea: Yup.string().required(t('validation.required')),
    serviceDescription: Yup.string().required(t('validation.required')),
    privacyPolicyUrl: Yup.string()
      .required(t('validation.required'))
      .matches(
        /^(https:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
        t('validation.web')
      ),
    termsAndConditions: Yup.string()
      .required(t('validation.required'))
      .matches(
        /^(https:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
        t('validation.web')
      ),
    assistanceChannels: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required(t('validation.required')),
        contact: Yup.string()
          .required(t('validation.required'))
          .when('type', (type, schema) => {
            if (type && type === 'web') {
              return Yup.string()
                .required(t('validation.required'))
                .matches(
                  /^(https:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                  t('validation.webValid')
                );
            }
            if (type && type === 'email') {
              return Yup.string()
                .required(t('validation.required'))
                .email(t('validation.emailValid'));
            }
            if (type && type === 'mobile') {
              return Yup.string()
                .required(t('validation.required'))
                .matches(/^\s*[0-9]{2,4}-?\/?\s?[0-9]{1,10}\s*$/, t('validation.celNumValid'));
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
    validateOnMount: true,
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

  const sendValues = (
    values: any,
    currentStep: number,
    setCurrentStep: Dispatch<SetStateAction<number>>
  ) => {
    const data = parseDataToSend(values);
    dispatch(setAdditionalInfo(values));
    if (!initiativeId) {
      createInitiativeServiceInfo(data)
        .then((res) => {
          dispatch(setInitiativeId(res?.initiativeId));
          setCurrentStep(currentStep + 1);
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
        });
    } else {
      updateInitiativeServiceInfo(initiativeId, data)
        .then((_res) => {
          setCurrentStep(currentStep + 1);
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
        });
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
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepOne.title')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">{t('components.wizard.stepOne.subtitle')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Button size="small" sx={{ p: 0 }}>
            {t('components.wizard.common.links.findOut')}
          </Button>
        </Box>
      </Box>

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
              data-testid="serviceName-test"
            />
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 12' }} size="small">
            <InputLabel>{t('components.wizard.stepOne.form.serviceArea')}</InputLabel>
            <Select
              id="serviceArea"
              data-testid="service-area-select"
              name="serviceArea"
              label={t('components.wizard.stepOne.form.serviceArea')}
              placeholder={t('components.wizard.stepOne.form.serviceArea')}
              onChange={async (e) => {
                await formik.setFieldValue('serviceArea', e.target.value);
              }}
              error={formik.touched.serviceArea && Boolean(formik.errors.serviceArea)}
              value={formik.values.serviceArea}
            >
              <MenuItem value={ServiceScopeEnum.LOCAL} data-testid="serviceScopeLocal-test">
                {t('components.wizard.stepOne.form.serviceScopeLocal')}
              </MenuItem>
              <MenuItem value={ServiceScopeEnum.NATIONAL} data-testid="serviceScopeNational-test">
                {t('components.wizard.stepOne.form.serviceScopeNational')}
              </MenuItem>
            </Select>
            <FormHelperText
              error={formik.touched.serviceArea && Boolean(formik.errors.serviceArea)}
            >
              {formik.touched.serviceArea && formik.errors.serviceArea}
            </FormHelperText>
            0
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
              data-testid="serviceDescription-test"
              role="input"
              value={formik.values.serviceDescription}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.serviceDescription && Boolean(formik.errors.serviceDescription)}
              helperText={formik.touched.serviceDescription && formik.errors.serviceDescription}
              required={true}
              InputLabelProps={{ required: false }}
              size="small"
            />
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
              data-testid="privacyPolicyUrl-test"
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
              data-testid="termsAndConditions-test"
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
          {formik.values.assistanceChannels.map((_o, i) => {
            const channelErrors =
              (formik.errors.assistanceChannels?.length && formik.errors.assistanceChannels[i]) ||
              {};
            const channelTouched =
              (formik.touched.assistanceChannels?.length && formik.touched.assistanceChannels[i]) ||
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
                  <Box sx={{ display: 'grid', gridColumn: 'span 1', alignItems: 'center' }}>
                    <RemoveCircleOutlineIcon
                      color="error"
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={() => deleteAssistanceChannel(i, formik.values, formik.setValues)}
                      id={`remove_assistanceChannel_${i}`}
                    />
                  </Box>
                )}
                <FormControl
                  sx={{ gridColumn: 'span 5' }}
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
                  >
                    {contacts.map(({ name, value }, id) => (
                      <MenuItem key={id} value={value}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{typeTouched && typeError}</FormHelperText>
                </FormControl>
                <FormControl sx={{ gridColumn: 'span 10' }}>
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
                  />
                </FormControl>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ gridColumn: 'span 24' }}>
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => addAssistanceChannel(formik.values, formik.setValues)}
            startIcon={<AddIcon />}
            sx={{ color: 'primary.main' }}
            weight="default"
          >
            {t('components.wizard.stepOne.form.addChannel')}
          </ButtonNaked>
        </Box>
      </Box>
    </Paper>
  );
};

export default ServiceConfig;
