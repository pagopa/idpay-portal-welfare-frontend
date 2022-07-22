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
import {
  patchBeneficiaryRuleService,
  patchGeneralInfo,
} from '../../../../services/intitativeService';
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
  const [criteriaChanged, setCriteriaChanged] = useState(false);
  const [criteriaToRender, setCriteriaToRender] = useState(
    Array<{ code: string; field: string; authority: string }>
  );
  const [manualCriteriaNumber, setManualCriteriaNumber] = useState(0);
  const [manualCriteriaToRender, setManualCriteriaToRender] = useState(Array<number>);
  const [criteriaToSubmit, setCriteriaToSubmit] = useState(
    Array<{ code: string; dispatched: boolean }>
  );
  const beneficiaryRule = useSelector(beneficiaryRuleSelector);
  const initiativeId = useSelector(initiativeIdSelector);

  useEffect(() => {
    fetchAdmissionCriteria()
      .then((response) => {
        setCriteria([...response]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // console.log(action);
  }, [action]);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleCriteriaAdded = () => {
    setOpenModal(false);
    setCriteriaChanged(!criteriaChanged);
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
    criteriaToRender.forEach((c, index) => {
      if (c.code === elementIdToDelete) {
        // eslint-disable-next-line functional/immutable-data
        setCriteriaToRender([...criteriaToRender.splice(index, 0)]);
        setCriteriaChanged(!criteriaChanged);
      }
    });
    const oldCriteriaToSubmit = [...criteriaToSubmit];
    const newCriteriaToSubmit = oldCriteriaToSubmit.filter((oC) => oC.code !== elementIdToDelete);
    setCriteriaToSubmit([...newCriteriaToSubmit]);
  };

  const handleManualCriteriaAdded = () => {
    setManualCriteriaNumber((prevManualCriteriaNumber) => prevManualCriteriaNumber + 1);
    setManualCriteriaToRender((prevManualCriteriaToRender) => [
      ...prevManualCriteriaToRender,
      manualCriteriaNumber,
    ]);
    setCriteriaToSubmit((prevCriteriaToSubmit) => [
      ...prevCriteriaToSubmit,
      { code: `manual_${manualCriteriaNumber}`, dispatched: false },
    ]);
  };

  const handleManualCriteriaRemoved = (e: any) => {
    if (typeof e.target.dataset.id !== undefined) {
      const elementIdToDelete = parseInt(e.target.dataset.id, 10);
      const newManualCriteriaToRender: Array<number> = [];
      manualCriteriaToRender.forEach((m) => {
        if (m !== elementIdToDelete) {
          // eslint-disable-next-line functional/immutable-data
          newManualCriteriaToRender.push(m);
        }
      });
      setManualCriteriaToRender([...newManualCriteriaToRender]);
      const newCriteriaToSubmit = criteriaToSubmit.filter(
        (cS) => cS.code !== `manual_${elementIdToDelete}`
      );
      setCriteriaToSubmit([...newCriteriaToSubmit]);
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
          { code: c.code, field: c.field, authority: c.authority },
        ]);
      }
    });
  }, [criteriaChanged]);

  useEffect(() => {
    /* eslint-disable functional/no-let */
    criteria.forEach((c) => {
      let i = 0;
      let notInsubmitList = true;
      while (notInsubmitList === true && i < criteriaToSubmit.length) {
        notInsubmitList = c.code !== criteriaToSubmit[i].code ? true : false;
        i++;
      }
      if (notInsubmitList === true && c.checked === true) {
        setCriteriaToSubmit((prevCriteriaToSubmit) => [
          ...prevCriteriaToSubmit,
          { code: c.code, dispatched: false },
        ]);
      }
    });
  }, [criteriaChanged]);

  useEffect(() => {
    /* eslint-disable functional/no-let */
    let serviceCanBeCalled = true;
    if (criteriaToSubmit.length) {
      criteriaToSubmit.forEach((element) => {
        serviceCanBeCalled = serviceCanBeCalled && element.dispatched;
      });
    } else {
      serviceCanBeCalled = false;
    }
    if (serviceCanBeCalled && typeof initiativeId === 'string') {
      patchBeneficiaryRuleService(initiativeId, beneficiaryRule)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
    patchGeneralInfo('ciao', { budget: 100 })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    // getInitativeSummary()
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error));
  }, [criteriaToSubmit]);

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
              handleCriteriaRemoved={handleCriteriaRemoved}
              action={action}
              setAction={setAction}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              criteriaToSubmit={criteriaToSubmit}
              setCriteriaToSubmit={setCriteriaToSubmit}
            />
          ))}
        </Box>
        <Box>
          {manualCriteriaToRender.map((m) => (
            <ManualCriteriaItem
              key={m}
              code={m}
              name={`${t('components.wizard.stepTwo.chooseCriteria.form.manual')} ${m + 1}`}
              handleCriteriaRemoved={handleManualCriteriaRemoved}
              action={action}
              setAction={setAction}
              // currentStep={currentStep}
              // setCurrentStep={setCurrentStep}
              criteriaToSubmit={criteriaToSubmit}
              setCriteriaToSubmit={setCriteriaToSubmit}
            />
          ))}
        </Box>
      </form>
    </Paper>
  );
};

export default AdmissionCriteria;
