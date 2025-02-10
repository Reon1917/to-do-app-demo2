'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CollectionProps {
  collection: {
    id: string
    name: string
    created_at: string
  }
  onDelete?: () => void
}

export default function CollectionCard({ collection, onDelete }: CollectionProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const { error } = await createClient()
      .from('collections')
      .delete()
      .eq('id', collection.id)

    if (!error && onDelete) {
      onDelete()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-lg font-semibold cursor-pointer hover:text-blue-600"
          onClick={() => router.push(`/collections/${collection.id}`)}
        >
          {collection.name}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/collections/${collection.id}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-gray-500">
        Created {formatDistanceToNow(new Date(collection.created_at), { addSuffix: true })}
      </p>
    </div>
  )
}
