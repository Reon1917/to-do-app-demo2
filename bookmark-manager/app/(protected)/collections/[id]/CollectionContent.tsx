'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import { Database } from '@/lib/database.types'
import { useRouter } from 'next/router'
import Input from '@/components/ui/Input'

type Collection = Database['public']['Tables']['collections']['Row']
type Bookmark = Database['public']['Tables']['bookmarks']['Row']

interface CollectionContentProps {
  collection: Collection
  bookmarks: Bookmark[]
}

export default function CollectionContent({
  collection,
  bookmarks,
}: CollectionContentProps) {
  const [name, setName] = useState(collection.name)
  const router = useRouter()

  const handleUpdateName = async () => {
    const { error } = await createClient()
      .from('collections')
      .update({ name })
      .eq('id', collection.id)

    if (!error) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleUpdateName}
            className="text-2xl font-bold bg-transparent border-0 p-0 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            collectionId={collection.id}
          />
        ))}
      </div>

      {bookmarks.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          This collection is empty. Add some bookmarks!
        </p>
      )}
    </div>
  )
}
