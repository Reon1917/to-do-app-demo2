'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  user: User
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/signin'
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Bookmarks', href: '/bookmarks' },
    { name: 'Collections', href: '/collections' },
  ]

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link 
              href="/dashboard"
              className="flex items-center font-bold text-xl text-indigo-600"
            >
              Bookmark Manager
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
