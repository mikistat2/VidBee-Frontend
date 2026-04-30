import { useState, useEffect } from 'react'

export function usePlatform() {
  const [platform, setPlatform] = useState('web')

  useEffect(() => {
    // Capacitor sets window.Capacitor when running as a native app
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      setPlatform(window.Capacitor.getPlatform()) // 'android' | 'ios'
    } else if (window.innerWidth < 768) {
      // Treat small browser windows as mobile for dev/preview
      setPlatform('mobile')
    } else {
      setPlatform('web')
    }
  }, [])

  return {
    platform,
    isMobile: platform === 'android' || platform === 'ios' || platform === 'mobile',
    isWeb: platform === 'web',
    isNative: platform === 'android' || platform === 'ios',
  }
}
