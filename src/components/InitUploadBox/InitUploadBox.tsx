import { Box, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface Props {
  text: string;
  link: string;
}

const InitUploadBox = ({ text, link }: Props) => (
  <Box sx={{ textAlign: 'center', gridColumn: 'span 12' }}>
    <FileUploadIcon sx={{ verticalAlign: 'bottom', color: '#0073E6' }} />
    <Typography variant="body2" sx={{ textAlign: 'center', display: 'inline-grid' }}>
      {text}&#160;
    </Typography>
    <Typography
      variant="body2"
      sx={{ textAlign: 'center', display: 'inline-grid', color: '#0073E6' }}
    >
      {link}
    </Typography>
  </Box>
);

export default InitUploadBox;
