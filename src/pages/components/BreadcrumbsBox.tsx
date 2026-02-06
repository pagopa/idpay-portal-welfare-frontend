import { Box, Breadcrumbs, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';

interface Props {
  backUrl: string;
  backLabel: string;
  items: Array<string | undefined>;
}

const BreadcrumbsBox = ({ backUrl, backLabel, items }: Props) => {
  const history = useHistory();
  const filteredItems = items.filter(Boolean);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      gridColumn: 'span 12'
    }}>
      <ButtonNaked
        component="button"
        onClick={() => history.replace(backUrl)}
        startIcon={<ArrowBackIcon />}
        sx={{ color: 'primary.main', fontSize: '1rem' }}
        weight="default"
        data-testid="back-btn-test"
      >
        {backLabel}
      </ButtonNaked>

      <Breadcrumbs aria-label="breadcrumb">
        {filteredItems.map((label, index) => (
          <Typography
            color={index === filteredItems.length - 1 ? 'text.disabled' : 'text.primary'}
            variant="body2"
            key={index}
          >
            {label}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsBox;