import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import {
  useUnloadEventInterceptorAndActivate,
} from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation } from 'react-i18next';
import withLogin from '@pagopa/selfcare-common-frontend/decorators/withLogin';
import ThankyouPage from './ThankyouPage';

export type AssistanceRequest = {
  name?: string;
  surname?: string;
  email?: string;
  emailConfirm?: string;
  message: string;
  messageObject: string;
};



const Assistance = () => {
  const { t } = useTranslation();

  const [viewThxPage] = useState(false);

  useUnloadEventInterceptorAndActivate(
    t('assistancePageForm.unloadEvent.title'),
    t('assistancePageForm.unloadEvent.description')
  );


  const requestIdRef = useRef<string>();

  useEffect(() => {
    if (!requestIdRef.current) {
      // eslint-disable-next-line functional/immutable-data
      requestIdRef.current = uniqueId();
      trackEvent('CUSTOMER_CARE_CONTACT', { request_id: requestIdRef.current });
    }
  }, []);





  return (
    <React.Fragment>
      {!viewThxPage ? (
        <Box px={24} my={13}>
          <TitleBox
            title={t('assistancePageForm.title')}
            subTitle={t('assistancePageForm.subTitle')}
            mbTitle={1}
            mbSubTitle={4}
            variantTitle="h1"
            variantSubTitle="h5"
            titleFontSize="48px"
          />
        </Box>
      ) : (
        <ThankyouPage
          title={t('thankyouPage.title')}
          description={t('thankyouPage.description')}
          onAction={() => window.location.assign(document.referrer)}
        />
      )}
    </React.Fragment>
  );
};

export default withLogin(Assistance);
