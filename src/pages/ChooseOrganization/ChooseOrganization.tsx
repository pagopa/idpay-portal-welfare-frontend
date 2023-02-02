import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloseIcon from '@mui/icons-material/Close';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useEffect, useState } from 'react';
import { PartyAccountItem } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { OrganizationListDTO } from '../../api/generated/initiative/OrganizationListDTO';
import { getOrganizationsList } from '../../services/intitativeService';
import { OrganizationDTO } from '../../api/generated/initiative/OrganizationDTO';
import ROUTES from '../../routes';
import { ENV } from '../../utils/env';

const ChooseOrganization = () => {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();

  const [searchOrganizationValue, setSearchOrganizationValue] = useState('');

  const [organizationsList, setOrganizationsList] = useState<OrganizationListDTO | undefined>(
    undefined
  );
  const [organizationsListFiltered, setOrganizationsListFiltered] = useState<
    OrganizationListDTO | undefined
  >(undefined);
  const [organizationSelected, setOrganizationSelected] = useState<OrganizationDTO | undefined>(
    undefined
  );

  useEffect(() => {
    getOrganizationsList()
      .then((res) => {
        if (res.length > 1) {
          setOrganizationsList(res);
          setOrganizationsListFiltered(res);
        } else {
          setOrganizationSelected(res[0]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const searchOrganization = (searchValue: string) => {
    setSearchOrganizationValue(searchValue);
    const filterderOrganizations = organizationsList?.filter((o) =>
      o.organizationName?.toUpperCase().includes(searchValue.toUpperCase())
    );
    setOrganizationsListFiltered(filterderOrganizations);
  };

  const resetOrganizationsList = () => {
    setSearchOrganizationValue('');
    setOrganizationsListFiltered(organizationsList);
  };

  const selectOrganization = (organization: OrganizationDTO) => {
    setOrganizationSelected(organization);
  };

  const resetOrganization = () => {
    setSearchOrganizationValue('');
    setOrganizationsListFiltered(organizationsList);
    setOrganizationSelected(undefined);
  };

  const sendOrganizationSelected = () => {
    const token = storageTokenOps.read();

    const url = `${ENV.URL_API.INITIATIVE}/token/portal`;
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'organization-id': organizationSelected?.organizationId || '',
      },
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((innerToken) => {
        storageTokenOps.write(innerToken);
        history.replace(ROUTES.HOME);
      })
      .catch((error) => {
        console.error(error);
        // window.location.assign(ENV.URL_FE.LOGIN);
      });
  };

  return (
    <Grid
      direction="column"
      container
      display="flex"
      justifyContent="center"
      spacing={2}
      my={'auto'}
      pt={5}
    >
      <Grid item container mb={3} xs={12}>
        <Grid item xs={12} mb={1} display="flex" justifyContent="center">
          <Typography variant="h3">{t('pages.chooseOrganization.title')}</Typography>
        </Grid>
        <Grid item xs={18} display="flex" justifyContent="center">
          <Typography variant="body1" align="center">
            {t('pages.chooseOrganization.subtitle')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item display="flex" justifyContent="center" xs={12}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: '480px',
            minWidth: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.spacing(2),
          }}
        >
          {organizationSelected ? (
            <Box display="flex" py={4} px={2} width="100%" justifyContent={'space-between'}>
              <PartyAccountItem partyName={organizationSelected.organizationName || ''} />
              {organizationsList && organizationsList?.length > 1 && (
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={resetOrganization}
                    id="clearIcon"
                    aria-label="removeSelectionIcon"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ) : (
            <Grid container item xs={3} md={4} lg={3} sx={{ minWidth: '100%', p: 2 }}>
              <Grid container item direction="column">
                <Grid item my={2}>
                  <TextField
                    id="search-organization"
                    label={t('pages.chooseOrganization.searchInputLabel')}
                    fullWidth
                    size="small"
                    value={searchOrganizationValue}
                    onChange={(e) => searchOrganization(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ cursor: 'pointer' }}
                          onClick={resetOrganizationsList}
                        >
                          <CloseIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                item
                direction="column"
                sx={{
                  overflow: 'auto',
                  height: 'auto',
                  maxHeight:
                    organizationsListFiltered && organizationsListFiltered?.length > 3
                      ? '240px'
                      : 'auto',
                  '&::-webkit-scrollbar': {
                    width: 4,
                  },
                  '&::-webkit-scrollbar-track': {
                    boxShadow: `inset 10px 10px  #E6E9F2`,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#0073E6',
                    borderRadius: '16px',
                  },
                }}
              >
                <List>
                  {organizationsListFiltered?.map((el, i) => (
                    <ListItemButton key={i} onClick={() => selectOrganization(el)}>
                      <ListItemAvatar>
                        <Avatar>
                          <AccountBalanceIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={el.organizationName} />
                    </ListItemButton>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
      <Grid item container xs={12} display="flex" justifyContent="center" mt={4}>
        <Grid item xs={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            disabled={!organizationSelected}
            onClick={sendOrganizationSelected}
          >
            {t('pages.chooseOrganization.continueBtnLabel')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChooseOrganization;
