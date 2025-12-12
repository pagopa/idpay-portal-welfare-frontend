import { Dispatch, SetStateAction, useEffect, useLayoutEffect } from 'react';
declare const OneTrust: any;

export const useOneTrustNotice = (
  url: string,
  contentLoaded: boolean,
  setContentLoaded: Dispatch<SetStateAction<boolean>>) => {
  useEffect(() => {
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices([url], false);
    }).finally(() => {
      setContentLoaded(true);
    });
  }, []);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useLayoutEffect(() => {
    setTimeout(() => {
      const links = document.querySelectorAll('.otnotice-content a');
      links.forEach((l) => {
        const href = l.getAttribute('href');
        if (href?.startsWith('#')) {
          const currentUrl = window.location.pathname;
          const newHref = `${currentUrl}${href}`;
          l.setAttribute('href', newHref);

          l.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }
      });

      const sidebar = document.getElementsByClassName('otnotice-menu')[0];
      const footer = document.querySelector('footer') || document.querySelector('.MuiBox-root.css-ggcvcx');
      const header = document.querySelector('header') || document.querySelector('.MuiBox-root.css-sol2dz');

      const updateSidebar = () => {
        if (sidebar && footer && header) {
          const headerHeight = header.offsetHeight;
          const topValue = headerHeight + 100;
          const footerRect = footer.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          if (footerRect.top < viewportHeight) {
            const availableHeight = footerRect.top - topValue - 20;
            sidebar.setAttribute('style', `position: fixed; top: ${topValue}px; max-height: ${availableHeight}px; overflow-y: auto;`);
          } else {
            const maxHeight = (viewportHeight * 0.85) - topValue;
            sidebar.setAttribute('style', `position: fixed; top: ${topValue}px; max-height: ${maxHeight}px; overflow-y: auto;`);
          }
        }
      };

      updateSidebar();
      window.addEventListener('scroll', updateSidebar);
      window.addEventListener('resize', updateSidebar);

      return () => {
        window.removeEventListener('scroll', updateSidebar);
        window.removeEventListener('resize', updateSidebar);
      };
    }, 1000);
  }, [contentLoaded]);
};