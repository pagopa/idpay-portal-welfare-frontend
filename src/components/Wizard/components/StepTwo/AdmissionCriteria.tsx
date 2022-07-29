import { Box, Button, Paper, Typography } from '@mui/material';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useSelector } from 'react-redux';
import { AdmissionCriteriaModel } from '../../../../model/AdmissionCriteria';
import { fetchAdmissionCriteria } from '../../../../services/admissionCriteriaService';
import {
  initiativeIdSelector,
  beneficiaryRuleSelector,
} from '../../../../redux/slices/initiativeSlice';
import { putBeneficiaryRuleService } from '../../../../services/intitativeService';
import {
  SelfDeclarationCriteriaBoolItem,
  SelfDeclarationCriteriaMultiItem,
} from '../../../../model/Initiative';
import { WIZARD_ACTIONS } from '../../../../utils/constants';

import AdmissionCriteriaModal from './AdmissionCriteriaModal';
import AdmissionCriteriaItem from './AdmissionCriteriaItem';
import ManualCriteriaItem from './ManualCriteriaItem';

type Props = {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const AdmissionCriteria = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [criteria, setCriteria] = useState(Array<AdmissionCriteriaModel>);
  const [criteriaFetched, setCriteriaFetched] = useState(false);
  const [criteriaChanged, setCriteriaChanged] = useState(false);
  const [criteriaToRender, setCriteriaToRender] = useState(
    Array<{
      code: string | undefined;
      field: string | undefined;
      authority: string | undefined;
    }>
  );
  const [manualCriteriaNumber, setManualCriteriaNumber] = useState(0);
  const [manualCriteriaToRender, setManualCriteriaToRender] = useState(
    Array<SelfDeclarationCriteriaMultiItem | SelfDeclarationCriteriaBoolItem>
  );
  // const [criteriaToSubmit, setCriteriaToSubmit] = useState(
  //   Array<{ code: string | undefined; dispatched: boolean }>
  // );
  const [dateOfBirthCriteria, setDateOfBirthCriteria] = useState<{
    code?: string | undefined;
    field?: string | undefined;
    operator?: string | undefined;
    value?: string | undefined;
  }>({ code: 'BIRTHDATE', field: 'year', operator: 'EQ', value: '' });

  const [residencyCriteria, setResidencyCriteria] = useState<{
    code?: string | undefined;
    field?: string | undefined;
    operator?: string | undefined;
    value?: string | undefined;
  }>({ code: 'RESIDENCE', field: 'city', operator: 'EQ', value: '' });

  const [iseeCriteria, setIseeCriteria] = useState<{
    code?: string | undefined;
    field?: string | undefined;
    operator?: string | undefined;
    value?: string | undefined;
  }>({ code: 'ISEE', field: 'ISEE', operator: 'EQ', value: '' });

  const beneficiaryRule = useSelector(beneficiaryRuleSelector);
  const initiativeId = useSelector(initiativeIdSelector);

  useEffect(() => {
    fetchAdmissionCriteria()
      .then((response) => {
        setCriteria([...response]);
        setCriteriaFetched(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (criteriaFetched) {
      const { automatedCriteria, selfDeclarationCriteria } = beneficiaryRule;
      // const criteriaToSubmitP: Array<{ code: string | undefined; dispatched: boolean }> = [];

      if (automatedCriteria.length > 0) {
        const newCriteriaChecked = [...criteria];
        newCriteriaChecked.forEach((c) => {
          // eslint-disable-next-line functional/no-let
          let i = 0;
          while (i < automatedCriteria.length) {
            if (c.code === automatedCriteria[i].code) {
              // eslint-disable-next-line functional/immutable-data
              c.checked = true;
            }
            i++;
          }
        });
        const dateOfBirthValues = automatedCriteria.filter((a) => a.code === 'BIRTHDATE');
        setDateOfBirthCriteria({ ...dateOfBirthValues[0] });
        const residencyValues = automatedCriteria.filter((a) => a.code === 'RESIDENCE');
        setResidencyCriteria({ ...residencyValues[0] });
        const iseeValues = automatedCriteria.filter((a) => a.code === 'ISEE');
        setIseeCriteria({ ...iseeValues[0] });
        setCriteria([...newCriteriaChecked]);
        setCriteriaChanged((prevCriteriaChanged) => !prevCriteriaChanged);
        // automatedCriteria.forEach((a) => {
        //   // eslint-disable-next-line functional/immutable-data
        //   criteriaToSubmitP.push({ code: a.code, dispatched: false });
        // });
      }

      if (selfDeclarationCriteria.length > 0) {
        const selfDeclarationCriteriaNumber = selfDeclarationCriteria.length;
        setManualCriteriaNumber(selfDeclarationCriteriaNumber - 1);
        setManualCriteriaToRender([...selfDeclarationCriteria]);
        // TODO handle and check criteria multi
        // selfDeclarationCriteria.forEach((s) => {
        //   const codeNumber = typeof s.code === 'string' ? parseInt(s.code, 10) - 1 : 0;
        //   const code = codeNumber.toString();
        //   // eslint-disable-next-line functional/immutable-data
        //   criteriaToSubmitP.push({ code: `manual_${code}`, dispatched: false });
        // });
      }

      // setCriteriaToSubmit([...criteriaToSubmitP]);
    }
  }, [beneficiaryRule, criteriaFetched]);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      const { automatedCriteria, selfDeclarationCriteria } = beneficiaryRule;
      // eslint-disable-next-line functional/no-let
      let automatedCriteriaValid = true;
      if (automatedCriteria.length > 0) {
        automatedCriteria.forEach((a) => {
          automatedCriteriaValid =
            automatedCriteriaValid &&
            a.authority !== '' &&
            a.code !== '' &&
            a.field !== '' &&
            a.operator !== '' &&
            a.value !== '';
        });
      }
      // eslint-disable-next-line functional/no-let
      let selfDeclarationCriteriaValid = true;
      if (selfDeclarationCriteria.length > 0) {
        selfDeclarationCriteria.forEach((s) => {
          selfDeclarationCriteriaValid =
            selfDeclarationCriteriaValid &&
            // eslint-disable-next-line no-underscore-dangle
            s._type !== '' &&
            s.code !== '' &&
            s.description !== '';
        });
      }
      // eslint-disable-next-line functional/no-let
      let formValid = automatedCriteriaValid && selfDeclarationCriteriaValid;
      if (automatedCriteria.length === 0 && selfDeclarationCriteria.length === 0) {
        formValid = false;
      }

      if (formValid && typeof initiativeId === 'string') {
        putBeneficiaryRuleService(initiativeId, beneficiaryRule)
          .then((_response) => setCurrentStep(currentStep + 1))
          .catch((error) => console.log(error));
      }
    }
    setAction('');
  }, [action, beneficiaryRule]);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleCriteriaAdded = () => {
    setOpenModal(false);
    setCriteriaChanged(!criteriaChanged);
    setDateOfBirthCriteria({
      code: 'BIRTHDATE',
      field: 'year',
      operator: 'EQ',
      value: dateOfBirthCriteria.value,
    });
    setResidencyCriteria({
      code: 'RESIDENCE',
      field: 'city',
      operator: 'EQ',
      value: residencyCriteria.value,
    });
    setIseeCriteria({ code: 'ISEE', field: 'ISEE', operator: 'EQ', value: iseeCriteria.value });
  };

  const handleCriteriaRemoved = (e: any) => {
    const elementIdToDelete = e.target.dataset.id;
    const newCriteria = criteria.map((c) => {
      if (c.code === elementIdToDelete) {
        return { ...c, checked: false };
      } else {
        return { ...c };
      }
    });
    setCriteria([...newCriteria]);
    const newCriteriaToRender: Array<{
      code: string | undefined;
      field: string | undefined;
      authority: string | undefined;
    }> = [];
    criteriaToRender.forEach((c) => {
      if (c.code !== elementIdToDelete) {
        // eslint-disable-next-line functional/immutable-data
        newCriteriaToRender.push(c);
      }
    });
    setCriteriaToRender([...newCriteriaToRender]);
    setCriteriaChanged(!criteriaChanged);
    // const oldCriteriaToSubmit = [...criteriaToSubmit];
    // const newCriteriaToSubmit = oldCriteriaToSubmit.filter((oC) => oC.code !== elementIdToDelete);
    // setCriteriaToSubmit([...newCriteriaToSubmit]);
  };

  const handleManualCriteriaAdded = () => {
    setManualCriteriaNumber((prevManualCriteriaNumber) => prevManualCriteriaNumber + 1);
    setManualCriteriaToRender((prevManualCriteriaToRender) => [
      ...prevManualCriteriaToRender,
      {
        _type: 'boolean',
        description: '',
        value: true,
        code: manualCriteriaNumber.toString(),
      },
    ]);
    // setCriteriaToSubmit((prevCriteriaToSubmit) => [
    //   ...prevCriteriaToSubmit,
    //   { code: `manual_${manualCriteriaNumber}`, dispatched: false },
    // ]);
  };

  const handleManualCriteriaRemoved = (e: any) => {
    if (typeof e.target.dataset.id !== undefined) {
      const elementIdToDelete = parseInt(e.target.dataset.id, 10);
      const newManualCriteriaToRender: Array<
        SelfDeclarationCriteriaMultiItem | SelfDeclarationCriteriaBoolItem
      > = [];
      manualCriteriaToRender.forEach((m) => {
        if (m.code !== elementIdToDelete.toString()) {
          // eslint-disable-next-line functional/immutable-data
          newManualCriteriaToRender.push(m);
        }
      });
      setManualCriteriaToRender([...newManualCriteriaToRender]);
      // const newCriteriaToSubmit = criteriaToSubmit.filter(
      //   (cS) => cS.code !== `manual_${elementIdToDelete}`
      // );
      // setCriteriaToSubmit([...newCriteriaToSubmit]);
    }
  };

  useEffect(() => {
    /* eslint-disable functional/no-let */
    criteria.forEach((c) => {
      let i = 0;
      let notPrinted = true;
      while (notPrinted === true && i < criteriaToRender.length) {
        notPrinted = c.code !== criteriaToRender[i].code ? true : false;
        i++;
      }
      if (notPrinted === true && c.checked === true) {
        // eslint-disable-next-line functional/immutable-data
        setCriteriaToRender((prevCriteriaToRender) => [
          ...prevCriteriaToRender,
          {
            code: c.code,
            field: c.field,
            authority: c.authority,
          },
        ]);
      }
    });
  }, [criteriaChanged]);

  // useEffect(() => {
  //   /* eslint-disable functional/no-let */
  //   criteria.forEach((c) => {
  //     let i = 0;
  //     let notInsubmitList = true;
  //     while (notInsubmitList === true && i < criteriaToSubmit.length) {
  //       notInsubmitList = c.code !== criteriaToSubmit[i].code ? true : false;
  //       i++;
  //     }
  //     if (notInsubmitList === true && c.checked === true) {
  //       setCriteriaToSubmit((prevCriteriaToSubmit) => [
  //         ...prevCriteriaToSubmit,
  //         { code: c.code, dispatched: false },
  //       ]);
  //     }
  //   });
  // }, [criteriaChanged]);

  // useEffect(() => {
  //   /* eslint-disable functional/no-let */
  //   let serviceCanBeCalled = true;
  //   if (criteriaToSubmit.length) {
  //     criteriaToSubmit.forEach((element) => {
  //       serviceCanBeCalled = serviceCanBeCalled && element.dispatched;
  //     });
  //   } else {
  //     serviceCanBeCalled = false;
  //   }
  //   if (serviceCanBeCalled && typeof initiativeId === 'string') {
  //     putBeneficiaryRuleService(initiativeId, beneficiaryRule)
  //       .then((_response) => setCurrentStep(currentStep + 1))
  //       .catch((error) => console.log(error));
  //   }
  // }, [criteriaToSubmit]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepTwo.chooseCriteria.title')}</Typography>
      </Box>
      <form>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="body1">
              {t('components.wizard.stepTwo.chooseCriteria.subtitle')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Button size="small" href="" sx={{ p: 0 }}>
              {t('components.wizard.common.links.findOut')}
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"criteriaButton addButton . . "`,
            py: 2,
            mb: 8,
          }}
        >
          <Button
            variant="contained"
            sx={{ gridArea: 'criteriaButton' }}
            startIcon={<ListAltIcon />}
            onClick={handleOpenModal}
          >
            {t('components.wizard.stepTwo.chooseCriteria.browse')}
          </Button>
          <AdmissionCriteriaModal
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            handleCriteriaAdded={handleCriteriaAdded}
            criteria={criteria}
            setCriteria={setCriteria}
          />
          <Button variant="text" sx={{ gridArea: 'addButton' }} onClick={handleManualCriteriaAdded}>
            {t('components.wizard.stepTwo.chooseCriteria.addManually')}
          </Button>
        </Box>
        <Box>
          {criteriaToRender.map((c) => (
            <AdmissionCriteriaItem
              key={c.code}
              code={c.code}
              field={c.field}
              authority={c.authority}
              dateOfBirthCriteria={dateOfBirthCriteria}
              setDateOfBirthCriteria={setDateOfBirthCriteria}
              residencyCriteria={residencyCriteria}
              setResidencyCriteria={setResidencyCriteria}
              iseeCriteria={iseeCriteria}
              setIseeCriteria={setIseeCriteria}
              handleCriteriaRemoved={handleCriteriaRemoved}
              action={action}
              setAction={setAction}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              // criteriaToSubmit={criteriaToSubmit}
              // setCriteriaToSubmit={setCriteriaToSubmit}
            />
          ))}
        </Box>
        <Box>
          {manualCriteriaToRender.map((m, i) => (
            <ManualCriteriaItem
              key={m.code}
              code={m.code || i}
              data={m}
              name={`${t('components.wizard.stepTwo.chooseCriteria.form.manual')} ${m.code}`}
              handleCriteriaRemoved={handleManualCriteriaRemoved}
              action={action}
              setAction={setAction}
              // criteriaToSubmit={criteriaToSubmit}
              // setCriteriaToSubmit={setCriteriaToSubmit}
            />
          ))}
        </Box>
      </form>
    </Paper>
  );
};

export default AdmissionCriteria;
