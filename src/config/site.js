export const siteConfig = {
  name: 'Docs Library',
  description: '분야별 학습 자료 라이브러리',
  logo: 'Docs',
  github: 'https://github.com/aebonlee/docs',

  nav: [
    { label: '홈', path: '/' },
    { label: '프로그래밍', path: '/category/programming' },
    { label: '컴퓨터과학', path: '/category/computer-science' },
    { label: '수학', path: '/category/mathematics' },
    { label: '과학', path: '/category/science' },
    { label: '영어', path: '/category/english' },
    { label: '경제/경영', path: '/category/business' },
    { label: '자격증', path: '/category/certifications' },
    { label: '기타', path: '/category/others' },
  ],

  footer: {
    copyright: 'Docs Library',
    links: [
      { label: 'GitHub', url: 'https://github.com/aebonlee/docs' },
    ],
  },
}

export const categories = [
  {
    id: 'programming',
    name: '프로그래밍',
    description: 'Python, JavaScript, Java 등 프로그래밍 언어 학습 자료',
    color: '#3b82f6',
    icon: 'code',
  },
  {
    id: 'computer-science',
    name: '컴퓨터과학',
    description: '자료구조, 알고리즘, 운영체제, 네트워크 등',
    color: '#8b5cf6',
    icon: 'cpu',
  },
  {
    id: 'mathematics',
    name: '수학',
    description: '미적분, 선형대수, 통계, 이산수학 등',
    color: '#10b981',
    icon: 'calculator',
  },
  {
    id: 'science',
    name: '과학',
    description: '물리, 화학, 생물, 지구과학 등',
    color: '#14b8a6',
    icon: 'flask',
  },
  {
    id: 'english',
    name: '영어',
    description: '문법, 독해, 회화, TOEIC, TOEFL 등',
    color: '#f59e0b',
    icon: 'book',
  },
  {
    id: 'business',
    name: '경제/경영',
    description: '경제학, 경영학, 회계, 마케팅 등',
    color: '#ef4444',
    icon: 'chart',
  },
  {
    id: 'certifications',
    name: '자격증',
    description: '정보처리기사, 네트워크관리사, AWS 등 자격증 준비 자료',
    color: '#eab308',
    icon: 'award',
  },
  {
    id: 'others',
    name: '기타',
    description: '기타 학습 자료',
    color: '#6b7280',
    icon: 'folder',
  },
]
