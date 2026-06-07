import '@testing-library/jest-dom/vitest';

const originalToLocaleDateString = Date.prototype.toLocaleDateString;

Date.prototype.toLocaleDateString = function (locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions) {
  return originalToLocaleDateString.call(this, 'en-US', options);
};
