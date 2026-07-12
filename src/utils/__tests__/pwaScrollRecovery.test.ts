import {
  installPwaScrollRecovery,
  isScrollRecoveryDisabled,
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

describe('PWA-SCROLL fix (方向 A)：不再對抗 document 捲動', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
    jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    mockStandalonePwa();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('PWA-002: focusin 只 kick 內層容器，不再 reset document 捲動', () => {
    const container = document.createElement('div');
    container.setAttribute('data-pwa-scroll', 'true');
    container.scrollTop = 150;
    document.body.appendChild(container);

    const input = document.createElement('input');
    document.body.appendChild(input);

    const cleanup = installPwaScrollRecovery();
    jest.runAllTimers(); // 清空安裝時的 resume 排程
    (window.scrollTo as jest.Mock).mockClear();

    input.focus();
    document.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    jest.runAllTimers();

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(container.style.touchAction).toBe('pan-y');
    expect(container.scrollTop).toBe(150);
    cleanup();
  });

  it('PWA-002: 不再註冊 visualViewport scroll 監聽（鍵盤不觸發 reset）', () => {
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
    const scrollListener = viewport.addEventListener.mock.calls.find(
      ([event]) => event === 'scroll'
    );

    expect(scrollListener).toBeUndefined();
    cleanup();
  });

  it('診斷旗標 ?noRecover=1 完全停用恢復（不排程、不 scrollTo）', () => {
    window.history.replaceState({}, '', '?noRecover=1');

    const container = document.createElement('div');
    container.setAttribute('data-pwa-scroll', 'true');
    document.body.appendChild(container);

    const cleanup = installPwaScrollRecovery();
    jest.runAllTimers();

    expect(isScrollRecoveryDisabled()).toBe(true);
    expect(window.scrollTo).not.toHaveBeenCalled();
    cleanup();
  });

  it('recoverPwaScroll 仍 reset document，但保留內層容器捲動位置', () => {
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
