import { Box } from '@mui/material';
import { Footer } from '@pagopa/selfcare-common-frontend';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import React from 'react';
import { useSelector } from 'react-redux';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import Header from '../Header';
import withParties, { WithPartiesProps } from '../../decorators/withParties';
import SideMenu from '../SideMenu/SideMenu';

type Props = {
  children?: React.ReactNode;
} & WithPartiesProps;

const Layout = ({ children, parties }: Props) => {
  const onExit = useUnloadEventOnExit();
  const loggedUser = useSelector(userSelectors.selectLoggedUser);

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto 1fr auto"
      gridTemplateAreas={`"header"
                          "body"
                          "footer"`}
      minHeight="100vh"
    >
      <Box gridArea="header">
        <Header onExit={onExit} loggedUser={loggedUser} parties={parties} />
      </Box>
      <Box gridArea="body" display="grid" gridTemplateColumns="minmax(200px, 2fr) 10fr">
        <Box gridColumn="auto" sx={{ backgroundColor: 'background.paper' }}>
          <SideMenu />
        </Box>
        <Box
          gridColumn="auto"
          sx={{ backgroundColor: '#F5F6F7' }}
          display="grid"
          justifyContent="center"
          pb={16}
        >
          {children}
        </Box>
      </Box>
      <Box gridArea="footer">
        <Footer onExit={onExit} loggedUser={true} />
      </Box>
    </Box>
  );
};
export default withParties(Layout);
