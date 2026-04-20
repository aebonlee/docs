export const ADMIN_EMAILS: string[] = [
  'aebon@kakao.com',
  'radical8566@gmail.com',
  'aebon@kyonggi.ac.kr',
]

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
