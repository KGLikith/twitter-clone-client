import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type Props = {
  showDeleteDialog: boolean
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>
  confirmDelete: () => void
  isDeleting: boolean
}

export const DeleteTweetModal = ({ showDeleteDialog, setShowDeleteDialog, confirmDelete, isDeleting }: Props) => {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="bg-black border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Delete Tweet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete this tweet? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            className="border-gray-700 text-white hover:bg-gray-900 hover:text-white"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}