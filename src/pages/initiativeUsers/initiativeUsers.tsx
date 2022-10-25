import { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
// import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES from '../../routes';
import {
  fetchInitiativeUsers,
  InitiativeUserToDisplay,
  InitiativeUsersResponse,
} from '../../services/__mocks__/initiativeUsersService';

// import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';

// interface MatchParams {
//   id: string;
// }

const InitiativeUsers = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Array<InitiativeUserToDisplay>>([]);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // const columns = [
  //   { field: 'id', hide: true },
  //   { field: 'beneficiary', headerName: 'Beneficiario', width: 700 },
  //   { field: 'updateStatusDate', headerName: 'Data e ora', width: 300 },
  //   { field: 'beneficiaryState', headerName: 'Stato', width: 150 },
  // ];

  // const addError = useErrorDispatcher();
  // useEffect(() => {
  //   // eslint-disable-next-line no-prototype-builtins
  //   if (match !== null && match.params.hasOwnProperty('id')) {
  //     const { id } = match.params as MatchParams;
  //     if (
  //       initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
  //       initiativeSel.initiativeId === id &&
  //       initiativeSel.status !== 'DRAFT'
  //     ) {
  //       getGroupOfBeneficiaryStatusAndDetail(initiativeSel.initiativeId)
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((error) => {
  //           addError({
  //             id: 'GET_UPLOADED_FILE_DATA_ERROR',
  //             blocking: false,
  //             error,
  //             techDescription: 'An error occurred getting groups file info',
  //             displayableTitle: t('errors.title'),
  //             displayableDescription: t('errors.getFileDataDescription'),
  //             toNotify: true,
  //             component: 'Toast',
  //             showCloseIcon: true,
  //           });
  //         });
  //     }
  //   }
  // }, [
  //   JSON.stringify(match),
  //   initiativeSel.initiativeId,
  //   JSON.stringify(initiativeSel.generalInfo),
  // ]);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USERS],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [JSON.stringify(match), initiativeSel.initiativeId]);

  useEffect(() => {
    fetchInitiativeUsers()
      .then((res: InitiativeUsersResponse) => {
        setPage(res.pageNo - 1);
        const rowsData = res.oggetti.map((row, index) => ({
          ...row,
          id: index,
          beneficiary: row.beneficiary,
          updateStatusDate: row.updateStatusDate.toLocaleString('fr-BE'),
          beneficiaryState: row.beneficiaryState,
        }));
        setRows(rowsData);
        setRowsPerPage(res.pageSize);
        setTotalElements(res.totalElements);
      })
      .catch((error) => console.log(error));
  }, [JSON.stringify(match)]);

  const renderUserStatus = (status: string) => {
    switch (status) {
      case 'WAITING':
        return <Chip label={t('pages.initiativeUsers.status.waiting')} color="default" />;
      case 'REGISTERED':
        return <Chip label={t('pages.initiativeUsers.status.registered')} color="success" />;
      case 'SUITABLE':
        return <Chip label={t('pages.initiativeUsers.status.suitable')} color="warning" />;
      case 'NOT_SUITABLE':
        return <Chip label={t('pages.initiativeUsers.status.notSuitable')} color="error" />;
      default:
        return null;
    }
  };

  const formik = useFormik({
    initialValues: {
      searchUser: '',
      searchFrom: undefined,
      searchTo: undefined,
      filterStatus: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <ButtonNaked
              component="button"
              onClick={() => history.replace(ROUTES.HOME)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main' }}
              weight="default"
            >
              {t('breadcrumbs.exit')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiatives')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeUsers.title')}
            subTitle={t('pages.initiativeUsers.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <TextField
            label={t('pages.initiativeUsers.form.search')}
            placeholder={t('pages.initiativeUsers.form.search')}
            name="searchUser"
            aria-label="searchUser"
            role="input"
            InputLabelProps={{ required: false }}
            value={formik.values.searchUser}
            onChange={(e) => formik.handleChange(e)}
            size="small"
            data-testid="searchUser-test"
          />
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('pages.initiativeUsers.form.from')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.searchFrom}
              onChange={(e) => formik.handleChange(e)}
              // minDate={new Date()}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="searchFrom"
                  data-testid="searchFrom-test"
                  name="searchFrom"
                  type="date"
                  size="small"
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('pages.initiativeUsers.form.to')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.searchTo}
              onChange={(e) => formik.handleChange(e)}
              // minDate={new Date()}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="searchTo"
                  data-testid="searchTo-test"
                  name="searchTo"
                  type="date"
                  size="small"
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeUsers.form.status')}</InputLabel>
          <Select
            id="filterStatus"
            data-testid="filterStatus-select"
            name="filterStatus"
            label={t('pages.initiativeUsers.form.status')}
            placeholder={t('pages.initiativeUsers.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value="WAITING" data-testid="filterStatusWaiting-test">
              {t('pages.initiativeUsers.form.waiting')}
            </MenuItem>
            <MenuItem value="REGISTERED" data-testid="filterStatusRegistered-test">
              {t('pages.initiativeUsers.form.registered')}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <Button
            sx={{ py: 2 }}
            variant="outlined"
            size="small"
            onClick={() => console.log('apply filters')}
            data-testid="apply-filters-test"
          >
            {t('pages.initiativeUsers.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1em' }}
            onClick={() => console.log('reset filters')}
          >
            {t('pages.initiativeUsers.form.resetFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          height: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="30%">{t('pages.initiativeUsers.table.beneficiary')}</TableCell>
                  <TableCell width="30%">
                    {t('pages.initiativeUsers.table.updateStatusDate')}
                  </TableCell>
                  <TableCell width="30%">
                    {t('pages.initiativeUsers.table.beneficiaryState')}
                  </TableCell>
                  <TableCell width="10%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: 'white' }}>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <ButtonNaked
                        component="button"
                        sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1em' }}
                        onClick={() => console.log('handle detail')}
                      >
                        {r.beneficiary}
                      </ButtonNaked>
                    </TableCell>
                    <TableCell>{r.updateStatusDate}</TableCell>
                    <TableCell>{renderUserStatus(r.beneficiaryState)}</TableCell>
                    <TableCell>
                      <IconButton>
                        <ArrowForwardIosIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              onPageChange={() => console.log('page changed')}
              page={page}
              count={totalElements}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeUsers;
