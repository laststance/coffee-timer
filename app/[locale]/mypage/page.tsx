import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { MyPageContent } from '@/components/mypage/MyPageContent'

/**
 * My Page - Protected server component.
 * Validates session server-side and redirects to sign-in if unauthenticated.
 * The proxy.ts middleware provides a lightweight cookie check as the first gate.
 */
// eslint-disable-next-line @laststance/react-next/all-memo -- async server components cannot be wrapped in React.memo
export default async function MyPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  return <MyPageContent />
}
