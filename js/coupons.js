// 쿠폰 페이지 전용 JavaScript

let couponsData = [];
let filteredCoupons = [];

// 쿠폰 데이터 로드
async function loadCouponsData() {
  try {
    const response = await fetch('/data/coupons.json');
    couponsData = await response.json();
    filteredCoupons = [...couponsData];
    renderCoupons();
    setupFilters();
    generateCouponsJsonLd();
  } catch (error) {
    console.error('쿠폰 데이터 로드 실패:', error);
    document.getElementById('coupons-container').innerHTML = 
      '<p class="text-center text-muted">쿠폰 정보를 불러올 수 없습니다.</p>';
  }
}

// 쿠폰 카드 렌더링
function renderCoupons() {
  const container = document.getElementById('coupons-container');
  
  if (filteredCoupons.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">해당 조건의 쿠폰이 없습니다.</p>';
    return;
  }

  const couponsHtml = filteredCoupons.map(coupon => createCouponCard(coupon)).join('');
  container.innerHTML = `<div class="coupons-grid">${couponsHtml}</div>`;
  
  // 토글 버튼 이벤트 설정
  setupToggleButtons();
}

// 쿠폰 카드 HTML 생성
function createCouponCard(coupon) {
  const dDay = calculateDDay(coupon.validity.end);
  const statusBadgeClass = getStatusBadgeClass(coupon.status);
  const statusText = getStatusText(coupon.status);
  
  const tagsHtml = coupon.tags.map(tag => `<span class="badge">${tag}</span>`).join('');
  
  return `
    <div class="card coupon-card" data-status="${coupon.status}" data-tags="${coupon.tags.join(',')}">
      <div class="coupon-status">
        <span class="${statusBadgeClass}">${statusText}</span>
      </div>
      
      <div class="card-header">
        <h3 class="card-title">${coupon.title}</h3>
        <div class="card-summary">${coupon.summary}</div>
        ${tagsHtml}
      </div>
      
      <div class="coupon-info">
        <p><strong>혜택:</strong> ${coupon.discountValue || '특별 혜택'}</p>
        <p><strong>유효기간:</strong> ${formatDate(coupon.validity.start)} ~ ${formatDate(coupon.validity.end)}</p>
        <p><strong>남은 기간:</strong> <span class="badge badge-warning">${dDay}</span></p>
        <p><strong>대상:</strong> ${coupon.terms.eligible}</p>
        <p><strong>플랫폼:</strong> ${coupon.terms.platform}</p>
        ${coupon.terms.minSpend > 0 ? `<p><strong>최소 결제금액:</strong> ${coupon.terms.minSpend.toLocaleString()}원</p>` : ''}
      </div>
      
      <div class="coupon-terms hidden" id="terms-${coupon.id}">
        <div class="coupon-terms-title">상세 조건 및 주의사항</div>
        <ul class="coupon-terms-list">
          <li>대상: ${coupon.terms.eligible}</li>
          <li>플랫폼: ${coupon.terms.platform}</li>
          ${coupon.terms.minSpend > 0 ? `<li>최소 결제금액: ${coupon.terms.minSpend.toLocaleString()}원</li>` : ''}
          ${coupon.terms.notes ? `<li>주의사항: ${coupon.terms.notes}</li>` : ''}
        </ul>
        ${coupon.description ? `<p><strong>상세 설명:</strong> ${coupon.description}</p>` : ''}
      </div>
      
      <button class="toggle-btn" id="toggle-${coupon.id}" data-target="terms-${coupon.id}">
        자세히 보기
      </button>
      
      <div class="mt-3">
        <a href="https://app.usespeak.com/kr-ko/sale/kr-affiliate/?ref=coudal" class="btn" target="_blank" rel="noopener">
          혜택 받기
        </a>
      </div>
    </div>
  `;
}

// 필터 설정
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-tab');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 활성 탭 변경
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // 필터링
      const filter = this.dataset.filter;
      filterCoupons(filter);
    });
  });
}

// 쿠폰 필터링
function filterCoupons(filter) {
  if (filter === 'all') {
    filteredCoupons = [...couponsData];
  } else if (filter === 'active') {
    filteredCoupons = couponsData.filter(coupon => coupon.status === 'active');
  } else if (filter === 'ending-soon') {
    filteredCoupons = couponsData.filter(coupon => coupon.status === 'ending-soon');
  } else if (filter === 'limited-time') {
    filteredCoupons = couponsData.filter(coupon => coupon.status === 'limited-time');
  }
  
  renderCoupons();
}

// 토글 버튼 이벤트 설정
function setupToggleButtons() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        if (targetElement.classList.contains('hidden')) {
          targetElement.classList.remove('hidden');
          this.textContent = '접기';
        } else {
          targetElement.classList.add('hidden');
          this.textContent = '자세히 보기';
        }
      }
    });
  });
}

// 쿠폰 관련 JSON-LD 생성
function generateCouponsJsonLd() {
  // 페이지용 브레드크럼
  const breadcrumbItems = [
    { name: '홈', url: window.location.origin },
    { name: '할인코드 & 프로모션', url: window.location.href }
  ];
  
  injectJsonLd(createBreadcrumbJsonLd(breadcrumbItems));
  
  // 각 쿠폰을 Offer로 변환
  couponsData.forEach(coupon => {
    injectJsonLd(createOfferJsonLd(coupon));
  });
  
  // CollectionPage 스키마
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "스픽 할인코드 & 프로모션 모음",
    "description": "스픽 프리미엄 플러스 관련 할인코드와 프로모션 정보를 모아놓은 페이지",
    "url": window.location.href,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": couponsData.length,
      "itemListElement": couponsData.map((coupon, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "name": coupon.title,
        "description": coupon.summary,
        "url": coupon.landingUrl || window.location.href
      }))
    }
  };
  
  injectJsonLd(collectionPage);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  loadCouponsData();
});

// 전역 함수로 내보내기
window.loadCouponsData = loadCouponsData;
window.renderCoupons = renderCoupons;
window.filterCoupons = filterCoupons;
