"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const categories = ["Housing", "Food", "Transportation", "Utilities", "Entertainment", "Other"];

interface CreateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseCreated: () => void;
}

export function CreateExpenseDialog({ open, onOpenChange, onExpenseCreated }: CreateExpenseDialogProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState("💰");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store error message
  const { toast } = useToast(); // Toast for notifications

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch("https://spendtrail-backend.onrender.com/api/create_expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expense_category: category,
          expense_emoji: emoji,
          expense_amount: Number(amount),
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.detail || "Failed to create expense"); // Store error
        toast({
          variant: "destructive",
          title: "Error",
          description: errorResponse.detail || "Failed to create expense",
        });
        return;
      }

      // Success: Reset form and close modal
      onExpenseCreated();
      setAmount("");
      setCategory("");
      setEmoji("💰");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating expense:", error);
      setErrorMessage("An unexpected error occurred.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Category */}
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
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
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

            {/* Emoji Picker */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Emoji</Label>
              <div className="col-span-3">
                <Button type="button" variant="outline" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  {emoji} Select Emoji
                </Button>
                {showEmojiPicker && (
                  <div className="mt-2 max-h-[200px] overflow-y-auto">
                    <EmojiPicker
                      onEmojiClick={(emojiObject) => {
                        setEmoji(emojiObject.emoji);
                        setShowEmojiPicker(false);
                      }}
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-600" disabled={loading}>
              {loading ? "Creating..." : "Create Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}