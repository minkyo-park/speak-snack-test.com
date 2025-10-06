// 메인 공통 JavaScript 파일

// JSON-LD 동적 삽입 헬퍼 함수
function injectJsonLd(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// D-Day 계산 함수
function calculateDDay(endDate) {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return '종료됨';
  } else if (diffDays === 0) {
    return '오늘 마감';
  } else if (diffDays <= 3) {
    return `D-${diffDays}`;
  } else {
    return `${diffDays}일 남음`;
  }
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 상태별 뱃지 클래스 반환
function getStatusBadgeClass(status) {
  switch (status) {
    case 'active':
      return 'badge badge-primary';
    case 'ending-soon':
      return 'badge badge-warning';
    case 'limited-time':
      return 'badge badge-danger';
    case 'expired':
      return 'badge';
    default:
      return 'badge';
  }
}

// 상태별 텍스트 반환
function getStatusText(status) {
  switch (status) {
    case 'active':
      return '진행중';
    case 'ending-soon':
      return '종료임박';
    case 'limited-time':
      return '한정특가';
    case 'expired':
      return '종료됨';
    default:
      return status;
  }
}

// 공통 JSON-LD 생성 함수들
function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "스픽 내돈내산",
    "url": window.location.origin,
    "description": "스픽 프리미엄 플러스 플랜 및 할인코드 정보를 제공하는 사이트",
    "inLanguage": "ko"
  };
}

function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "스픽 내돈내산",
    "url": window.location.origin,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@speak.snack-test.com",
      "contactType": "customer service"
    }
  };
}

function createBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// 쿠폰 데이터를 Offer 스키마로 변환
function createOfferJsonLd(coupon) {
  const offer = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": coupon.title,
    "description": coupon.description || coupon.summary,
    "url": coupon.landingUrl || window.location.href,
    "availability": "https://schema.org/InStock",
    "validFrom": coupon.validity.start,
    "validThrough": coupon.validity.end,
    "category": coupon.tags.join(", ")
  };

  // 할인 정보 추가
  if (coupon.discountValue && coupon.discountType) {
    if (coupon.discountType === 'percentage') {
      offer.priceSpecification = {
        "@type": "PriceSpecification",
        "price": coupon.discountValue,
        "priceCurrency": "KRW"
      };
    } else if (coupon.discountType === 'fixed') {
      offer.priceSpecification = {
        "@type": "PriceSpecification",
        "price": coupon.discountValue.replace(/[^0-9]/g, ''),
        "priceCurrency": "KRW"
      };
    }
  }

  return offer;
}


// 토글 기능
function toggleContent(buttonId, contentId) {
  const button = document.getElementById(buttonId);
  const content = document.getElementById(contentId);
  
  if (button && content) {
    button.addEventListener('click', function() {
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        button.textContent = '접기';
      } else {
        content.classList.add('hidden');
        button.textContent = '자세히 보기';
      }
    });
  }
}

// 페이지 로드 시 공통 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 기본 JSON-LD 삽입
  injectJsonLd(createWebsiteJsonLd());
  injectJsonLd(createOrganizationJsonLd());
});

// 전역 함수로 내보내기
window.injectJsonLd = injectJsonLd;
window.calculateDDay = calculateDDay;
window.formatDate = formatDate;
window.getStatusBadgeClass = getStatusBadgeClass;
window.getStatusText = getStatusText;
window.createOfferJsonLd = createOfferJsonLd;
window.createBreadcrumbJsonLd = createBreadcrumbJsonLd;
window.toggleContent = toggleContent;
