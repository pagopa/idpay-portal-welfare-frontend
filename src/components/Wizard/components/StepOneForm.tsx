/* eslint-disable sonarjs/no-identical-functions */
import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  FormHelperText,
  Tooltip,
  Button,
  InputLabel,
  Select,
  Switch,
  styled,
  tooltipClasses,
  TooltipProps,
  MenuItem,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { /* FormikErrors, */ useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import _ from 'lodash';
import {
  setGeneralInfo,
  generalInfoSelector,
  additionalInfoSelector,
} from '../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS } from '../../../utils/constants';
import { saveGeneralInfoService } from '../../../services/intitativeService';
import { BeneficiaryTypeEnum } from '../../../utils/constants';
import { ChannelDTOTypeEnum } from '../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
const StepOneForm = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const dispatch = useDispatch();
  const formData = useSelector(generalInfoSelector);
  const formDataAddInfo = useSelector(additionalInfoSelector);
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => setIsChecked((previousState) => !previousState);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      dispatch(setGeneralInfo(formik.values));
    }
    setAction('');
  }, [action]);

  useEffect(() => {
    console.log(formDataAddInfo);
  }, [formDataAddInfo]);

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

  const validationSchemaToogleOn = Yup.object().shape({
    beneficiaryType: Yup.string().required(t('validation.required')),
    beneficiaryKnown: Yup.string().required(t('validation.required')),
    budget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer')),
    beneficiaryBudget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer'))
      .when('budget', (budget, schema) => {
        if (budget) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .integer(t('validation.integer'))
            .max(parseInt(budget, 10) - 1, t('validation.outBudgetPerPerson'));
        }
        return schema;
      }),
    rankingStartDate: Yup.date(),
    rankingEndDate: Yup.date().when('rankingStartDate', (rankingStartDate, schema) => {
      if (rankingStartDate) {
        return Yup.date()
          .min(rankingStartDate, t('validation.outJoinTo'))
          .required(t('validation.required'));
      }
      return schema;
    }),
    startDate: Yup.date()
      .required(t('validation.required'))
      .when('rankingEndDate', (rankingEndDate, schema) => {
        if (rankingEndDate) {
          return Yup.date()
            .min(rankingEndDate, t('validation.outSpendFrom'))
            .required(t('validation.required'));
        }
        return schema;
      }),
    endDate: Yup.date()
      .required(t('validation.required'))
      .when('startDate', (startDate, schema) => {
        if (startDate) {
          return Yup.date()
            .min(startDate, t('validation.outSpendTo'))
            .required(t('validation.required'));
        }
        return schema;
      }),

    serviceId: Yup.string().required(t('validation.required')),
  });

  const validationSchemaToogleOff = Yup.object().shape({
    beneficiaryType: Yup.string().required(t('validation.required')),
    beneficiaryKnown: Yup.string().required(t('validation.required')),
    budget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer')),
    beneficiaryBudget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer'))
      .when('budget', (budget, schema) => {
        if (budget) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .integer(t('validation.integer'))
            .max(parseInt(budget, 10) - 1, t('validation.outBudgetPerPerson'));
        }
        return schema;
      }),
    rankingStartDate: Yup.date(),
    rankingEndDate: Yup.date().when('rankingStartDate', (rankingStartDate, schema) => {
      if (rankingStartDate) {
        return Yup.date()
          .min(rankingStartDate, t('validation.outJoinTo'))
          .required(t('validation.required'));
      }
      return schema;
    }),
    startDate: Yup.date()
      .required(t('validation.required'))
      .when('rankingEndDate', (rankingEndDate, schema) => {
        if (rankingEndDate) {
          return Yup.date()
            .min(rankingEndDate, t('validation.outSpendFrom'))
            .required(t('validation.required'));
        }
        return schema;
      }),
    endDate: Yup.date()
      .required(t('validation.required'))
      .when('startDate', (startDate, schema) => {
        if (startDate) {
          return Yup.date()
            .min(startDate, t('validation.outSpendTo'))
            .required(t('validation.required'));
        }
        return schema;
      }),

    serviceName: Yup.string()
      .max(50, t('validation.maxServiceNameChar'))
      .required(t('validation.required')),
    argument: Yup.string()
      .max(50, t('validation.maxArgumentsChar'))
      .required(t('validation.required')),
    description: Yup.string().required(t('validation.required')),
    contact: Yup.string().required(t('validation.required')),
    ChannelDTO: Yup.string().when((schema) => {
      if (formik.values.contact === 'web') {
        return Yup.string().url(t('validation.webValid')).required(t('validation.web'));
      } else if (formik.values.contact === 'email') {
        return Yup.string().email(t('validation.emailValid')).required(t('validation.email'));
      } else if (formik.values.contact === 'mobile') {
        return Yup.string().max(10, t('validation.numTelValid')).required(t('validation.celNum'));
      }
      return schema;
    }),
    assistanceChannel: Yup.array().of(
      Yup.object().shape({
        // contact: Yup.string().required(t('validation.required')),
        // channelName: Yup.string().when((schema) => {
        //   if (contact === 'webUrl') {
        //     return Yup.string().url().required(t('validation.web'));
        //   }
        //   if (contact === 'email') {
        //     return Yup.string().email().required(t('validation.email'));
        //   }
        //   if (contact === 'numTel') {
        //     return Yup.string().max(10).required(t('validation.celNum'));
        //   }
        //   return schema;
        // }),
      })
    ),
  });

  const validationSchema = isChecked ? validationSchemaToogleOn : validationSchemaToogleOff;

  const parseValuesFormToInitiativeGeneralDTO = (values: any) => ({
    name: 'test',
    beneficiaryType:
      values.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG,
    beneficiaryKnown: values.beneficiaryKnown === 'true' ? true : false,
    budget: Number(values.budget),
    beneficiaryBudget: Number(values.beneficiaryBudget),
    rankingStartDate: new Date(values.rankingStartDate),
    rankingEndDate: new Date(values.rankingEndDate),
    startDate: new Date(values.startDate),
    endDate: new Date(values.endDate),
    serviceId: String(values.serviceId),
    serviceName: String(values.serviceName),
    argument: String(values.argument),
    description: String(values.description),
    contact: String(values.contact),
    ChannelDTO:
      values.ChannelDTO === 'web'
        ? ChannelDTOTypeEnum.web
        : values.ChannelDTO === 'email'
        ? ChannelDTOTypeEnum.email
        : values.ChannelDTO === 'mobile'
        ? ChannelDTOTypeEnum.mobile
        : null,
    ChannelArrayDTO: Array(values.ChannelArrayDTO),
  });

  const formik = useFormik({
    initialValues: {
      beneficiaryType: formData.beneficiaryType,
      beneficiaryKnown: formData.beneficiaryKnown,
      budget: formData.budget,
      beneficiaryBudget: formData.beneficiaryBudget,
      rankingStartDate: formData.rankingStartDate,
      rankingEndDate: formData.rankingEndDate,
      startDate: formData.startDate,
      endDate: formData.endDate,
      serviceId: formDataAddInfo.serviceId,
      serviceName: formDataAddInfo.serviceName,
      argument: formDataAddInfo.argument,
      description: formDataAddInfo.description,
      contact: formDataAddInfo.contact,
      ChannelDTO: formDataAddInfo.ChannelDTO,
      ChannelArrayDTO: [{ contact: '', ChannelDTO: '' }],
    },
    validateOnChange: true,
    validationSchema,
    onSubmit: (values) => {
      const formValuesParsed = parseValuesFormToInitiativeGeneralDTO(values);
      saveGeneralInfoService(formValuesParsed)
        .then((response) => {
          console.log(response);
          dispatch(setGeneralInfo(values));
          setCurrentStep(currentStep + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const serviceOptions = [
    {
      value: 'cartaCult',
      name: 'Carta Della Cultura',
    },
    {
      value: 'cartaGio',
      name: 'Carta Giovani Nazionale',
    },
  ];

  const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
    },
  });

  const contacts = [
    // {
    //   value: '',
    //   name: 'Contatto',
    // },
    {
      id: 1,
      value: 'web',
      name: 'Web URL',
    },
    {
      id: 2,
      value: 'email',
      name: 'Email',
    },
    {
      id: 3,
      value: 'mobile',
      name: 'Numero di telefono',
    },
  ];

  // const webUrl = contacts.find(({ name }) => name === 'Web URL');
  // const emailAddres = contacts.find(({ name }) => name === 'Email');
  // const cellNumber = contacts.find(({ name }) => name === 'Numero di telefono');

  const addAssistanceChannel = (values: any, setValues: any) => {
    const newAssistanceChannel = [...values.assistanceChannel, { contact: '', ChannelDTO: '' }];
    setValues({ ...values, assistanceChannel: newAssistanceChannel });
  };

  const deleteAssistanceChannel = (i: number, values: any, setValues: any, setTouched: any) => {
    const indexValueToRemove = i;
    // eslint-disable-next-line functional/immutable-data
    const newValues = values.assistanceChannel.filter((v: any, i: number) => {
      if (i !== indexValueToRemove) {
        return v;
      }
    });
    setValues({ ...values, assistanceChannel: newValues });
    setTouched({}, false);
  };

  const handleAssistanceChannelDTOChange = (
    e: any,
    i: number,
    values: any,
    setValues: any,
    setTouched: any
  ) => {
    const assistanceChannelChanged = [...values.assistanceChannel];
    // eslint-disable-next-line functional/immutable-data
    assistanceChannelChanged[i].ChannelDTO = e.target.value;
    setValues({ ...values, assistanceChannel: assistanceChannelChanged });
    setTouched({}, false);
  };

  // const getOptionErrorText = (
  //   errors: string | FormikErrors<{ contact: string; channelName: string }>
  // ) => {
  //   try {
  //     if (typeof errors === 'string') {
  //       return errors;
  //     } else {
  //       return (errors.contact && errors.channelName) || '';
  //     }
  //   } catch {
  //     return '';
  //   }
  // };

  const handleContactSelect = (
    e: any,
    setValues: any,
    index: number,
    values: {
      beneficiaryType: string;
      beneficiaryKnown: string;
      budget: string;
      beneficiaryBudget: string;
      rankingStartDate: string;
      rankingEndDate: string;
      startDate: string;
      endDate: string;
      serviceId: string;
      serviceName: string;
      argument: string;
      description: string;
      contact: string;
      ChannelDTO: string;
      ChannelArrayDTO: Array<{ contact: string; ChannelDTO: string }>;
    }
  ) => {
    const newValue = e.target.value;
    const newAssistanceChannel = values.ChannelArrayDTO.map((v, i) => {
      if (i === index) {
        return {
          contact: newValue,
          ChannelDTO: v.ChannelDTO,
        };
      } else {
        return { ...v };
      }
    });
    setValues({ ...values, assistanceChannel: newAssistanceChannel });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepOne.title')}</Typography>
        </Box>

        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="beneficiaryType--label"
          >
            {t('components.wizard.stepOne.form.beneficiaryType')}
          </FormLabel>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="beneficiaryType--label"
            name="beneficiaryType"
            value={formik.values.beneficiaryType}
            defaultValue="persons"
            onChange={(value) => formik.setFieldValue('beneficiaryType', value)}
            data-testid="beneficiary-type-test"
          >
            <FormControlLabel
              value="PF"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.person')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="families" // TBD
              control={<Radio />}
              label={t('components.wizard.stepOne.form.family')}
              disabled
            />
          </RadioGroup>
          <FormHelperText
            error={formik.touched.beneficiaryType && Boolean(formik.errors.beneficiaryType)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.beneficiaryType && formik.errors.beneficiaryType}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="beneficiaryKnown--label"
          >
            {t('components.wizard.stepOne.form.beneficiaryKnown')}
          </FormLabel>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="beneficiaryKnown--label"
            name="beneficiaryKnown"
            value={formik.values.beneficiaryKnown}
            defaultValue={formik.values.beneficiaryKnown}
            onChange={(e) => formik.setFieldValue('beneficiaryKnown', e.target.value, false)}
            data-testid="beneficiary-known-test"
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.taxCodeList')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="false"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.manualSelection')}
            />
          </RadioGroup>
          <FormHelperText
            error={formik.touched.beneficiaryKnown && Boolean(formik.errors.beneficiaryKnown)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.beneficiaryKnown && formik.errors.beneficiaryKnown}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"budgetTitle budgetTitle . ." 
                                  "budget beneficiaryBudget . budgetPerPersonCalc"`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'budgetTitle' }}>
            {t('components.wizard.stepOne.form.budgetTitle')}
          </FormLabel>
          <TextField
            sx={{ gridArea: 'budget' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepOne.form.budget')}
            placeholder={t('components.wizard.stepOne.form.budget')}
            /* needed by getByTextLabel */
            aria-labelledby={t('components.wizard.stepOne.form.budget')}
            id={t('components.wizard.stepOne.form.budget')}
            /*  */
            name="budget"
            value={formik.values.budget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.budget && Boolean(formik.errors.budget)}
            helperText={formik.touched.budget && formik.errors.budget}
            data-testid="budget-test"
            required
          />
          <TextField
            sx={{ gridArea: 'beneficiaryBudget' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepOne.form.beneficiaryBudget')}
            placeholder={t('components.wizard.stepOne.form.beneficiaryBudget')}
            /* needed by getByTextLbel */
            aria-labelledby={t('components.wizard.stepOne.form.beneficiaryBudget')}
            id={t('components.wizard.stepOne.form.beneficiaryBudget')}
            /*  */
            name="beneficiaryBudget"
            value={formik.values.beneficiaryBudget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.beneficiaryBudget && Boolean(formik.errors.beneficiaryBudget)}
            helperText={formik.touched.beneficiaryBudget && formik.errors.beneficiaryBudget}
            data-testid="beneficiary-budget-test"
            required
          />
          {!isNaN(peopleReached(formik.values.budget, formik.values.beneficiaryBudget)) && (
            <Box
              sx={{
                gridArea: 'budgetPerPersonCalc',
                justifySelf: 'end',
                alignSelf: 'center',
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                backgroundColor: grey[100],
                borderRadius: 2,
                py: 2,
              }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ display: 'flex', alignSelf: 'center' }}
              >
                {t('components.wizard.stepOne.form.reachedUsers')}
              </Typography>
              <Typography
                variant="subtitle2"
                component="span"
                sx={{ display: 'flex', alignSelf: 'center' }}
              >
                {peopleReached(formik.values.budget, formik.values.beneficiaryBudget)}
              </Typography>
              <Tooltip
                title={t('components.wizard.stepOne.form.reachedUsersTooltip')}
                placement="top"
                arrow
              >
                <InfoOutlinedIcon color="primary" />
              </Tooltip>
            </Box>
          )}
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"timeRangeRankingTitle timeRangeRankingTitle timeRangeRankingTitle timeRangeRankingTitle" 
                                  "rankingStartDate rankingEndDate . . "`,
            py: 2,
          }}
        >
          <FormLabel
            sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeRankingTitle' }}
          >
            {t('components.wizard.stepOne.form.timeRangeRankingTitle')}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.rankingStartDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.rankingStartDate}
              onChange={(value) => formik.setFieldValue('rankingStartDate', value)}
              minDate={new Date()}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="rankingStartDate"
                  data-testid="ranking-start-date-test"
                  name="rankingStartDate"
                  type="date"
                  sx={{ gridArea: 'rankingStartDate' }}
                  error={formik.touched.rankingStartDate && Boolean(formik.errors.rankingStartDate)}
                  helperText={formik.touched.rankingStartDate && formik.errors.rankingStartDate}
                  required
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.rankingEndDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.rankingEndDate}
              onChange={(value) => formik.setFieldValue('rankingEndDate', value)}
              minDate={addDays(new Date(formik.values.rankingStartDate), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="rankingEndDate"
                  data-testid="ranking-end-date-test"
                  name="rankingEndDate"
                  type="date"
                  sx={{ gridArea: 'rankingEndDate' }}
                  error={formik.touched.rankingEndDate && Boolean(formik.errors.rankingEndDate)}
                  helperText={formik.touched.rankingEndDate && formik.errors.rankingEndDate}
                  required
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"timeRangeTitle timeRangeTitle timeRangeTitle timeRangeTitle" 
                                  "startDate endDate . . "`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeTitle' }}>
            {t('components.wizard.stepOne.form.timeRangeTitle')}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.startDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue('startDate', value)}
              minDate={addDays(new Date(formik.values.rankingEndDate), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="startDate"
                  data-testid="start-date-test"
                  name="startDate"
                  type="date"
                  sx={{ gridArea: 'startDate' }}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.endDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue('endDate', value)}
              minDate={addDays(new Date(formik.values.startDate), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="endDate"
                  data-testid="end-date-test"
                  name="endDate"
                  type="date"
                  sx={{ gridArea: 'endDate' }}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
      </Paper>

      <Paper sx={{ mt: 5 }}>
        <Box sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
          <Box sx={{ py: 3 }}>
            <Typography variant="h6">
              {t('components.wizard.stepOne.form.otherInfo.title')}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body1">
                {t('components.wizard.stepOne.form.otherInfo.subTitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Button size="small" href="" sx={{ p: 0 }}>
                {t('components.wizard.common.links.findOut')}
              </Button>
            </Box>
          </Box>

          <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', py: 2 }}>
            <FormControlLabel
              sx={{ gridColumn: 'span 1' }}
              control={<Switch value={isChecked} onChange={toggleSwitch} />}
              label={t('components.wizard.stepOne.form.otherInfo.deliverInitiative')}
            />
          </FormControl>

          <FormControl>
            {isChecked ? (
              <>
                <FormControl
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}
                >
                  <InputLabel sx={{ mt: 2 }}>
                    {t('components.wizard.stepOne.form.otherInfo.serviceSelect')}
                  </InputLabel>
                  <Select
                    label={t('components.wizard.stepOne.form.otherInfo.serviceSelect')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.serviceSelect')}
                    sx={{ gridColumn: 'span 9' }}
                    onChange={(e) => formik.setFieldValue('serviceId', e.target.value)}
                    error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                  >
                    {serviceOptions.map(({ name, value }, index) => (
                      <MenuItem key={index} value={value}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                    sx={{ gridColumn: 'span 12' }}
                  >
                    {formik.touched.serviceId && formik.errors.serviceId}
                  </FormHelperText>
                </FormControl>
              </>
            ) : (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', gridColumn: 'span 2' }}>
                    {t('components.wizard.stepOne.form.otherInfo.description')}
                  </Typography>
                </Box>
                <FormControl
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}
                >
                  <TextField
                    label={t('components.wizard.stepOne.form.otherInfo.serviceName')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.serviceName')}
                    sx={{ gridColumn: 'span 6', pr: 4 }}
                    value={formik.values.serviceName}
                    onChange={(e) => formik.setFieldValue('serviceName', e.target.value)}
                    error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
                    helperText={formik.touched.serviceName && formik.errors.serviceName}
                  />
                  <TextField
                    label={t('components.wizard.stepOne.form.otherInfo.argument')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.argument')}
                    sx={{ gridColumn: 'span 6' }}
                    value={formik.values.argument}
                    onChange={(e) => formik.setFieldValue('argument', e.target.value)}
                    error={formik.touched.argument && Boolean(formik.errors.argument)}
                    helperText={formik.touched.argument && formik.errors.argument}
                  />
                  <TextField
                    sx={{ gridColumn: 'span 12', mt: 4 }}
                    multiline
                    maxRows={4}
                    label={t('components.wizard.stepOne.form.otherInfo.description')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.description')}
                    value={formik.values.description}
                    onChange={(e) => formik.setFieldValue('description', e.target.value)}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </FormControl>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', gridColumn: 'span 2' }}>
                    {t('components.wizard.stepOne.form.otherInfo.helpChannels')}
                  </Typography>
                  <NoMaxWidthTooltip
                    title={t('components.wizard.stepOne.form.otherInfo.helpChannelsTooltip')}
                    placement="right"
                    arrow
                  >
                    <InfoOutlinedIcon color="primary" />
                  </NoMaxWidthTooltip>
                </Box>
                <FormControl
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(24, 1fr)',
                    py: 2,
                    gridTemplateAreas: `". Contact Contact Contact Contact Channel Channel Channel Channel Channel Channel Channel Channel Channel Channel Channel Channel . . . . . . . "`,
                  }}
                >
                  <InputLabel sx={{ ml: 6, mt: 2 }}>
                    {t('components.wizard.stepOne.form.otherInfo.contact')}
                  </InputLabel>
                  <Select
                    name="contact"
                    label={t('components.wizard.stepOne.form.otherInfo.contact')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.contact')}
                    value={formik.values.contact}
                    sx={{ gridColumn: 'span 4', pr: 4, gridArea: 'Contact' }}
                    onChange={(e) => formik.handleChange(e)}
                  >
                    {
                      // eslint-disable-next-line sonarjs/no-identical-functions
                      contacts.map(({ name, value }, index) => (
                        <MenuItem key={index} value={value}>
                          {name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                  <FormHelperText
                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                    sx={{ gridColumn: 'span 12', ml: 8 }}
                  >
                    {formik.touched.contact && formik.errors.contact}
                  </FormHelperText>
                  <TextField
                    variant="outlined"
                    label={t('components.wizard.stepOne.form.otherInfo.indicatesChannel')}
                    sx={{ gridColumn: 'span 12', ml: 4, gridArea: 'Channel' }}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.indicatesChannel')}
                    value={formik.values.ChannelDTO}
                    onChange={(e) => formik.setFieldValue('ChannelDTO', e.target.value)}
                    error={formik.touched.ChannelDTO && Boolean(formik.errors.ChannelDTO)}
                    helperText={formik.touched.ChannelDTO && formik.errors.ChannelDTO}
                  />
                </FormControl>
                {formik.values.ChannelArrayDTO.map((o, i) => {
                  // const assistanceErrors =
                  //   formik.errors.assistanceChannel?.length && formik.errors?.assistanceChannel[i];
                  // const assistanceTouchedChannel =
                  //   (formik.touched.assistanceChannel?.length &&
                  //     formik.touched.assistanceChannel[i].channelName) ||
                  //   false;
                  // const assistanceTouchedContact =
                  //   (formik.touched.assistanceChannel?.length &&
                  //     formik.touched.assistanceChannel[i].contact) ||
                  //   false;

                  console.log(/* '' */);

                  return (
                    <Box key={i}>
                      <FormControl
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(24, 1fr)',
                          py: 2,
                          gridTemplateAreas: `"Cancel Contact Contact Contact Contact Channel Channel Channel Channel Channel Channel Channel Channel Channel Channel Channel Channel . . . . . . ."`,
                        }}
                      >
                        <RemoveCircleOutlineIcon
                          color="error"
                          sx={{
                            cursor: 'pointer',
                            alignItems: 'start',
                            mt: 2,
                            fontSize: 30,
                            gridColumn: 'span 1',
                            gridArea: 'Cancel',
                          }}
                          onClick={() =>
                            deleteAssistanceChannel(
                              i,
                              formik.values,
                              formik.setValues,
                              formik.setTouched
                            )
                          }
                        />
                        <InputLabel sx={{ ml: 6, mt: 2 }}>
                          {t('components.wizard.stepOne.form.otherInfo.contact')}
                        </InputLabel>

                        <Select
                          name={`contact_${i}`}
                          label={t('components.wizard.stepOne.form.otherInfo.contact')}
                          value={o.contact}
                          placeholder={t('components.wizard.stepOne.form.otherInfo.contact')}
                          sx={{ gridColumn: 'span 4', pr: 5, gridArea: 'Contact' }}
                          onChange={(e) =>
                            handleContactSelect(e, formik.setValues, i, formik.values)
                          }
                        >
                          {
                            // eslint-disable-next-line sonarjs/no-identical-functions
                            contacts.map(({ name, value }, id) => (
                              <MenuItem key={id} value={value}>
                                {name}
                              </MenuItem>
                            ))
                          }
                        </Select>
                        {/* <FormHelperText
                          error={assistanceTouchedContact && Boolean(assistanceErrors)}
                          sx={{ gridColumn: 'span 12' }}
                        >
                          {assistanceTouchedContact && assistanceErrors}
                        </FormHelperText> */}
                        <TextField
                          id={`assistanceChannel[${i}].ChannelDTO}`}
                          name={`assistanceChannel[${i}].ChannelDTO}`}
                          variant="outlined"
                          label={t('components.wizard.stepOne.form.otherInfo.indicatesChannel')}
                          sx={{ gridColumn: 'span 12', ml: 4, gridArea: 'Channel' }}
                          placeholder={t(
                            'components.wizard.stepOne.form.otherInfo.indicatesChannel'
                          )}
                          value={formik.values.ChannelArrayDTO[i].ChannelDTO}
                          onChange={(e) =>
                            handleAssistanceChannelDTOChange(
                              e,
                              i,
                              formik.values,
                              formik.setValues,
                              formik.setTouched
                            )
                          }
                          /* error={assistanceTouchedChannel && Boolean(assistanceErrors)}
                          helperText={assistanceTouchedChannel && assistanceErrors} */
                        />
                      </FormControl>
                    </Box>
                  );
                })}
                <FormControl
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}
                >
                  <Button
                    startIcon={<AddIcon />}
                    color="primary"
                    sx={{ gridColumn: 'span 3' }}
                    size="large"
                    onClick={() => addAssistanceChannel(formik.values, formik.setValues)}
                  >
                    {t('components.wizard.stepOne.form.otherInfo.addChannel')}
                  </Button>
                </FormControl>
              </>
            )}
          </FormControl>
        </Box>
      </Paper>
    </form>
  );
};

export default StepOneForm;
