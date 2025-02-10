import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Bookmarks</h2>
        {bookmarks && bookmarks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-4 bg-white rounded-lg shadow space-y-2"
              >
                <h3 className="font-medium truncate">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                >
                  {bookmark.url}
                </a>
                {bookmark.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                    {bookmark.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No bookmarks yet</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Collections</h2>
        {collections && collections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="p-4 bg-white rounded-lg shadow space-y-2"
              >
                <h3 className="font-medium">{collection.name}</h3>
                <span className={`inline-block px-2 py-1 text-xs ${
                  collection.is_public
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                } rounded`}>
                  {collection.is_public ? 'Public' : 'Private'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No collections yet</p>
        )}
      </section>
    </div>
  )
}
