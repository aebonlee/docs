export const ADMIN_EMAILS = [
  'aebon@dreamitbiz.com',
]

export function isAdmin(email) {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
