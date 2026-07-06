import {
  installPwaScrollRecovery,
  isStandalonePwa,
  kickScrollContainers,
  recoverPwaScroll
} from '../pwaScrollRecovery';

function mockMatchMedia(standalone = false) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: standalone && query === '(display-mode: standalone)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  })) as typeof window.matchMedia;
}

function mockStandalonePwa() {
  Object.defineProperty(window.navigator, 'standalone', {
    configurable: true,
    value: true
  });
  mockMatchMedia(true);
}

describe('pwaScrollRecovery helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      value: false
    });
    mockMatchMedia(false);
  });

  it('isStandalonePwa is false in normal browser test env', () => {
    expect(isStandalonePwa()).toBe(false);
  });

  it('isStandalonePwa is true when navigator.standalone is set', () => {
    mockStandalonePwa();
    expect(isStandalonePwa()).toBe(true);
  });

  it('kickScrollContainers preserves inner scroll position and sets pan-y', () => {
    const container = document.createElement('div');
    container.setAttribute('data-pwa-scroll', 'true');
    container.scrollTop = 120;
    document.body.appendChild(container);

    kickScrollContainers();

    expect(container.style.touchAction).toBe('pan-y');
    expect(container.scrollTop).toBe(120);
  });
});

describe('PWA-SCROLL regression (unit test confirms current behavior)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
    jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    mockStandalonePwa();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('PWA-002: focusin triggers staggered document scroll reset in standalone PWA', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    const cleanup = installPwaScrollRecovery();
    input.focus();
    document.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    jest.runAllTimers();

    // 安裝時 scheduleResumeScrollRecovery + focusin staggeredReset → 多次 scrollTo(0,0)
    expect(window.scrollTo).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    cleanup();
  });

  it('PWA-002: visualViewport keyboard offset triggers document scroll reset', () => {
    const viewport = {
      offsetTop: 120,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport
    });

    const cleanup = installPwaScrollRecovery();
    const handler = viewport.addEventListener.mock.calls.find(
      ([event]) => event === 'scroll'
    )?.[1] as (() => void) | undefined;

    handler?.();

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    cleanup();
  });

  it('recoverPwaScroll resets document scroll but preserves inner container position', () => {
    const container = document.createElement('div');
    container.setAttribute('data-pwa-scroll', 'true');
    container.scrollTop = 200;
    document.body.appendChild(container);

    recoverPwaScroll();

    expect(container.style.touchAction).toBe('pan-y');
    expect(container.scrollTop).toBe(200);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
