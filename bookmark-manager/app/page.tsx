import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold text-indigo-600">
              Bookmark Manager
            </div>
            <Link
              href="/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="mt-16 sm:mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">
                  Welcome to
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Organize Your</span>
                  <span className="block text-indigo-600">Bookmarks</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                A modern way to save, organize, and share your favorite websites.
                Create collections, add tags, and access your bookmarks from anywhere.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <Link
                  href="/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80"
                    alt="Screenshot of the bookmark manager"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <div className="mt-24 bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                All-in-one bookmark management
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Everything you need to organize your online resources effectively
              </p>
            </div>
            <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
              {[
                {
                  name: 'Organize Collections',
                  description:
                    'Group your bookmarks into collections for better organization',
                },
                {
                  name: 'Easy Sharing',
                  description:
                    'Share your collections with others via public links',
                },
                {
                  name: 'Quick Search',
                  description:
                    'Find any bookmark instantly with powerful search functionality',
                },
                {
                  name: 'Secure Access',
                  description:
                    'Your bookmarks are private and secure with user authentication',
                },
                {
                  name: 'Categories',
                  description:
                    'Add categories to your bookmarks for easy filtering',
                },
                {
                  name: 'Mobile Friendly',
                  description:
                    'Access your bookmarks from any device with responsive design',
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <p className="text-lg leading-6 font-medium text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
