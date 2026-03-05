/**
 * 문서 목록
 *
 * 새 PDF를 추가하려면:
 * 1. public/pdfs/{카테고리}/ 폴더에 PDF 파일을 넣습니다.
 * 2. 아래 배열에 항목을 추가합니다.
 *
 * 필드 설명:
 *   id       - 고유 식별자 (URL에 사용)
 *   category - categories 배열의 id와 일치해야 합니다
 *   title    - 문서 제목
 *   description - 간단한 설명
 *   fileName - public/pdfs/{category}/ 안의 실제 파일명
 *   pages    - 페이지 수 (선택)
 *   size     - 파일 크기 (선택)
 *   tags     - 태그 배열 (선택)
 *   addedAt  - 추가 날짜 (선택)
 */
export const documents = [
  // === 프로그래밍 ===
  {
    id: 'python-basics',
    category: 'programming',
    title: 'Python 기초 문법 정리',
    description: 'Python 기본 문법, 자료형, 제어문, 함수 등을 정리한 자료입니다.',
    fileName: 'python-basics.pdf',
    pages: 45,
    size: '2.3MB',
    tags: ['Python', '기초'],
    addedAt: '2025-01-15',
  },
  {
    id: 'javascript-es6',
    category: 'programming',
    title: 'JavaScript ES6+ 핵심 정리',
    description: 'ES6 이후 추가된 주요 문법과 패턴을 정리한 자료입니다.',
    fileName: 'javascript-es6.pdf',
    pages: 38,
    size: '1.8MB',
    tags: ['JavaScript', 'ES6'],
    addedAt: '2025-02-10',
  },

  // === 컴퓨터과학 ===
  {
    id: 'data-structures',
    category: 'computer-science',
    title: '자료구조 핵심 정리',
    description: '배열, 연결 리스트, 스택, 큐, 트리, 그래프 등 핵심 자료구조.',
    fileName: 'data-structures.pdf',
    pages: 62,
    size: '3.1MB',
    tags: ['자료구조', '알고리즘'],
    addedAt: '2025-01-20',
  },
  {
    id: 'algorithms-intro',
    category: 'computer-science',
    title: '알고리즘 입문',
    description: '정렬, 탐색, 동적 프로그래밍 등 기본 알고리즘 정리.',
    fileName: 'algorithms-intro.pdf',
    pages: 55,
    size: '2.7MB',
    tags: ['알고리즘', '기초'],
    addedAt: '2025-03-05',
  },

  // === 수학 ===
  {
    id: 'linear-algebra',
    category: 'mathematics',
    title: '선형대수학 요약',
    description: '벡터, 행렬, 고유값, 선형변환 등 핵심 개념 정리.',
    fileName: 'linear-algebra.pdf',
    pages: 48,
    size: '2.5MB',
    tags: ['선형대수', '수학'],
    addedAt: '2025-02-01',
  },

  // === 과학 ===
  {
    id: 'physics-mechanics',
    category: 'science',
    title: '일반물리학 - 역학',
    description: '뉴턴 역학, 에너지, 운동량 등 역학 핵심 정리.',
    fileName: 'physics-mechanics.pdf',
    pages: 40,
    size: '2.0MB',
    tags: ['물리', '역학'],
    addedAt: '2025-01-25',
  },

  // === 영어 ===
  {
    id: 'english-grammar',
    category: 'english',
    title: '영문법 핵심 정리',
    description: '시제, 관계사, 가정법 등 핵심 영문법 정리.',
    fileName: 'english-grammar.pdf',
    pages: 52,
    size: '1.9MB',
    tags: ['문법', '기초'],
    addedAt: '2025-02-15',
  },

  // === 경제/경영 ===
  {
    id: 'economics-intro',
    category: 'business',
    title: '경제학 원론 요약',
    description: '미시경제, 거시경제 핵심 개념 정리.',
    fileName: 'economics-intro.pdf',
    pages: 58,
    size: '2.8MB',
    tags: ['경제학', '기초'],
    addedAt: '2025-03-01',
  },

  // === 자격증 ===
  {
    id: 'engineer-info-processing',
    category: 'certifications',
    title: '정보처리기사 요약 정리',
    description: '정보처리기사 필기 핵심 이론 요약.',
    fileName: 'engineer-info-processing.pdf',
    pages: 75,
    size: '4.2MB',
    tags: ['정보처리기사', '자격증'],
    addedAt: '2025-02-20',
  },
]

/** 카테고리별 문서 조회 */
export function getDocumentsByCategory(categoryId) {
  return documents.filter((doc) => doc.category === categoryId)
}

/** ID로 문서 조회 */
export function getDocumentById(id) {
  return documents.find((doc) => doc.id === id)
}

/** 전체 문서 검색 (제목, 설명, 태그) */
export function searchDocuments(query) {
  const q = query.toLowerCase()
  return documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(q)))
  )
}
