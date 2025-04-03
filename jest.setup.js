import ResizeObserver from 'resize-observer-polyfill';

if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = ResizeObserver;
}