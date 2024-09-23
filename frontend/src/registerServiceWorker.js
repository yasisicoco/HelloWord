// 서비스 워커를 브라우저에 등록하는 함수
export function register() {
  if ('serviceWorker' in navigator) {
    // 개발 환경에서는 서비스 워커를 등록하지 않음 (옵션)
    if (import.meta.env.MODE === 'production') {
      window.addEventListener('load', () => {
        const swUrl = `/sw.js`; // Service Worker 파일 경로

        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('Service Worker 등록 성공:', registration);

            // 서비스 워커가 업데이트를 찾은 경우 처리
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    // 새 콘텐츠가 있는 경우
                    if (navigator.serviceWorker.controller) {
                      console.log('새 콘텐츠가 사용 가능합니다. 페이지를 새로고침하세요.');
                      // 사용자가 새로고침 할 수 있도록 알림을 띄울 수 있음
                    } else {
                      console.log('콘텐츠가 캐시되었습니다. 오프라인 모드에서 사용 가능합니다.');
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('Service Worker 등록 실패:', error);
          });
      });
    }
  }
}

// 서비스 워커를 등록 취소하는 함수
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
