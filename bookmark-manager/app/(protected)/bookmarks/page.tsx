'use client'

import { useState } from 'react'
import BookmarkForm from '@/components/bookmarks/BookmarkForm'
import BookmarkList from '@/components/bookmarks/BookmarkList'

export default function BookmarksPage() {
  const [isAddingBookmark, setIsAddingBookmark] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <button
          onClick={() => setIsAddingBookmark(!isAddingBookmark)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isAddingBookmark ? 'Cancel' : 'Add Bookmark'}
        </button>
      </div>

      {isAddingBookmark && (
        <div className="bg-white p-4 rounded-lg shadow">
          <BookmarkForm onSuccess={() => setIsAddingBookmark(false)} />
        </div>
      )}

      <BookmarkList />
    </div>
  )
}
