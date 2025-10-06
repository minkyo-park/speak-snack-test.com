// 소개 페이지 전용 JavaScript

// 소개 페이지용 JSON-LD 생성
function generateAboutJsonLd() {
  // 브레드크럼
  const breadcrumbItems = [
    { name: '홈', url: window.location.origin },
    { name: '소개', url: window.location.href }
  ];
  
  injectJsonLd(createBreadcrumbJsonLd(breadcrumbItems));
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  generateAboutJsonLd();
});

// 전역 함수로 내보내기
window.generateAboutJsonLd = generateAboutJsonLd;



