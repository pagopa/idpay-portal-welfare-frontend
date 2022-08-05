import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  Button,
  TextField,
  Link,
  FormHelperText,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CallMadeIcon from '@mui/icons-material/CallMade';

interface Props {
  action: string;
  // setAction: Function;
}

const StepFiiveLegalInfo = ({ action }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (action === 'SUBMIT') {
      //   formik.handleSubmit();
    } else {
      return;
    }
    // setAction('');
  }, [action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepFive.title')}</Typography>
      </Box>

      <form>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 1 }}>
          <FormLabel
            sx={{
              gridColumn: 'span 12',
              fontWeight: 400,
              fontSize: '16px',
              letterSpacing: '0.15px',
            }}
          >
            {t('components.wizard.stepFive.form.subTitle')}
          </FormLabel>
          <FormLabel
            sx={{
              gridColumn: 'span 12',
              fontWeight: 700,
              pb: 1,
              fontSize: '14px',
              letterSpacing: '0.3px',
            }}
          >
            <Button size="small" href="" sx={{ p: 0 }}>
              {t('components.wizard.common.links.findOut')}
            </Button>
          </FormLabel>
        </FormControl>

        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateAreas: `"info info info info try"`,
            py: 2,
            gap: 1,
          }}
        >
          <TextField
            id="id-code-balance"
            label={t('components.wizard.stepFive.form.infoPrivacy')}
            variant="outlined"
            sx={{ gridArea: 'info' }}
          />
          <Button size="large" href="" endIcon={<CallMadeIcon />} sx={{ gridArea: 'try' }}>
            {t('components.wizard.stepFive.form.tryUrl')}
          </Button>
        </FormControl>

        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateAreas: `"info info info info try"`,
            py: 2,
            gap: 1,
          }}
        >
          <TextField
            id="id-code-balance"
            label={t('components.wizard.stepFive.form.termsCond')}
            variant="outlined"
            sx={{ gridArea: 'info' }}
          />
          <Button size="large" href="" endIcon={<CallMadeIcon />} sx={{ gridArea: 'try' }}>
            {t('components.wizard.stepFive.form.tryUrl')}
          </Button>
        </FormControl>

        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateAreas: `"info info info info try"`,
            py: 2,
            gap: 1,
          }}
        >
          <TextField
            id="id-code-balance"
            label="DPIA"
            variant="outlined"
            sx={{ gridArea: 'info' }}
          />
          <Button size="large" href="" endIcon={<CallMadeIcon />} sx={{ gridArea: 'try' }}>
            {t('components.wizard.stepFive.form.tryUrl')}
          </Button>
        </FormControl>

        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateAreas: `"info info info info try"
                                "help help . . ."`,
            py: 2,
            mb: 4,
            gap: 1,
          }}
        >
          <TextField
            id="id-code-balance"
            label={t('components.wizard.stepFive.form.rules')}
            variant="outlined"
            sx={{ gridArea: 'info' }}
          />
          <FormHelperText sx={{ gridArea: 'help' }}>
            {t('components.wizard.stepFive.form.helper')}{' '}
            <Link href="">{t('components.wizard.stepFive.form.helperLink')}</Link>
          </FormHelperText>
          <Button size="large" href="" endIcon={<CallMadeIcon />} sx={{ gridArea: 'try' }}>
            {t('components.wizard.stepFive.form.tryUrl')}
          </Button>
        </FormControl>
      </form>
    </Paper>
  );
};

export default StepFiiveLegalInfo;
