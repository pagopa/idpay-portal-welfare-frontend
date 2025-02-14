import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Checkbox,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Dispatch,
  MouseEventHandler,
  useState,
  ChangeEvent,
  useCallback,
  ChangeEventHandler,
  SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import {
  BeneficiaryTypeEnum,
  FamilyUnitCompositionEnum,
} from '../../../../api/generated/initiative/InitiativeGeneralDTO';

type Props = {
  openModal: boolean;
  handleCloseModal: MouseEventHandler;
  handleCriteriaAdded: MouseEventHandler;
  criteriaToRender: Array<AvailableCriteria>;
  setCriteriaToRender: Dispatch<Array<AvailableCriteria>>;
  searchCriteria: string;
  setSearchCriteria: Dispatch<SetStateAction<string>>;
  beneficiaryType: BeneficiaryTypeEnum | undefined;
  familyUnitComposition: FamilyUnitCompositionEnum | undefined;
};

const AdmissionCriteriaModal = ({
  openModal,
  handleCloseModal,
  handleCriteriaAdded,
  criteriaToRender,
  setCriteriaToRender,
  searchCriteria,
  setSearchCriteria,
  beneficiaryType,
  familyUnitComposition,
}: Props) => {
  const { t } = useTranslation();
  const [headingHeight, setHeadingHeight] = useState('');

  const elementRef = useCallback((node) => {
    if (node !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const h = (node.getBoundingClientRect().height + 150).toString() + 'px';
      setHeadingHeight(h);
    }
  }, []);

  const handleCriteriaChange = (e: ChangeEvent<Element>) => {
    const newCriteria = criteriaToRender.map((c) => {
      if (c.code === e.target.id) {
        return { ...c, checked: !c.checked };
      }
      return c;
    });
    setCriteriaToRender([...newCriteria]);
  };

  const handleSearchCriteria = (s: string) => {
    const searchCriteria = s.toLowerCase();
    setSearchCriteria(searchCriteria);
  };

  const renderAdmissionCriteriaList = (
    list: Array<AvailableCriteria>,
    searchKey: string,
    handleCriteriaChange: ChangeEventHandler,
    beneficiaryType: BeneficiaryTypeEnum | undefined
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    if (!searchKey.length) {
      return list.map((a) => {
        const displayType =
          a.code === 'ISEE' &&
          typeof beneficiaryType !== undefined &&
          familyUnitComposition === FamilyUnitCompositionEnum.INPS &&
          beneficiaryType === BeneficiaryTypeEnum.NF
            ? 'none'
            : 'flex';

        return (
          <Box key={a.code} sx={{ display: displayType, my: 2 }}>
            <Box>
              <Checkbox
                onChange={(e) => handleCriteriaChange(e)}
                checked={a.checked}
                id={a.code}
                name={a.code}
                data-testid="check-test-1"
              />
            </Box>
            <Box>
              <Typography variant="body2">{a.fieldLabel}</Typography>
              <Typography variant="caption">{a.authorityLabel}</Typography>
            </Box>
          </Box>
        );
      });
    } else {
      return list.map((a) => {
        const lowerCaseTitle = typeof a.fieldLabel === 'string' ? a.fieldLabel.toLowerCase() : '';
        if (lowerCaseTitle.includes(searchKey)) {
          return (
            <Box key={a.code} sx={{ display: 'flex', my: 2 }}>
              <Box>
                <Checkbox
                  onChange={(e) => handleCriteriaChange(e)}
                  checked={a.checked}
                  id={a.code}
                  name={a.code}
                  data-testid="check-test-2"
                />
              </Box>
              <Box>
                <Typography variant="body2">{a.fieldLabel}</Typography>
                <Typography variant="caption">{a.authorityLabel}</Typography>
              </Box>
            </Box>
          );
        } else {
          return null;
        }
      });
    }
  };

  return (
    <Modal
      aria-labelledby="choose-admission-criteria-title"
      aria-describedby="choose-admission-criteria-description"
      open={openModal}
      onClose={handleCloseModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="admission-modal"
    >
      <Fade in={openModal} data-testid="admission-fade">
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            transform: 'translate(0, 0)',
            width: '375px',
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              justifyItems: 'end',
            }}
            ref={elementRef}
          >
            <Box sx={{ gridColumn: 'span 12' }}>
              <IconButton
                color="default"
                aria-label="close admission criteria modal"
                component="span"
                onClick={handleCloseModal}
              >
                <CloseIcon data-testid="close-modal-test" />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
            }}
            ref={elementRef}
          >
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" component="h2">
                {t('components.wizard.stepThree.chooseCriteria.browse')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {t('components.wizard.stepThree.chooseCriteria.modal.subtitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', width: '100%', my: 3 }}>
              <TextField
                fullWidth
                size="small"
                id="search-criteria"
                label={t('components.wizard.stepThree.chooseCriteria.modal.searchCriteria')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ 'data-testid': 'search-criteria-test' }}
                onChange={(e) => {
                  handleSearchCriteria(e.target.value);
                }}
                value={searchCriteria}
              />
            </Box>
          </Box>
          <Box
            sx={{
              overflow: 'auto',
              maxHeight: 'calc(100% - ' + headingHeight + ')',
            }}
          >
            {renderAdmissionCriteriaList(
              criteriaToRender,
              searchCriteria,
              handleCriteriaChange,
              beneficiaryType
            )}
          </Box>
          <Box
            sx={{
              my: 3,
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              mx: 4,
            }}
          >
            <Button
              fullWidth
              sx={{ width: '100%' }}
              variant="contained"
              onClick={handleCriteriaAdded}
              data-testid="add-button-test"
            >
              {t('components.wizard.stepThree.chooseCriteria.modal.addButton')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AdmissionCriteriaModal;
