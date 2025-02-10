'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CollectionBookmark {
  bookmark_id: string
  bookmark: {
    id: string
    title: string
    url: string
    category: string | null
  }
}

interface CollectionBookmarkListProps {
  collectionId: string
}

export default function CollectionBookmarkList({
  collectionId,
}: CollectionBookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<CollectionBookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchBookmarks()
  }, [collectionId])

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmark_collections')
        .select('bookmark_id, bookmark:bookmarks (id, title, url, category)')
        .eq('collection_id', collectionId)
        .order('bookmark_id')

      if (error) throw error

      const formattedData: CollectionBookmark[] = data?.map(item => ({
        bookmark_id: item.bookmark_id,
        bookmark: Array.isArray(item.bookmark) ? item.bookmark[0] : item.bookmark
      })) || []

      setBookmarks(formattedData)
    } catch (error) {
      console.error('Error fetching collection bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBookmark = async (bookmarkId: string) => {
    if (!confirm('Are you sure you want to remove this bookmark from the collection?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('bookmark_collections')
        .delete()
        .match({
          collection_id: collectionId,
          bookmark_id: bookmarkId,
        })

      if (error) throw error

      setBookmarks((prev) =>
        prev.filter((item) => item.bookmark_id !== bookmarkId)
      )
      router.refresh()
    } catch (error) {
      console.error('Error removing bookmark from collection:', error)
      alert('Failed to remove bookmark from collection')
    }
  }

  const filteredBookmarks = bookmarks.filter((item) =>
    item.bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div className="text-center">Loading bookmarks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex">
        <input
          type="text"
          placeholder="Search bookmarks in collection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      {filteredBookmarks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map(({ bookmark }) => (
            <div
              key={bookmark.id}
              className="p-4 bg-white rounded-lg shadow space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium truncate">{bookmark.title}</h3>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate block"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Remove from collection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {bookmark.category && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                  {bookmark.category}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {searchQuery
            ? 'No bookmarks match your search'
            : 'No bookmarks in this collection'}
        </div>
      )}
    </div>
  )
}
