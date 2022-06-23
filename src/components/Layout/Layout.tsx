import { Grid, Box } from '@mui/material';
import { Footer } from '@pagopa/selfcare-common-frontend';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import React from 'react';
import { useSelector } from 'react-redux';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import Header from '../Header';
import withParties from '../../decorators/withParties';
import SideMenu from '../SideMenu/SideMenu';

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const onExit = useUnloadEventOnExit();
  const loggedUser = useSelector(userSelectors.selectLoggedUser);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header onExit={onExit} loggedUser={loggedUser} />
      <Grid container direction="row" flexGrow={1}>
        <Grid
          container
          item
          pl={{ xs: 3, md: 4 }}
          xs={12}
          sx={{ backgroundColor: 'background.paper' }}
        >
          <Grid item xs={2}>
            <Box>
              <SideMenu />
            </Box>
          </Grid>
          <Grid
            item
            xs={10}
            sx={{ backgroundColor: '#F5F6F7' }}
            display="flex"
            justifyContent="center"
            pb={16}
          >
            {children}
          </Grid>
        </Grid>
      </Grid>
      <Footer onExit={onExit} loggedUser={!!loggedUser} />
    </Box>
  );
};
export default withParties(Layout);
