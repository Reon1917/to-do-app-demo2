'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import CollectionCard from './CollectionCard'

interface Collection {
  id: string
  name: string
  is_public: boolean
  bookmark_count: number
}

export default function CollectionList() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      // First get all collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('name')

      if (collectionsError) throw collectionsError

      // Then get bookmark counts for each collection
      const collectionsWithCounts = await Promise.all(
        (collectionsData || []).map(async (collection) => {
          const { count, error: countError } = await supabase
            .from('bookmark_collections')
            .select('*', { count: 'exact' })
            .eq('collection_id', collection.id)

          if (countError) throw countError

          return {
            ...collection,
            bookmark_count: count || 0,
          }
        })
      )

      setCollections(collectionsWithCounts)
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div className="text-center">Loading collections...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex">
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      {filteredCollections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {searchQuery
            ? 'No collections match your search'
            : 'No collections yet'}
        </div>
      )}
    </div>
  )
}
