import { Box, Typography, Modal, Backdrop, Fade, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MouseEventHandler, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopRulesModel } from '../../../../model/ShopRules';
import { renderShopRuleIcon } from './helpers';

type Props = {
  openModal: boolean;
  handleCloseModal: MouseEventHandler;
  availableShopRules: Array<ShopRulesModel>;
  handleShopListItemAdded: any;
};

const ShopRulesModal = ({
  openModal,
  handleCloseModal,
  availableShopRules,
  handleShopListItemAdded,
}: Props) => {
  const { t } = useTranslation();
  const [headingHeight, setHeadingHeight] = useState('');

  const elementRef = useCallback((node) => {
    if (node !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const h = node.getBoundingClientRect().height.toString() + 'px';
      setHeadingHeight(h);
    }
  }, []);

  // eslint-disable-next-line arrow-body-style
  const renderShopRulesList = (availableShopRules: Array<ShopRulesModel>) => {
    return availableShopRules.map((a) => {
      if (a.enabled === true && a.checked === false) {
        return (
          <Box
            key={a.code}
            sx={{ display: 'flex', my: 2, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleShopListItemAdded(a.code)}
          >
            <Box>{renderShopRuleIcon(a.code, 2, 'primary')}</Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: '600' }}>
                {a.title}
              </Typography>
              <Typography variant="body2" color={'#5C6F82'}>
                {a.subtitle}
              </Typography>
            </Box>
          </Box>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <Modal
      aria-labelledby="choose-txr-rules-title"
      aria-describedby="choose-txr-rules-description"
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
                aria-label="close transaction rules modal"
                component="span"
                onClick={handleCloseModal}
              >
                <CloseIcon data-testid="close-txr-rules-modal-test" />
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
                {t('components.wizard.stepThree.modal.title')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {t('components.wizard.stepThree.modal.subtitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Button size="small" sx={{ p: 0 }}>
                {t('components.wizard.common.links.findOut')}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              overflow: 'auto',
              maxHeight: 'calc(100% - ' + headingHeight + ')',
            }}
          >
            {availableShopRules && renderShopRulesList(availableShopRules)}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ShopRulesModal;
