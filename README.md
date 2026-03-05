# Docs Library

분야별 학습 자료를 정리하고 바로 열람할 수 있는 문서 라이브러리입니다.

## 기능

- 분야별 PDF 문서 카테고리 분류
- 브라우저 내 PDF 바로보기
- 문서 검색 (제목, 설명, 태그)
- 다크/라이트 모드 및 5가지 테마 색상
- 반응형 디자인

## 카테고리

| 분야 | 폴더 |
|------|------|
| 프로그래밍 | `public/pdfs/programming/` |
| 컴퓨터과학 | `public/pdfs/computer-science/` |
| 수학 | `public/pdfs/mathematics/` |
| 과학 | `public/pdfs/science/` |
| 영어 | `public/pdfs/english/` |
| 경제/경영 | `public/pdfs/business/` |
| 자격증 | `public/pdfs/certifications/` |
| 기타 | `public/pdfs/others/` |

## PDF 추가 방법

1. 해당 분야 폴더에 PDF 파일을 넣습니다.
   - 예: `public/pdfs/programming/react-hooks.pdf`

2. `src/data/documents.js` 파일에 항목을 추가합니다:

```javascript
{
  id: 'react-hooks',           // 고유 ID (URL에 사용)
  category: 'programming',     // 카테고리 ID
  title: 'React Hooks 완벽 가이드',
  description: 'useState, useEffect 등 React Hooks 사용법 정리.',
  fileName: 'react-hooks.pdf', // PDF 파일명
  pages: 30,                   // 페이지 수 (선택)
  size: '1.5MB',               // 파일 크기 (선택)
  tags: ['React', 'Hooks'],    // 태그 (선택)
  addedAt: '2025-03-01',       // 추가 날짜 (선택)
}
```

3. 커밋 후 푸시하면 GitHub Actions가 자동으로 배포합니다.

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 기술 스택

- React 19 + React Router 7
- Vite 6
- GitHub Pages (자동 배포)
