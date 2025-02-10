'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Bookmark {
  id: string
  title: string
  url: string
  category: string | null
  created_at: string
}

interface BookmarkSelectorProps {
  collectionId: string
  onClose: () => void
}

export default function BookmarkSelector({
  collectionId,
  onClose,
}: BookmarkSelectorProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    try {
      const existingIds = await supabase
        .from('bookmark_collections')
        .select('bookmark_id')
        .eq('collection_id', collectionId)

      const query = supabase.from('bookmarks')

      if (existingIds.data && existingIds.data.length > 0) {
        query = query
          .select('*')
          .not('id', 'in', `(${existingIds.data.map((b) => b.bookmark_id).join(',')})`)
          .order('created_at', { ascending: false })
      } else {
        query = query
          .select('*')
          .order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (selectedBookmarks.length === 0) return

    setIsSaving(true)
    try {
      const bookmarkCollections = selectedBookmarks.map((bookmarkId) => ({
        bookmark_id: bookmarkId,
        collection_id: collectionId,
      }))

      const { error } = await supabase
        .from('bookmark_collections')
        .insert(bookmarkCollections)

      if (error) throw error

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error adding bookmarks to collection:', error)
      alert('Failed to add bookmarks to collection')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleBookmark = (bookmarkId: string) => {
    setSelectedBookmarks((prev) =>
      prev.includes(bookmarkId)
        ? prev.filter((id) => id !== bookmarkId)
        : [...prev, bookmarkId]
    )
  }

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div className="text-center py-4">Loading bookmarks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add Bookmarks to Collection</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
        {filteredBookmarks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-4 flex items-center space-x-4"
              >
                <input
                  type="checkbox"
                  checked={selectedBookmarks.includes(bookmark.id)}
                  onChange={() => toggleBookmark(bookmark.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {bookmark.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {bookmark.url}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery
              ? 'No bookmarks match your search'
              : 'No bookmarks available'}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={selectedBookmarks.length === 0 || isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Adding...' : `Add ${selectedBookmarks.length} Bookmark${selectedBookmarks.length === 1 ? '' : 's'}`}
        </button>
      </div>
    </div>
  )
}
