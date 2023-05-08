import { useEffect, useState } from 'react';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { getFamilyComposition } from '../../../services/intitativeService';
import { FamilyUnitCompositionDTO } from '../../../api/generated/initiative/FamilyUnitCompositionDTO';

type Props = {
  id: string;
  cf: string;
};

const FamilyUnitSummary = ({ id, cf }: Props) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [familyUnit, setFamilyUnit] = useState<FamilyUnitCompositionDTO | undefined>();

  useEffect(() => {
    getFamilyComposition(id, cf)
      .then((res) => {
        console.log(res);
        setFamilyUnit(res);
      })
      .catch((error) => {
        addError({
          id: 'GET_FAMILY_COMPOSITION',
          blocking: false,
          error,
          techDescription: 'An error occurred getting family composition',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      });
  }, [id, cf]);

  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(12, 1fr)',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 5,
      }}
    >
      <Box sx={{ gridColumn: 'span 12', mb: 2 }}>
        <Typography variant="h6">
          {t('pages.initiativeUserDetails.familyUnitCompositionTitle')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12', height: 'auto' }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="25%">{t('pages.initiativeUserDetails.fiscalCode')}</TableCell>
                <TableCell width="25%"></TableCell>
                <TableCell width="25%"></TableCell>
                <TableCell width="25%"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: 'white' }}>
              {familyUnit?.usersList.map((r) => (
                <TableRow key={r.familyId}>
                  <TableCell sx={{ textAlign: 'left' }}>{r.fiscalCode}</TableCell>
                  <TableCell sx={{ textAlign: 'left' }}></TableCell>
                  <TableCell sx={{ textAlign: 'left' }}></TableCell>
                  <TableCell sx={{ textAlign: 'left' }}></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default FamilyUnitSummary;
