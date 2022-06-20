import { List, Grid } from '@mui/material';
import { useHistory } from 'react-router';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import SidenavItem from './SidenavItem';
import ROUTES from '../../routes';


export default function SideMenu() {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();

  return (
    <Grid container item mt={1}>
      <Grid item xs={12}>
        <List>
          <SidenavItem
            title={t('sideMenu.home.title')}
            handleClick={() =>
              onExit(() => history.push(ROUTES.HOME))
            }
            isSelected={isOVerviewSelected}
            icon={DashboardCustomize}
          />
        </List>
      </Grid>
    </Grid>
  );
}
