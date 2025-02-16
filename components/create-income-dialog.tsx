"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import {toast} from "sonner";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const categories = ["Salary", "Freelance", "Investments", "Rental", "Other"];

interface CreateIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncomeCreated: () => void;
}

export function CreateIncomeDialog({
  open,
  onOpenChange,
  onIncomeCreated,
}: CreateIncomeDialogProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState("💰");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setEmoji("💰");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt_token");

    if (!amount || !category) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch("https://spendtrail-backend.onrender.com/api/create_income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          income_category: category,
          income_emoji: emoji,
          income_amount: Number(amount),
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.detail || "Failed to create income");
      }
    
      toast.success("Income created successfully");
      onIncomeCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Income</DialogTitle>
        </DialogHeader>
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
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
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
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-600">
              Create Income
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}