// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import { jest } from '@jest/globals';

const mockChangeLanguage = jest.fn();
const mockInitReactI18next = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: mockChangeLanguage },
  }),
  Trans: ({ children }: { children: ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: mockInitReactI18next,
  },
}));
