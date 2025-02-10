import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

interface SharedCollectionPageProps {
  params: {
    collectionId: string
  }
}

export default async function SharedCollectionPage({
  params: { collectionId },
}: SharedCollectionPageProps) {
  const supabase = createClient()

  // Fetch collection and its bookmarks
  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .eq('is_public', true)
    .single()

  if (!collection) {
    notFound()
  }

  const { data: bookmarks } = await supabase
    .from('bookmark_collections')
    .select(`
      bookmark_id,
      bookmarks (
        id,
        title,
        url,
        category
      )
    `)
    .eq('collection_id', collectionId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{collection.name}</h1>
            <p className="text-gray-500">Shared Collection</p>
          </div>

          {bookmarks && bookmarks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map(({ bookmarks: bookmark }) => (
                <div
                  key={bookmark.id}
                  className="p-4 bg-white border rounded-lg space-y-2"
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
            <p className="text-center text-gray-500">
              This collection has no bookmarks
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
