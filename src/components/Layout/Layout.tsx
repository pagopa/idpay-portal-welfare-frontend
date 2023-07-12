import { Box, Drawer, IconButton, Toolbar } from '@mui/material';
import { Footer } from '@pagopa/selfcare-common-frontend';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu';
import ROUTES from '../../routes';
import routes from '../../routes';

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const onExit = useUnloadEventOnExit();
  const loggedUser = useSelector(userSelectors.selectLoggedUser);
  const location = useLocation();
  const [showAssistanceInfo, setShowAssistanceInfo] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const match = matchPath(location.pathname, {
    path: [
      ROUTES.HOME,
      ROUTES.INITIATIVE_OVERVIEW,
      ROUTES.INITIATIVE_RANKING,
      ROUTES.INITIATIVE_USERS,
      ROUTES.INITIATIVE_REFUNDS,
      ROUTES.INITIATIVE_REFUNDS_OUTCOME,
      ROUTES.INITIATIVE_REFUNDS_DETAIL,
      ROUTES.INITIATIVE_USER_DETAILS,
      ROUTES.INITIATIVE_MERCHANT,
      ROUTES.INITIATIVE_MERCHANT_UPLOAD,
    ],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    setShowAssistanceInfo(location.pathname !== ROUTES.ASSISTANCE);
  }, [location.pathname]);

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
        <Header
          withSecondHeader={showAssistanceInfo}
          onExit={onExit}
          loggedUser={loggedUser}
          parties={[]}
        />
      </Box>
      {match !== null ? (
        <Box
          sx={{
            '@media (max-width: 1000px)': {
              gridArea: 'body',
              display: 'grid',
              gridTemplateColumns: '12fr',
            },
            '@media (min-width: 1001px)': {
              gridArea: 'body',
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 2fr) 10fr',
            },
          }}
        >
          <Box
            sx={{
              '@media (max-width: 1000px)': {
                display: 'grid',
                backgroundColor: 'background.paper',
              },
              '@media (min-width: 1001px)': {
                display: 'none',
              },
            }}
          >
            <Toolbar>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Box>
          <Box gridColumn="auto" sx={{ backgroundColor: 'background.paper' }}>
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              sx={{
                width: '375px',
                flexShrink: 0,
                '@media (max-width: 1000px)': {
                  display: 'grid',
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '375px' },
                },
                '@media (min-width: 1001px)': {
                  display: 'none',
                },
              }}
            >
              <SideMenu />
            </Drawer>
            <Box
              sx={{
                '@media (max-width: 1000px)': {
                  display: 'none',
                },
                '@media (min-width: 1001px)': {
                  display: 'grid',
                },
              }}
            >
              <SideMenu />
            </Box>
          </Box>
          <Box
            gridColumn="auto"
            sx={{ backgroundColor: '#F5F5F5' }}
            display="grid"
            justifyContent="center"
            pb={16}
            pt={2}
            px={2}
            gridTemplateColumns="1fr"
          >
            {children}
          </Box>
        </Box>
      ) : (
        <Box
          gridArea="body"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          justifyContent="center"
        >
          <Box
            display="grid"
            justifyContent="center"
            pb={16}
            pt={2}
            gridColumn="span 12"
            maxWidth={
              location.pathname !== routes.PRIVACY_POLICY && location.pathname !== routes.TOS
                ? 920
                : '100%'
            }
            justifySelf="center"
          >
            {children}
          </Box>
        </Box>
      )}
      <Box gridArea="footer">
        <Footer onExit={onExit} loggedUser={true} />
      </Box>
    </Box>
  );
};
export default Layout;
