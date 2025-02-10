import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignInForm from '@/components/auth/SignInForm'

export default async function SignInPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500">Sign in to your account to continue</p>
      </div>
      <SignInForm />
    </div>
  )
}
