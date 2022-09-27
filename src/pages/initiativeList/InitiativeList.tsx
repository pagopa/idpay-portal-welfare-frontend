import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Link,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { visuallyHidden } from '@mui/utils';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { grey } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import { useHistory } from 'react-router-dom';
import MoreIcon from '@mui/icons-material/MoreVert';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
// import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { getInitativeSummary } from '../../services/intitativeService';
import routes, { BASE_ROUTE } from '../../routes';

import { resetInitiative } from '../../redux/slices/initiativeSlice';
import { setInitiativeSummaryList } from '../../redux/slices/initiativeSummarySlice';

import { useAppDispatch } from '../../redux/hooks';

import { InitiativeSummaryArrayDTO } from '../../api/generated/initiative/InitiativeSummaryArrayDTO';
import { EnhancedTableProps, Data, Order, stableSort, getComparator, HeadCell } from './helpers';

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  const { t } = useTranslation();

  const headCells: ReadonlyArray<HeadCell> = [
    {
      id: 'initiativeName',
      numeric: false,
      disablePadding: false,
      label: t('pages.initiativeList.tableColumns.initiativeName'),
    },
    {
      id: 'creationDate',
      numeric: false,
      disablePadding: false,
      label: t('pages.initiativeList.tableColumns.creationDate'),
    },
    {
      id: 'updateDate',
      numeric: false,
      disablePadding: false,
      label: t('pages.initiativeList.tableColumns.updateDate'),
    },
    {
      id: 'initiativeId',
      numeric: false,
      disablePadding: true,
      label: t('pages.initiativeList.tableColumns.initiativeId'),
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: t('pages.initiativeList.tableColumns.initiativeStatus'),
    },
    {
      id: 'id',
      numeric: true,
      disablePadding: false,
      label: '',
    },
  ];

  return (
    <TableHead sx={{ backgroundColor: grey.A200 }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type ActionsMenuProps = {
  id: string;
  status: string;
};
const ActionMenu = ({ id, status }: ActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const handleClickActionsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionsMenu = () => {
    setAnchorEl(null);
  };

  type RenderActionProps = {
    id: string;
    status: string;
  };

  const RenderDetail = ({ id, status }: RenderActionProps) => {
    const history = useHistory();
    const handleViewInitiativeDetail = (id: string) => {
      history.push(`${BASE_ROUTE}/dettagli-iniziativa/${id}`);
    };

    switch (status) {
      case 'IN_REVISION':
      case 'PUBLISHED':
      case 'APPROVED':
        return (
          <MenuItem onClick={() => handleViewInitiativeDetail(id)}>
            {t('pages.initiativeList.actions.details')}
          </MenuItem>
        );
      case 'DRAFT':
      case 'TO_CHECK':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const RenderUpdate = ({ id, status }: RenderActionProps) => {
    const history = useHistory();
    const handleUpdateInitiative = (id: string) => {
      history.push(`${BASE_ROUTE}/iniziativa/${id}`);
    };
    switch (status) {
      case 'DRAFT':
      case 'APPROVED':
      case 'TO_CHECK':
        return (
          <MenuItem onClick={() => handleUpdateInitiative(id)}>
            {t('pages.initiativeList.actions.update')}
          </MenuItem>
        );
      case 'IN_REVISION':
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const RenderDelete = ({ status }: RenderActionProps) => {
    switch (status) {
      case 'DRAFT':
      case 'TO_CHECK':
      case 'APPROVED':
        return <MenuItem>{t('pages.initiativeList.actions.delete')}</MenuItem>;
      case 'IN_REVISION':
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const RenderSuspend = ({ status }: RenderActionProps) => {
    switch (status) {
      case 'PUBLISHED':
        return <MenuItem>{t('pages.initiativeList.actions.suspend')}</MenuItem>;
      case 'DRAFT':
      case 'APPROVED':
      case 'TO_CHECK':
      case 'IN_REVISION':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  return (
    <TableCell align="right">
      <IconButton
        id={`actions_button-${id}`}
        aria-controls={open ? `actions-menu_${id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickActionsMenu}
      >
        <MoreIcon color="primary" />
      </IconButton>
      <Menu
        id={`actions-menu_${id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseActionsMenu}
        MenuListProps={{
          'aria-labelledby': `actions_button-${id}`,
        }}
      >
        <RenderDetail id={id} status={status} />
        <RenderSuspend id={id} status={status} />
        <RenderUpdate id={id} status={status} />
        <RenderDelete id={id} status={status} />
      </Menu>
    </TableCell>
  );
};

const InitiativeList = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('initiativeName');
  const [initiativeList, setInitiativeList] = useState(Array<Data>);
  const [initiativeListFiltered, setInitiativeListFiltered] = useState(Array<Data>);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  // const setLoading = useLoading('GET_INITIATIVE_LIST');

  useEffect(() => {
    // setLoading(true);
    getInitativeSummary()
      .then((response: InitiativeSummaryArrayDTO) => response)
      .then((responseT) => {
        const data = responseT.map((r: any, i: any) => ({
          ...r,
          creationDate: r.creationDate.toLocaleDateString('fr-BE'),
          updateDate: r.updateDate.toLocaleDateString('fr-BE'),
          id: i,
        }));
        dispatch(setInitiativeSummaryList(responseT));
        setInitiativeList([...data]);
        setInitiativeListFiltered([...data]);
        // setLoading(false);
      })
      .catch((error: any) => {
        addError({
          id: 'GET_INITIATIVE_SUMMARY_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative summary list',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
        // setLoading(false);
      });
  }, []);

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchInitiatives = (s: string) => {
    const search = s.toLocaleLowerCase();
    if (search.length > 0) {
      const listFiltered: Array<Data> = [];
      initiativeList.forEach((record) => {
        if (record.initiativeName.toLowerCase().startsWith(search)) {
          // eslint-disable-next-line functional/immutable-data
          listFiltered.push(record);
        }
      });
      setInitiativeListFiltered([...listFiltered]);
    } else {
      setInitiativeListFiltered([...initiativeList]);
    }
  };

  const renderInitiativeStatus = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Chip label={t('pages.initiativeList.status.draft')} color="default" />;
      case 'IN_REVISION':
        return <Chip label={t('pages.initiativeList.status.inRevision')} color="warning" />;
      case 'TO_CHECK':
        return <Chip label={t('pages.initiativeList.status.toCheck')} color="error" />;
      case 'APPROVED':
        return <Chip label={t('pages.initiativeList.status.approved')} color="success" />;
      case 'PUBLISHED':
        return <Chip label={t('pages.initiativeList.status.published')} color="indigo" />;
      case 'CLOSED':
        return <Chip label={t('pages.initiativeList.status.closed')} color="default" />;
      case 'SUSPENDED':
        return <Chip label={t('pages.initiativeList.status.suspended')} color="error" />;
      default:
        return null;
    }
  };

  const goToNewInitiative = () => {
    dispatch(resetInitiative());
    history.replace(routes.NEW_INITIATIVE);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <TitleBox
        title={t('pages.initiativeList.title')}
        subTitle={t('pages.initiativeList.subtitle')}
        mbTitle={2}
        mtTitle={2}
        mbSubTitle={5}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          columnGap: 2,
          justifyContent: 'center',
          width: '100%',
          mb: 5,
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 10', backgroundColor: 'white' }}>
          <TextField
            id="search-initiative"
            placeholder={t('pages.initiativeList.search')}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              handleSearchInitiatives(e.target.value);
            }}
          />
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2' }}>
          <Button variant="contained" sx={{ height: '58px' }} onClick={goToNewInitiative}>
            {t('pages.initiativeList.createNew')}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 2, backgroundColor: grey.A200, p: 3 }}>
        <TableContainer>
          {initiativeListFiltered.length > 0 ? (
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody sx={{ backgroundColor: 'white' }}>
                {stableSort(initiativeListFiltered, getComparator(order, orderBy)).map(
                  (row, index) => {
                    const labelId = `enhanced-table-row-${index}`;
                    return (
                      <TableRow tabIndex={-1} key={row.id} sx={{}}>
                        <TableCell component="th" id={labelId} scope="row">
                          <Link
                            underline="none"
                            variant="body2"
                            sx={{ fontWeight: 700 }}
                            href={`${BASE_ROUTE}/panoramica-iniziativa/${row.initiativeId}`}
                          >
                            {row.initiativeName}
                          </Link>
                        </TableCell>
                        <TableCell>{row.creationDate}</TableCell>
                        <TableCell>{row.updateDate}</TableCell>
                        <TableCell>{row.initiativeId}</TableCell>
                        <TableCell>{renderInitiativeStatus(row.status)}</TableCell>
                        <ActionMenu id={row.initiativeId} status={row.status} />
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                justifyContent: 'center',
                width: '100%',
                backgroundColor: 'white',
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: 'inline',
                  gridColumn: 'span 12',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ display: 'inline' }}>
                  {t('pages.initiativeList.emptyList')}
                </Typography>
                <Button
                  sx={[
                    {
                      justifyContent: 'start',
                      padding: 0,
                      fontSize: '1em',
                    },
                    {
                      '&:hover': { backgroundColor: 'transparent' },
                    },
                  ]}
                  size="small"
                  variant="text"
                  onClick={goToNewInitiative}
                  disableRipple={true}
                  disableFocusRipple={true}
                >
                  {t('pages.initiativeList.createNew')}
                </Button>
              </Box>
            </Box>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InitiativeList;
