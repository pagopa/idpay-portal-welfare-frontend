import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  data: Array<{ width: string; label: string }>;
}

const TableHeader = ({ data }: Props) => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        {data.map((d, index) => (
          <TableCell key={index} width={d.width}>
            {t(d.label)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
