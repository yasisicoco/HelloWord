import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 자동 업데이트 설정
      includeAssets: [
        'icons/apple-touch-icon.png',
        'icons/android-chrome-192x192.png',
        'icons/android-chrome-512x512.png',
        'icons/favicon.ico',
        'gameThumbnail/game1.png',
        'gameThumbnail/game2.png',
        'gameThumbnail/game3.png',
        'gameThumbnail/game4.png',
      ],
      manifest: {
        name: 'My PWA App', // 앱 이름
        short_name: 'PWA', // 앱의 짧은 이름
        description: 'My awesome Progressive Web App!',
        theme_color: '#ffffff', // 테마 색상
        background_color: '#ffffff', // 배경 색상
        display: 'standalone', // 앱처럼 실행되도록 설정
        start_url: '/', // 앱의 시작 URL (루트 경로)
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable', // 아이콘이 모든 상황에서 사용 가능하도록 설정
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/apple-touch-icon.png', // iOS 아이콘
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
        ],
        // screenshots: [
        //   {
        //     src: "/screenshots/screenshot1.png",  // 스크린샷 경로
        //     sizes: "540x720",                     // 스크린샷 크기
        //     type: "image/png",
        //     form_factor: "wide",                  // 데스크탑 용도
        //   },
        //   {
        //     src: "/screenshots/screenshot2.png",
        //     sizes: "540x720",
        //     type: "image/png",
        //     form_factor: "narrow",                // 모바일 용도
        //   }
        // ],
      },
    }),
  ],
});
