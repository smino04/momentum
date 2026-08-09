# MOMENT

군인 전용 룩스맥싱 트래커 MVP.
"다음 휴가까지 매일 조금씩 더 나아진다."

## 실행 방법

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/ 에 프로덕션 빌드 생성
npm run preview   # 빌드 결과 미리보기
```

모든 데이터는 브라우저 `localStorage`에 저장되며, 백엔드/로그인 없이 완전히 오프라인으로 동작합니다.

## 구현된 기능

- 첫 실행 온보딩 (휴가 날짜 → 관리 항목 → 체중 → 시작)
- 휴가 D-Day 자동 계산 (`D-18`, `D-DAY`, 날짜 경과 시 안내)
- 오늘의 루틴 체크리스트 (그룹별, 날짜별 기록)
- Momentum 지수 (최근 30일 수행률 기반, 하루 실패해도 급락하지 않음)
- Recovery System (오늘 완료율 40% 이하일 때 회복 루틴 카드 노출)
- Progress 화면: Momentum / 관리일 / 완료율, 체중 기록 + 30일 그래프, Photo Journal(주차별 비교)
- Leave Day 전용 화면 (지난 30일 Momentum/체중 변화, Before → Now 사진)
- Profile 화면: 기본 정보, 휴가 날짜 변경, 관리 항목 토글, 데이터 초기화
- 모바일 우선 반응형 레이아웃 (390×844 기준), 하단 고정 네비게이션
- PWA (manifest + service worker, 홈 화면 추가 가능)
- 새로고침/재방문 시 데이터 유지

## 기술 스택

React + Vite + Tailwind CSS v4 + lucide-react + localStorage

## 배포

`main` 브랜치에 push되면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 빌드하여 GitHub Pages에 배포합니다.
저장소 Settings → Pages → Source를 "GitHub Actions"로 설정해야 합니다.
