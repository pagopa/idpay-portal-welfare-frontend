import { Box, Typography } from '@mui/material';

type Props = {
  heading: string;
  title: string;
};

const SummaryContentBody = ({ heading, title }: Props) => (
  <Box sx={{ flexDirection: 'column', px: 2 }}>
    <Typography variant="subtitle2" sx={{ width: '100%', my: 1 }}>
      {heading}
    </Typography>
    <Typography variant="h6" sx={{ width: '100%', my: 1 }}>
      {title}
    </Typography>
  </Box>
);

export default SummaryContentBody;
