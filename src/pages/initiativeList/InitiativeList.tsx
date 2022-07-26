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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { visuallyHidden } from '@mui/utils';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { grey } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import { useHistory } from 'react-router-dom';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { getInitativeSummary } from '../../services/intitativeService';
import routes from '../../routes';
import { setInitiativeId } from '../../redux/slices/initiativeSlice';
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

type ChipProps = {
  label: string;
  color: string;
};
const StatusChip = ({ label, color }: ChipProps) => (
  <span
    style={{
      backgroundColor: color,
      padding: '7px 14px',
      borderRadius: '16px',
      fontWeight: 600,
    }}
  >
    {label}
  </span>
);

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

  const RenderAction = ({ id, status }: RenderActionProps) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleUpdateInitiative = (id: string) => {
      dispatch(setInitiativeId(id));
      history.push(routes.NEW_INITIATIVE);
    };

    switch (status) {
      case 'DRAFT':
        return (
          <MenuItem onClick={() => handleUpdateInitiative(id)}>
            {t('pages.initiativeList.actions.update')}
          </MenuItem>
        );
      case 'IN_REVISION':
        return <MenuItem>{t('pages.initiativeList.actions.details')}</MenuItem>;
      case 'TO_CHECK':
        return <MenuItem>{t('pages.initiativeList.actions.details')}</MenuItem>; // TBD
      case 'APPROVED':
        return <MenuItem>{t('pages.initiativeList.actions.details')}</MenuItem>; // TBD
      case 'PUBLISHED':
        return <MenuItem>{t('pages.initiativeList.actions.details')}</MenuItem>; // TBD
      case 'CLOSED':
        return <MenuItem>{t('pages.initiativeList.actions.details')}</MenuItem>; // TBD
      case 'SUSPENDED':
        return <MenuItem>{t('pages.initiativeList.actions.details')}</MenuItem>; // TBD
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
        <MoreIcon />
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
        <RenderAction id={id} status={status} />
        <MenuItem>{t('pages.initiativeList.actions.delete')}</MenuItem>
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
  const dispatch = useDispatch();

  useEffect(() => {
    getInitativeSummary()
      .then((response: any) => response)
      .then((responseT) => {
        const data = responseT.map((r: any, i: any) => ({
          ...r,
          creationDate: r.creationDate.toLocaleDateString(),
          updateDate: r.updateDate.toLocaleDateString(),
          id: i,
        }));
        setInitiativeList([...data]);
        setInitiativeListFiltered([...data]);
      })
      .catch((error: any) => console.log('error', error));
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
    /* eslint-disable functional/no-let */
    let statusLabel = '';
    let statusColor = '';
    switch (status) {
      case 'DRAFT':
        statusLabel = t('pages.initiativeList.status.draft');
        statusColor = grey.A200;
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'IN_REVISION':
        statusLabel = t('pages.initiativeList.status.inRevision');
        statusColor = '#FFD25E';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'TO_CHECK':
        statusLabel = t('pages.initiativeList.status.toCheck');
        statusColor = '#FE7A7A';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'APPROVED':
        statusLabel = t('pages.initiativeList.status.approved');
        statusColor = '#7FCD7D';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'PUBLISHED':
        statusLabel = t('pages.initiativeList.status.published');
        statusColor = '#7ED5FC';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'CLOSED':
        statusLabel = t('pages.initiativeList.status.closed');
        statusColor = grey.A200;
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'SUSPENDED':
        statusLabel = t('pages.initiativeList.status.suspended');
        statusColor = '#FFD25E';
        return <StatusChip label={statusLabel} color={statusColor} />;
      default:
        return <span>{status}</span>;
    }
  };

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
          <Button
            variant="contained"
            sx={{ height: '58px' }}
            onClick={() => {
              dispatch(setInitiativeId(''));
              history.push(routes.NEW_INITIATIVE);
            }}
          >
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
                      <TableRow tabIndex={-1} key={row.initiativeName} sx={{}}>
                        <TableCell component="th" id={labelId} scope="row">
                          <Typography sx={{ color: '#0073E6', fontWeight: 600 }}>
                            {row.initiativeName}
                          </Typography>
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
                  onClick={() => {
                    dispatch(setInitiativeId(''));
                    history.push(routes.NEW_INITIATIVE);
                  }}
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
