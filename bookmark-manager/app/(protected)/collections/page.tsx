'use client'

import { useState } from 'react'
import CollectionForm from '@/components/collections/CollectionForm'
import CollectionList from '@/components/collections/CollectionList'

export default function CollectionsPage() {
  const [isAddingCollection, setIsAddingCollection] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Collections</h1>
        <button
          onClick={() => setIsAddingCollection(!isAddingCollection)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isAddingCollection ? 'Cancel' : 'New Collection'}
        </button>
      </div>

      {isAddingCollection && (
        <div className="bg-white p-4 rounded-lg shadow">
          <CollectionForm onSuccess={() => setIsAddingCollection(false)} />
        </div>
      )}

      <CollectionList />
    </div>
  )
}
