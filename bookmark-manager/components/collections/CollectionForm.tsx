'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CollectionFormProps {
}

export default function CollectionForm() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: collection, error } = await createClient()
      .from('collections')
      .insert({
        name,
        user_id: (await createClient().auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (!error && collection) {
      router.push(`/collections/${collection.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Collection Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Enter collection name"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Collection
      </button>
    </form>
  )
}
