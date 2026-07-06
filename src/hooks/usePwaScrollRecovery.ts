import { useEffect } from 'react';
import { Platform } from 'react-native';

import { installPwaScrollRecovery, scheduleResumeScrollRecovery } from '../utils/pwaScrollRecovery';

export function usePwaScrollRecovery() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const cleanup = installPwaScrollRecovery();
    scheduleResumeScrollRecovery();

    return cleanup;
  }, []);
}
