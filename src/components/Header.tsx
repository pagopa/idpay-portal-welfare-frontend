import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header as CommonHeader } from '@pagopa/selfcare-common-frontend';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { useTokenExchange } from '../hooks/useTokenExchange';
import { Product } from '../model/Product';
import { Party } from '../model/Party';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import ROUTES from '../routes';
import { ENV } from './../utils/env';

type Props = WithPartiesProps & {
  onExit: (exitAction: () => void) => void;
  loggedUser?: User;
};

const Header = ({ onExit, loggedUser, parties }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
  const activeProducts: Array<Product> = useMemo(
    () => products?.filter((p) => p.status === 'ACTIVE' && p.authorized) ?? [],
    [products]
  );

  const { invokeProductBo } = useTokenExchange();

  return (
    <CommonHeader
      onExit={onExit}
      withSecondHeader={!!party}
      selectedPartyId={selectedParty?.partyId}
      productsList={activeProducts.map((p) => ({
        id: p.id,
        title: p.title,
        productUrl: p.urlPublic ?? '',
        linkType: 'internal',
      }))}
      partyList={parties2Show.map((party) => ({
        id: party.partyId,
        name: party.description,
        productRole: t(roleLabels[party.userRole].longLabelKey),
        logoUrl: party.urlLogo,
      }))}
      loggedUser={
        loggedUser
          ? {
              id: loggedUser ? loggedUser.uid : '',
              name: loggedUser?.name,
              surname: loggedUser?.surname,
              email: loggedUser?.email,
            }
          : false
      }
      assistanceEmail={ENV.ASSISTANCE.EMAIL}
      enableLogin={true}
      onSelectedProduct={(p) =>
        onExit(() =>
          invokeProductBo(activeProducts.find((ap) => ap.id === p.id) as Product, party as Party)
        )
      }
      onSelectedParty={(selectedParty: PartySwitchItem) => {
        if (selectedParty) {
          trackEvent('PARTY_SELECTION', {
            party_id: selectedParty.id,
          });
          onExit(() =>
            history.push(
              resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                partyId: selectedParty.id,
              })
            )
          );
        }
      }}
    />
  );
};
export default withParties(Header);
