// iOS 獨立 PWA：重開後內部捲動容器可能失效，點輸入框會觸發 focus 恢復
const RESUME_RECOVERY_DELAYS_MS = [0, 50, 150, 300, 500, 800];

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    navigatorWithStandalone.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

function resetDocumentScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function clearInlineScrollLock(element: HTMLElement) {
  if (element.style.position === 'fixed') {
    element.style.position = '';
    element.style.top = '';
    element.style.left = '';
    element.style.width = '';
    element.style.height = '';
    element.style.overflow = '';
    element.style.touchAction = '';
  }
}

export function kickScrollContainers() {
  if (typeof document === 'undefined') {
    return;
  }

  const marked = document.querySelectorAll<HTMLElement>('[data-pwa-scroll="true"]');
  const elements =
    marked.length > 0
      ? Array.from(marked)
      : Array.from(document.querySelectorAll<HTMLElement>('#root div')).filter((element) => {
          const overflowY = window.getComputedStyle(element).overflowY;
          return overflowY === 'auto' || overflowY === 'scroll';
        });

  for (const element of elements) {
    const top = element.scrollTop;
    element.style.setProperty('-webkit-overflow-scrolling', 'touch');
    element.style.touchAction = 'pan-y';
    element.scrollTop = top + 1;
    element.scrollTop = top;
    void element.offsetHeight;
  }
}

function staggeredDocumentScrollReset() {
  resetDocumentScroll();

  for (const delay of [16, 50, 100, 200]) {
    window.setTimeout(resetDocumentScroll, delay);
  }
}

export function recoverPwaScroll() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  resetDocumentScroll();
  clearInlineScrollLock(document.documentElement);
  clearInlineScrollLock(document.body);
  kickScrollContainers();
}

export function scheduleResumeScrollRecovery() {
  if (typeof window === 'undefined') {
    return;
  }

  for (const delay of RESUME_RECOVERY_DELAYS_MS) {
    window.setTimeout(recoverPwaScroll, delay);
  }
}

export function installPwaScrollRecovery() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  const onFocusIn = () => {
    if (isStandalonePwa()) {
      staggeredDocumentScrollReset();
      kickScrollContainers();
    }
  };

  const onPageShow = () => {
    scheduleResumeScrollRecovery();
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      scheduleResumeScrollRecovery();
    }
  };

  const onOnline = () => {
    scheduleResumeScrollRecovery();
  };

  const onVisualViewportScroll = () => {
    if (!isStandalonePwa() || !window.visualViewport) {
      return;
    }

    if (window.visualViewport.offsetTop > 0) {
      resetDocumentScroll();
    }
  };

  document.addEventListener('focusin', onFocusIn);
  window.addEventListener('pageshow', onPageShow);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('online', onOnline);
  window.visualViewport?.addEventListener('scroll', onVisualViewportScroll);

  scheduleResumeScrollRecovery();

  return () => {
    document.removeEventListener('focusin', onFocusIn);
    window.removeEventListener('pageshow', onPageShow);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('online', onOnline);
    window.visualViewport?.removeEventListener('scroll', onVisualViewportScroll);
  };
}
