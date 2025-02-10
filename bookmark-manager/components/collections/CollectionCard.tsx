'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CollectionCardProps {
  collection: {
    id: string
    name: string
    is_public: boolean
    bookmark_count?: number
  }
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .match({ id: collection.id })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert('Failed to delete collection')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleShare = async () => {
    if (collection.is_public) {
      const shareUrl = `${window.location.origin}/shared/${collection.id}`
      await navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard!')
    } else {
      if (confirm('This collection is private. Would you like to make it public to share?')) {
        try {
          const { error } = await supabase
            .from('collections')
            .update({ is_public: true })
            .match({ id: collection.id })

          if (error) throw error

          router.refresh()
          const shareUrl = `${window.location.origin}/shared/${collection.id}`
          await navigator.clipboard.writeText(shareUrl)
          alert('Collection is now public and share link has been copied to clipboard!')
        } catch (error) {
          console.error('Error updating collection:', error)
          alert('Failed to make collection public')
        }
      }
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Link
            href={`/collections/${collection.id}`}
            className="font-medium hover:text-indigo-600"
          >
            {collection.name}
          </Link>
          <div className="flex space-x-2">
            <span className={`inline-block px-2 py-1 text-xs ${
              collection.is_public
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            } rounded`}>
              {collection.is_public ? 'Public' : 'Private'}
            </span>
            {collection.bookmark_count !== undefined && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                {collection.bookmark_count} bookmarks
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-indigo-500"
            title="Share collection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 disabled:opacity-50"
            title="Delete collection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
