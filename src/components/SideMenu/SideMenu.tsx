import {
  List,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useEffect, useState } from 'react';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { matchPath } from 'react-router';
import { useAppDispatch } from '../../redux/hooks';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { useAppSelector } from '../../redux/hooks';
import {
  initiativeSummarySelector,
  setInitiativeSummaryList,
} from '../../redux/slices/initiativeSummarySlice';
import { InitiativeSummaryArrayDTO } from '../../api/generated/initiative/InitiativeSummaryArrayDTO';
import { getInitativeSummary } from '../../services/intitativeService';
import SidenavItem from './SidenavItem';

interface MatchParams {
  id: string;
}

/** The side menu of the application */
export default function SideMenu() {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const initiativeSummaryList = useAppSelector(initiativeSummarySelector);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [pathname, setPathName] = useState(() => {
    /*
    For some reason, push on history will not notify this component.
    We are configuring the listener here and not into a useEffect in order to configure it at the costruction of the component, not at its mount
    because the Redirect performed as fallback on the routing would be executed before the listen as been configured
    */
    history.listen(() => setPathName(history.location.pathname));
    return history.location.pathname;
  });

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_OVERVIEW],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    if (!initiativeSummaryList) {
      getInitativeSummary()
        .then((response: InitiativeSummaryArrayDTO) => response)
        .then((responseT) => {
          dispatch(setInitiativeSummaryList(responseT));
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
        });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;
      const itemExpanded = `panel-${id}`;
      setExpanded(itemExpanded);
    } else {
      const firstItemExpanded = Array.isArray(initiativeSummaryList)
        ? `panel-${initiativeSummaryList[0].initiativeId}`
        : false;
      setExpanded(firstItemExpanded);
    }
  }, [JSON.stringify(match), initiativeSummaryList]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box display="grid" mt={1}>
      <Box gridColumn="auto">
        <List>
          <SidenavItem
            title={t('sideMenu.initiativeList.title')}
            handleClick={() => onExit(() => history.replace(ROUTES.HOME))}
            isSelected={pathname === ROUTES.HOME}
            icon={ListAltIcon}
            level={0}
          />
          {initiativeSummaryList?.map((item) => (
            <Accordion
              key={item.initiativeId}
              expanded={expanded === `panel-${item.initiativeId}`}
              onChange={handleChange(`panel-${item.initiativeId}`)}
              disableGutters
              elevation={0}
              sx={{ border: 'none', '&:before': { backgroundColor: '#fff' } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${item.initiativeId}-content`}
                id={`panel-${item.initiativeId}-header`}
              >
                <ListItemText primary={item.initiativeName} />
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding>
                  <SidenavItem
                    title={t('sideMenu.initiativeOveview.title')}
                    handleClick={() =>
                      onExit(() =>
                        history.replace(`${BASE_ROUTE}/panoramica-iniziativa/${item.initiativeId}`)
                      )
                    }
                    isSelected={
                      pathname === `${BASE_ROUTE}/panoramica-iniziativa/${item.initiativeId}`
                    }
                    icon={DashboardIcon}
                    level={2}
                  />
                  <SidenavItem
                    title={t('sideMenu.initiativeUsers.title')}
                    handleClick={() =>
                      onExit(() =>
                        history.replace(`${BASE_ROUTE}/utenti-iniziativa/${item.initiativeId}`)
                      )
                    }
                    isSelected={pathname === `${BASE_ROUTE}/utenti-iniziativa/${item.initiativeId}`}
                    icon={GroupIcon}
                    level={2}
                    disabled={true}
                  />
                  <SidenavItem
                    title={t('sideMenu.initiativeRefunds.title')}
                    handleClick={() =>
                      onExit(() =>
                        history.replace(`${BASE_ROUTE}/rimborsi-iniziativa/${item.initiativeId}`)
                      )
                    }
                    isSelected={
                      pathname === `${BASE_ROUTE}/rimborsi-iniziativa/${item.initiativeId}`
                    }
                    icon={EuroSymbolIcon}
                    level={2}
                    disabled={true}
                  />
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Box>
    </Box>
  );
}
