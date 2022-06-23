import { Box } from '@mui/material';
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
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" flex={1}>
        <Box
          gridColumn="span 12"
          sx={{ backgroundColor: 'background.paper' }}
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
        >
          <Box gridColumn="span 2">
            <SideMenu />
          </Box>
          <Box
            gridColumn="span 10"
            sx={{ backgroundColor: '#F5F6F7' }}
            display="grid"
            justifyContent="center"
            pb={16}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Footer onExit={onExit} loggedUser={true} />
    </Box>
  );
};
export default withParties(Layout);
