import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'
import { toast } from "sonner";



const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

const categories = ["Housing", "Food", "Transportation", "Utilities", "Entertainment", "Other"]

interface CreateBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBudgetCreated: () => void  
}

export function CreateBudgetDialog({ open, onOpenChange, onBudgetCreated }: CreateBudgetDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [emoji, setEmoji] = useState("💰")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('jwt_token')
    setError(null)

    try {
      const response = await fetch('https://spendtrail-backend.onrender.com/api/create_budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          budget_category: category,
          budget_emoji: emoji,
          budget_amount: Number(amount),
        }),
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.detail || 'Failed to create budget')
      }

      onBudgetCreated()
      toast.success('Budget has been created')
      onOpenChange(false)
      setAmount("")
      setCategory("")
      setEmoji("💰")
    } catch (error: any) {
      console.error('Error creating budget:', error)
      toast.error('Budget has not been created')
      setError(error.message || 'An error occurred while creating the budget')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Emoji</Label>
              <div className="col-span-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {emoji} Select Emoji
                </Button>
                {showEmojiPicker && (
                  <div className="mt-2 max-h-[200px] overflow-y-auto">
                    <EmojiPicker
                      onEmojiClick={(emojiObject) => {
                        setEmoji(emojiObject.emoji)
                        setShowEmojiPicker(false)
                      }}
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-600">Create Budget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}