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
import { MouseEventHandler, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { MccCodesModel } from '../../../../model/MccCodes';

type Props = {
  openModalMcc: boolean;
  handleCloseModalMcc: MouseEventHandler;
  mccCodesList: Array<MccCodesModel>;
};

const MCCModal = ({ openModalMcc, handleCloseModalMcc, mccCodesList }: Props) => {
  const { t } = useTranslation();
  const [headingHeight, setHeadingHeight] = useState('');

  const elementRef = useCallback((node) => {
    if (node !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const h = (node.getBoundingClientRect().height + 150).toString() + 'px';
      setHeadingHeight(h);
    }
  }, []);

  const renderMccCodesList = (list: Array<MccCodesModel>) =>
    list.map((a) => {
      const desc =
        a.description.length > 61 ? `${a.description.substring(51, 0)}...` : a.description;

      return (
        <Box key={a.code} sx={{ display: 'flex', my: 2 }}>
          <Box>
            <Checkbox checked={false} id={a.code} name={a.code} data-testid="check-test-1" />
          </Box>
          <Box>
            <Typography variant="body2">{desc}</Typography>
            <Typography variant="caption">{a.code}</Typography>
          </Box>
        </Box>
      );
    });

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
                {t('components.wizard.stepThree.modalMcc.title')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {t('components.wizard.stepThree.modalMcc.subtitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', width: '100%', my: 3 }}>
              <TextField
                size="small"
                id="search-code-description"
                label={t('components.wizard.stepThree.modalMcc.searchCodeOrDescription')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                data-testid="search-code-description-test"
                //   onChange={(e) => {
                //     handleSearchCriteria(e.target.value);
                //   }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100% - ' + headingHeight + ')',
              overflowX: 'hidden',
            }}
          >
            {mccCodesList && renderMccCodesList(mccCodesList)}
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
              // onClick={handleCriteriaAdded}
              data-testid="add-button-test"
            >
              {t('components.wizard.stepThree.modalMcc.addButton')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MCCModal;
