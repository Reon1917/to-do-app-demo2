'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import CollectionBookmarkList from '@/components/collections/CollectionBookmarkList'
import BookmarkSelector from '@/components/collections/BookmarkSelector'

interface CollectionDetailPageProps {
  params: {
    id: string
  }
}

export default function CollectionDetailPage({
  params: { id: collectionId },
}: CollectionDetailPageProps) {
  const [collection, setCollection] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingBookmarks, setIsAddingBookmarks] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCollection()
  }, [collectionId])

  const fetchCollection = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single()

      if (error) throw error

      setCollection(data)
    } catch (error) {
      console.error('Error fetching collection:', error)
      router.push('/collections')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVisibilityToggle = async () => {
    if (!collection) return

    try {
      const { error } = await supabase
        .from('collections')
        .update({ is_public: !collection.is_public })
        .eq('id', collectionId)

      if (error) throw error

      setCollection({
        ...collection,
        is_public: !collection.is_public,
      })
    } catch (error) {
      console.error('Error updating collection visibility:', error)
      alert('Failed to update collection visibility')
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading collection...</div>
  }

  if (!collection) {
    return <div className="text-center">Collection not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <button
              onClick={handleVisibilityToggle}
              className={`inline-flex items-center px-2.5 py-1.5 text-sm font-medium rounded-md ${
                collection.is_public
                  ? 'text-green-700 bg-green-100 hover:bg-green-200'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {collection.is_public ? 'Public' : 'Private'}
            </button>
            {collection.is_public && (
              <button
                onClick={async () => {
                  const shareUrl = `${window.location.origin}/shared/${collectionId}`
                  await navigator.clipboard.writeText(shareUrl)
                  alert('Share link copied to clipboard!')
                }}
                className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Copy Share Link
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsAddingBookmarks(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Bookmarks
        </button>
      </div>

      {isAddingBookmarks && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <BookmarkSelector
              collectionId={collectionId}
              onClose={() => setIsAddingBookmarks(false)}
            />
          </div>
        </div>
      )}

      <CollectionBookmarkList collectionId={collectionId} />
    </div>
  )
}
