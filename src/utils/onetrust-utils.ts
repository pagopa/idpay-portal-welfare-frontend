interface OneTrustNoticeApi {
    Initialized: Promise<void>;
    LoadNotices: (urls: Array<string>, param: boolean) => Promise<void>;
}

interface OneTrustInstance {
    NoticeApi: OneTrustNoticeApi;
}

declare global {
    interface Window {
        OneTrust?: OneTrustInstance;
    }
}

const fixOneTrustLinks = (urlPrefix: string = '/portale-enti') => {
    const cookiePolicyLinks = document.querySelectorAll('.ot-cookie-policy-link, .privacy-notice-link');

    cookiePolicyLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) { return; }

        try {
            const url = new URL(href);
            const path = url.pathname;

            if (path.includes('/portale-esercenti/')) {
                const newPath = path.replace('/portale-esercenti/', `${urlPrefix}/`);
                link.setAttribute('href', newPath);
                link.removeAttribute('target');
                link.removeAttribute('rel');
            }
            // eslint-disable-next-line no-empty
        } catch { }
    });
};

export const initializeOneTrustLinkFix = (urlPrefix: string = '/portale-enti') => {
    if (window.OneTrust) {
        void window.OneTrust.NoticeApi.Initialized.then(() => {
            setTimeout(() => {
                fixOneTrustLinks(urlPrefix);
            }, 500);

            setTimeout(() => {
                fixOneTrustLinks(urlPrefix);

                const observer = new MutationObserver(() => {
                    fixOneTrustLinks(urlPrefix);
                });

                const bannerContainer = document.querySelector('#onetrust-consent-sdk');
                if (bannerContainer) {
                    observer.observe(bannerContainer, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['href']
                    });
                }
            }, 1000);
        });
    } else {
        setTimeout(() => initializeOneTrustLinkFix(urlPrefix), 100);
    }
};