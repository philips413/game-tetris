import { useState, useEffect } from 'react';

export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 모바일 기기 감지
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'mobile'
      ];
      
      const isMobileDevice = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      ) || (isTouchDevice && window.innerWidth <= 768);

      // 태블릿 감지 (iPad 등)
      const isTabletDevice = (
        userAgent.includes('ipad') || 
        (userAgent.includes('android') && !userAgent.includes('mobile')) ||
        (isTouchDevice && window.innerWidth > 768 && window.innerWidth <= 1024)
      );

      setIsMobile(isMobileDevice && !isTabletDevice);
      setIsTablet(isTabletDevice);
    };

    // 초기 감지
    detectDevice();

    // 화면 크기 변경 시 재감지 (기기 회전 등)
    const handleResize = () => {
      setTimeout(detectDevice, 100); // 약간의 지연으로 정확한 크기 측정
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
}