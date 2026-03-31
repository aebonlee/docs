export const ADMIN_EMAILS: string[] = [
  'aebon@dreamitbiz.com',
]

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
