// 홈페이지 전용 JavaScript

// 히어로 슬라이더 기능
class HeroSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentSlideSpan = document.querySelector('.current-slide');
    this.totalSlides = document.querySelector('.total-slides');
    this.autoSlideInterval = null;
    
    this.init();
  }
  
  init() {
    if (this.slides.length === 0) return;
    
    this.updateSlideCounter();
    this.bindEvents();
    this.startAutoSlide();
  }
  
  bindEvents() {
    // 네비게이션 버튼
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // 인디케이터 클릭
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
    
    // 마우스 호버 시 자동 슬라이드 일시정지
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
      sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    // 현재 슬라이드 비활성화
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');
    
    // 새 슬라이드 활성화
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
    
    this.updateSlideCounter();
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  prevSlide() {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }
  
  updateSlideCounter() {
    if (this.currentSlideSpan) {
      this.currentSlideSpan.textContent = this.currentSlide + 1;
    }
    if (this.totalSlides) {
      this.totalSlides.textContent = this.slides.length;
    }
  }
  
  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5초마다 자동 슬라이드
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// 모든 쿠폰 로드 및 렌더링
async function loadAllCoupons() {
  try {
    const response = await fetch('/data/coupons.json');
    const coupons = await response.json();
    
    renderAllCoupons(coupons);
  } catch (error) {
    console.error('쿠폰 데이터 로드 실패:', error);
    document.getElementById('all-coupons').innerHTML = 
      '<p class="text-center text-muted">쿠폰 정보를 불러올 수 없습니다.</p>';
  }
}

// 모든 쿠폰 카드 렌더링
function renderAllCoupons(coupons) {
  const container = document.getElementById('all-coupons');
  
  if (coupons.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">현재 진행중인 쿠폰이 없습니다.</p>';
    return;
  }
  
  // 그리드 레이아웃으로 쿠폰 카드들을 배치
  container.innerHTML = `
    <div class="coupons-grid">
      ${coupons.map(coupon => createNewCouponCard(coupon)).join('')}
    </div>
  `;
}

// 새로운 쿠폰 카드 HTML 생성 (2번 이미지 스타일 참고)
function createNewCouponCard(coupon) {
  const dDay = calculateDDay(coupon.validity.end);
  const expiryDate = formatDate(coupon.validity.end);
  
  return `
    <div class="coupon-card-new">
      <div class="coupon-title">${coupon.title}</div>
      <div class="coupon-description">${coupon.summary}</div>
      <div class="coupon-meta">
        <span class="coupon-code">코드: 앱발급</span>
        <span class="coupon-expiry">~ ${expiryDate}까지</span>
      </div>
      <a href="https://app.usespeak.com/kr-ko/sale/kr-affiliate/?ref=coudal" class="coupon-button" target="_blank" rel="noopener">
        쿠폰 바로가기
      </a>
    </div>
  `;
}

// FAQ JSON-LD 생성
function generateFAQJsonLd() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "스픽 프리미엄 플러스는 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스픽 프리미엄 플러스는 기존 프리미엄 플랜의 업그레이드 버전으로, 무제한 AI 대화, 고급 AI 모델 사용, 우선 고객 지원, 베타 기능 조기 접근 등의 혜택을 제공하는 프리미엄 서비스입니다."
        }
      },
      {
        "@type": "Question",
        "name": "프리미엄과 프리미엄 플러스의 차이점은 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "주요 차이점은 AI 튜터 사용량(월간 제한 vs 무제한), AI 모델 수준(기본 vs 고급), 맞춤형 학습 기능(일부 vs 풀 제공), 30일 습관 형성 프로그램 포함 여부입니다. 가격은 연간 129,000원(프리미엄)과 299,000원(프리미엄 플러스)의 차이입니다."
        }
      },
      {
        "@type": "Question",
        "name": "할인코드는 어떻게 사용하나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스픽 앱이나 웹사이트에서 결제 시 할인코드를 입력하거나, 특정 링크를 통해 접속하면 자동으로 할인이 적용됩니다. 각 할인코드마다 사용 방법이 다르므로 상세 조건을 확인해주세요."
        }
      },
      {
        "@type": "Question",
        "name": "여러 할인코드를 동시에 사용할 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "대부분의 경우 할인코드는 중복 적용이 불가능합니다. 가장 유리한 할인코드 하나를 선택해서 사용하시기 바랍니다. 연간 구독 할인과 신규 할인 등은 함께 적용될 수 있으니 자세한 조건을 확인해보세요."
        }
      },
      {
        "@type": "Question",
        "name": "학생 할인을 받으려면 어떻게 해야 하나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "학생 할인을 받으려면 스픽 앱에서 학생 인증을 완료해야 합니다. 재학증명서나 학생증을 업로드하여 인증을 받은 후 할인 혜택을 이용할 수 있습니다. 인증 과정은 보통 1-2일 정도 소요됩니다."
        }
      },
      {
        "@type": "Question",
        "name": "연간 구독 시 혜택은 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "연간 구독 시 2개월을 무료로 이용할 수 있습니다. 월 29,900원의 프리미엄 플러스를 연간 구독하면 10개월 가격으로 12개월을 이용할 수 있어 월 평균 24,900원에 이용 가능합니다."
        }
      },
      {
        "@type": "Question",
        "name": "신규 사용자 할인은 언제까지 받을 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "신규 사용자 할인은 첫 결제 시에만 적용됩니다. 계정을 생성하고 첫 번째 구독 결제 시 20% 할인 혜택을 받을 수 있습니다. 이미 구독 중인 계정에는 적용되지 않습니다."
        }
      },
      {
        "@type": "Question",
        "name": "할인코드가 적용되지 않는 이유는 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "할인코드가 적용되지 않는 이유는 만료되었거나, 사용 조건에 맞지 않거나, 중복 할인 불가 조건 때문일 수 있습니다. 각 할인코드의 상세 조건과 유효기간을 확인해보세요."
        }
      },
      {
        "@type": "Question",
        "name": "스픽 프리미엄 플러스는 언제 해지할 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스픽 프리미엄 플러스는 언제든지 해지할 수 있습니다. 앱 설정에서 구독 관리 메뉴를 통해 해지할 수 있으며, 해지 시 현재 결제 주기가 끝날 때까지 서비스를 이용할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "환불이 가능한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스픽의 환불 정책은 구독 시작 후 7일 이내에 제한적으로 가능합니다. 구체적인 환불 조건과 절차는 스픽 고객센터에 문의하시거나 앱 내 고객지원을 통해 확인하실 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "모바일과 웹에서 모두 이용할 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네, 스픽 프리미엄 플러스는 모바일 앱과 웹 브라우저에서 모두 이용할 수 있습니다. 계정이 동기화되어 어떤 기기에서든 동일한 혜택을 받을 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "AI 튜터 사용량이 무제한이라는 것은 정말인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네, 프리미엄 플러스에서는 AI 튜터 사용량 제한이 없습니다. 일반 프리미엄은 월간 사용 제한이 있어 과도하게 사용하면 제한이 걸리지만, 플러스 플랜에서는 제한 없이 자유롭게 AI 튜터와 대화하고 맞춤형 레슨을 생성할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "30일 습관 형성 프로그램이란 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "30일 습관 형성 프로그램은 프리미엄 플러스에만 포함된 AI 코칭 기능입니다. AI 코치가 30일간 학습자의 루틴을 관리하고 체계적으로 영어 학습 습관을 만들어주는 프로그램으로, 자기주도 학습이 어려운 분들에게 도움이 됩니다."
        }
      },
      {
        "@type": "Question",
        "name": "맞춤형 학습 기능의 차이점은 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "프리미엄은 맞춤 레슨 생성이 제한적이지만, 프리미엄 플러스는 맞춤 레슨 무제한 생성, 관심사 기반 단어/레슨 등 개인화 기능을 풀로 제공합니다. AI 튜터가 학습자의 대화 내용을 기억해 더욱 맞춤형 수업을 제공할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "할인 정보는 얼마나 자주 업데이트되나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스픽 내돈내산에서는 새로운 할인코드와 프로모션 정보를 실시간으로 모니터링하여 업데이트합니다. 스픽에서 새로운 할인이 출시되면 24시간 이내에 사이트에 반영됩니다."
        }
      }
    ]
  };
  
  injectJsonLd(faqData);
}

