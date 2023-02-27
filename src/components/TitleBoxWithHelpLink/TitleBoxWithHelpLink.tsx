import { Box, Link, Typography } from '@mui/material';

interface Props {
  title: string;
  subtitle: string;
  helpLink: string;
  helpLabel: string;
}

const TitleBoxWithHelpLink = ({ title, subtitle, helpLink, helpLabel }: Props) => (
  <>
    <Box sx={{ py: 3 }}>
      <Typography variant="h6">{title}</Typography>
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body1">{subtitle}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Link
          sx={{ fontSize: '0.875rem', fontWeight: 700 }}
          href={helpLink}
          target="_blank"
          underline="none"
          variant="body2"
        >
          {helpLabel}
        </Link>
      </Box>
    </Box>
  </>
);

export default TitleBoxWithHelpLink;
