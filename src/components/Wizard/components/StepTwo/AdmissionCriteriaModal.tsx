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
  ChangeEventHandler,
  ChangeEvent,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AdmissionCriteriaModel } from '../../../../model/AdmissionCriteria';

type Props = {
  openModal: boolean;
  handleCloseModal: MouseEventHandler;
  handleCriteriaAdded: MouseEventHandler;
  criteria: Array<AdmissionCriteriaModel>;
  setCriteria: Dispatch<Array<AdmissionCriteriaModel>>;
};

const AdmissionCriteriaModal = ({
  openModal,
  handleCloseModal,
  handleCriteriaAdded,
  criteria,
  setCriteria,
}: Props) => {
  const { t } = useTranslation();
  const [searchCriteria, setSearchCriteria] = useState('');
  const [headingHeight, setHeadingHeight] = useState('');

  const elementRef = useCallback((node) => {
    if (node !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const h = (node.getBoundingClientRect().height + 150).toString() + 'px';
      setHeadingHeight(h);
    }
  }, []);

  const handleCriteriaChange = (e: ChangeEvent) => {
    const newCriteria = criteria.map((c) => {
      if (c.id === e.target.id) {
        return { ...c, checked: !c.checked };
      }
      return c;
    });
    setCriteria(newCriteria);
  };

  const handleSearchCriteria = (s: string) => {
    const searchCriteria = s.toLowerCase();
    setSearchCriteria(searchCriteria);
  };

  const renderAdmissionCriteriaList = (
    list: Array<AdmissionCriteriaModel>,
    searchKey: string,
    handleCriteriaChange: ChangeEventHandler
  ) => {
    if (!searchKey.length) {
      return list.map((a) => (
        <Box key={a.id} sx={{ display: 'flex', my: 2 }}>
          <Box>
            <Checkbox
              onChange={(e) => handleCriteriaChange(e)}
              checked={a.checked}
              id={a.id}
              name={a.id}
            />
          </Box>
          <Box>
            <Typography variant="body2">{a.title}</Typography>
            <Typography variant="caption">{a.subtitle}</Typography>
          </Box>
        </Box>
      ));
    } else {
      return list.map((a) => {
        const lowerCaseTitle = a.title.toLowerCase();
        if (lowerCaseTitle.startsWith(searchKey)) {
          return (
            <Box key={a.id} sx={{ display: 'flex', my: 2 }}>
              <Box>
                <Checkbox
                  onChange={(e) => handleCriteriaChange(e)}
                  checked={a.checked}
                  id={a.id}
                  name={a.id}
                />
              </Box>
              <Box>
                <Typography variant="body2">{a.title}</Typography>
                <Typography variant="caption">{a.subtitle}</Typography>
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
    >
      <Fade in={openModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            transform: 'translate(0, 0)',
            width: '20%',
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
                <CloseIcon />
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
                {t('components.wizard.stepTwo.chooseCriteria.browse')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {t('components.wizard.stepTwo.chooseCriteria.modal.subtitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', width: '100%', my: 3 }}>
              <TextField
                size="small"
                id="search-criteria"
                label="Cerca criteri"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  handleSearchCriteria(e.target.value);
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              overflow: 'auto',
              maxHeight: 'calc(100% - ' + headingHeight + ')',
            }}
          >
            {renderAdmissionCriteriaList(criteria, searchCriteria, handleCriteriaChange)}
          </Box>
          <Box
            sx={{
              my: 3,
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              mx: 4,
              pr: 2,
            }}
          >
            <Button sx={{ width: '100%' }} variant="contained" onClick={handleCriteriaAdded}>
              {t('components.wizard.stepTwo.chooseCriteria.modal.addButton')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AdmissionCriteriaModal;
