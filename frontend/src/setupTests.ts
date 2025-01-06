// src/setupTests.ts
import '@testing-library/jest-dom';

const mockMatchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});

window.matchMedia = window.matchMedia || mockMatchMedia;