import {
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Checkbox,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { MccCodesModel } from '../../../../model/MccCodes';

type Props = {
  openModalMcc: boolean;
  handleCloseModalMcc: MouseEventHandler;
  mccCodesList: Array<MccCodesModel>;
  setMccCodesList: Dispatch<SetStateAction<Array<MccCodesModel>>>;
  setFieldValue: any;
  handleMccCodeCheckedUpdate: any;
};

const MCCModal = ({
  openModalMcc,
  handleCloseModalMcc,
  mccCodesList,
  setMccCodesList,
  setFieldValue,
}: // handleMccCodeCheckedUpdate,
Props) => {
  const { t } = useTranslation();
  const [headingHeight, setHeadingHeight] = useState('');
  const [searchMccCode, setSearchMccCode] = useState('');
  const [mccCodesSelectedCounter, setMccCodesSelectedCounter] = useState(0);
  const [atLeastOneCodeSelected, setAtLeastOneCodeSelected] = useState(false);

  useEffect(() => {
    handleMccCodesSelected(mccCodesList, setMccCodesSelectedCounter, setAtLeastOneCodeSelected);
  }, [mccCodesList]);

  const elementRef = useCallback((node) => {
    if (node !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const h = (node.getBoundingClientRect().height + 150).toString() + 'px';
      setHeadingHeight(h);
    }
  }, []);

  const handleSearchMccCode = (s: string) => {
    const searchMccCode = s.toLowerCase();
    setSearchMccCode(searchMccCode);
  };

  const handleMccCodesChange = (
    e: ChangeEvent<Element>,
    mccCodesList: Array<MccCodesModel>,
    setMccCodesList: Dispatch<SetStateAction<Array<MccCodesModel>>>
  ) => {
    const newMccCodeList: Array<MccCodesModel> = [];
    mccCodesList.forEach((c) => {
      if (c.code === e.target.id) {
        // eslint-disable-next-line functional/immutable-data
        newMccCodeList.push({ ...c, checked: !c.checked });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newMccCodeList.push({ ...c });
      }
    });
    setMccCodesList([...newMccCodeList]);
  };

  const renderMccCodesList = (
    mccCodeList: Array<MccCodesModel>,
    setMccCodesList: Dispatch<SetStateAction<Array<MccCodesModel>>>,
    searchKey: string
  ) => {
    if (!searchKey.length) {
      return mccCodeList.map((a) => {
        const desc =
          a.description.length > 61 ? `${a.description.substring(51, 0)}...` : a.description;

        return (
          <Box key={a.code} sx={{ display: 'flex', my: 2 }}>
            <Box>
              <Checkbox
                onChange={(e) => handleMccCodesChange(e, mccCodeList, setMccCodesList)}
                checked={a.checked}
                id={a.code}
                name={a.code}
                data-testid="check-test-1"
              />
            </Box>
            <Box>
              <Typography variant="body2">{desc}</Typography>
              <Typography variant="caption">{a.code}</Typography>
            </Box>
          </Box>
        );
      });
    } else {
      return mccCodeList.map((a) => {
        const desc =
          a.description.length > 61 ? `${a.description.substring(51, 0)}...` : a.description;
        const lowerCaseDesc = typeof a.description === 'string' ? a.description.toLowerCase() : '';

        if (lowerCaseDesc.startsWith(searchKey)) {
          return (
            <Box key={a.code} sx={{ display: 'flex', my: 2 }}>
              <Box>
                <Checkbox
                  onChange={(e) => handleMccCodesChange(e, mccCodeList, setMccCodesList)}
                  checked={a.checked}
                  id={a.code}
                  name={a.code}
                  data-testid="check-test-1"
                />
              </Box>
              <Box>
                <Typography variant="body2">{desc}</Typography>
                <Typography variant="caption">{a.code}</Typography>
              </Box>
            </Box>
          );
        } else {
          return null;
        }
      });
    }
  };

  const handleMccCodesSelected = (
    mccCodeList: Array<MccCodesModel>,
    setMccCodesSelectedCounter: Dispatch<SetStateAction<number>>,
    setAtLeastOneCodeSelected: Dispatch<SetStateAction<boolean>>
  ) => {
    // eslint-disable-next-line functional/no-let
    let count = 0;
    mccCodeList.forEach((c) => {
      if (c.checked === true) {
        count++;
      }
    });
    setMccCodesSelectedCounter(count);
    setAtLeastOneCodeSelected(count > 0);
  };

  const handleSelectDeSelectAll = (
    mccCodeList: Array<MccCodesModel>,
    setMccCodesList: Dispatch<SetStateAction<Array<MccCodesModel>>>
  ) => {
    const newMccCodeList: Array<MccCodesModel> = [];
    mccCodeList.forEach((c) => {
      // eslint-disable-next-line functional/immutable-data
      newMccCodeList.push({ ...c, checked: !atLeastOneCodeSelected });
    });
    setMccCodesList([...newMccCodeList]);
  };

  const handleMccCodesSelectedToRender = (mccCodesList: Array<MccCodesModel>) => {
    // eslint-disable-next-line functional/no-let
    let mccCode = '';
    mccCodesList.forEach((c) => {
      if (c.checked === true) {
        mccCode = mccCode + ' ' + c.code;
      }
    });
    mccCode = mccCode.trim();
    mccCode = mccCode.replace(/ /g, ', ');
    setFieldValue('values', mccCode);
  };

  return (
    <Modal
      aria-labelledby="choose-mcc-title"
      aria-describedby="choose-mcc-description"
      open={openModalMcc}
      onClose={handleCloseModalMcc}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      // data-testid="modal"
    >
      <Fade in={openModalMcc}>
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
                aria-label="close mcc modal"
                component="span"
                onClick={handleCloseModalMcc}
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
                {t('components.wizard.stepThree.mccModal.title')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {t('components.wizard.stepThree.mccModal.subtitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', width: '100%', my: 3 }}>
              <TextField
                size="small"
                id="search-code-description"
                label={t('components.wizard.stepThree.mccModal.searchCodeOrDescription')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                data-testid="search-code-description-test"
                onChange={(e) => {
                  handleSearchMccCode(e.target.value);
                }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Button
                sx={[
                  {
                    justifyContent: 'start',
                    padding: 0,
                    ml: 0.5,
                  },
                  {
                    '&:hover': { backgroundColor: 'transparent' },
                  },
                ]}
                onClick={() => handleSelectDeSelectAll(mccCodesList, setMccCodesList)}
                data-testid="Select-Deselect-all-button-test"
                disableRipple={true}
                disableFocusRipple={true}
              >
                {atLeastOneCodeSelected
                  ? t('components.wizard.stepThree.mccModal.deselectAllButtonName')
                  : t('components.wizard.stepThree.mccModal.selectAllButtonName')}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100% - ' + headingHeight + ')',
              overflowX: 'hidden',
            }}
          >
            {mccCodesList && renderMccCodesList(mccCodesList, setMccCodesList, searchMccCode)}
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
            <Button
              sx={{ width: '100%' }}
              variant="contained"
              onClick={(e) => {
                handleMccCodesSelectedToRender(mccCodesList);
                handleCloseModalMcc(e);
              }}
              data-testid="add-button-test"
              disabled={!atLeastOneCodeSelected}
            >
              {t('components.wizard.stepThree.mccModal.addButton')}{' '}
              {atLeastOneCodeSelected && `(${mccCodesSelectedCounter})`}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MCCModal;
