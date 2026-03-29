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


## License / 라이선스

**저작권 (c) 2025-2026 드림아이티비즈(DreamIT Biz). 모든 권리 보유.**

본 소프트웨어는 저작권법 및 지적재산권법에 의해 보호되는 독점 소프트웨어입니다. 본 프로젝트는 소프트웨어 저작권 등록이 완료되어 법적 보호를 받습니다.

- 본 소프트웨어의 무단 복제, 수정, 배포 또는 사용은 엄격히 금지됩니다.
- 저작권자의 사전 서면 허가 없이 본 소프트웨어의 어떠한 부분도 복제하거나 전송할 수 없습니다.
- 본 소프트웨어는 DreamIT Biz(https://www.dreamitbiz.com) 교육 플랫폼의 일부로 제공됩니다.

라이선스 문의: aebon@dreamitbiz.com

---

**Copyright (c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.**

This software is proprietary and protected under applicable copyright and intellectual property laws. This project has been registered for software copyright protection.

- Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
- No part of this software may be reproduced or transmitted in any form without prior written permission from the copyright holder.
- This software is provided as part of the DreamIT Biz (https://www.dreamitbiz.com) educational platform.

For licensing inquiries, contact: aebon@dreamitbiz.com

---

**Designed & Developed by Ph.D Aebon Lee**

DreamIT Biz | https://www.dreamitbiz.com