// 홈페이지용 JSON-LD 생성
function generateHomeJsonLd() {
  // 브레드크럼 (홈만 단일)
  const breadcrumbItems = [
    { name: '홈', url: window.location.origin }
  ];
  
  injectJsonLd(createBreadcrumbJsonLd(breadcrumbItems));
  
  // FAQ JSON-LD 생성
  generateFAQJsonLd();
}

// FAQ 토글 기능
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const answer = document.getElementById(targetId);
      
      // 현재 상태 확인
      const isActive = this.classList.contains('active');
      
      // 모든 FAQ 닫기
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        const targetAnswerId = q.getAttribute('data-target');
        const targetAnswer = document.getElementById(targetAnswerId);
        if (targetAnswer) {
          targetAnswer.classList.remove('active');
        }
      });
      
      // 클릭한 FAQ가 닫혀있었다면 열기
      if (!isActive) {
        this.classList.add('active');
        if (answer) {
          answer.classList.add('active');
        }
      }
    });
  });
}

// Fade-in 애니메이션 초기화
function initFadeInAnimation() {
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
}

// 차트 초기화
function initChart() {
  const chartObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        renderChart();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  const chartElement = document.getElementById('confidenceChart');
  if (chartElement) {
    chartObserver.observe(chartElement);
  }
}

// 차트 렌더링
function renderChart() {
  const ctx = document.getElementById('confidenceChart').getContext('2d');
  const confidenceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['문법 정확도', '어휘 다양성', '발음 유창성', '대화 자신감', '전반적 실력'],
      datasets: [{
        label: '스픽 사용 전',
        data: [45, 40, 55, 30, 42],
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
        borderRadius: 5,
      }, {
        label: '스픽 사용 후 (3개월)',
        data: [85, 78, 90, 88, 86],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '스픽 사용 전후 스피킹 자신감 변화',
          font: {
            size: 18
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + '점';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: '자신감 점수 (100점 만점)'
          }
        }
      }
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 히어로 슬라이더 초기화
  new HeroSlider();
  
  // 쿠폰 로드
  loadAllCoupons();
  
  // FAQ 초기화
  initFAQ();
  
  // JSON-LD 생성
  generateHomeJsonLd();
  
  // Fade-in 애니메이션 초기화
  initFadeInAnimation();
  
  // 차트 초기화
  initChart();
});

// 전역 함수로 내보내기
window.HeroSlider = HeroSlider;
window.loadAllCoupons = loadAllCoupons;
window.renderAllCoupons = renderAllCoupons;
