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

      const sidebar = document.getElementsByClassName('otnotice-menu');
      if (sidebar[0]) {
        sidebar[0].setAttribute('style', 'max-height: calc(100vh - 200px); top: 100px; bottom: auto; overflow-y: auto;');
      }
    }, 1000);
  }, [contentLoaded]);
};