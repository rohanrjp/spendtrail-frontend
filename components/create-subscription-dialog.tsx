"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const categories = ["Housing", "Food", "Transportation", "Utilities", "Entertainment", "Other"];
const frequencies = ["daily", "weekly", "monthly", "yearly"];

interface CreateSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionCreated: () => void;
}

export function CreateSubscriptionDialog({
  open,
  onOpenChange,
  onSubscriptionCreated,
}: CreateSubscriptionDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeatCount, setRepeatCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorToastShown, setErrorToastShown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setErrorToastShown(false);

    if (!endDate && !repeatCount) {
      const errorMsg = "Please provide either an end date or number of times for the subscription";
      setErrorMessage(errorMsg);
      if (!errorToastShown) {
        toast.error(errorMsg);
        setErrorToastShown(true);
      }
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt_token");

    try {
      const payload = {
        name,
        amount: Number(amount),
        category,
        frequency,
        start_date: startDate,
        ...(endDate && { end_date: endDate }),
        ...(repeatCount && { repeat_count: Number(repeatCount) }),
      };

      const response = await fetch("https://spendtrail-backend.onrender.com/api/create_subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMsg = errorResponse.detail || "Subscription has not been created";

        setErrorMessage(errorMsg);

        if (!errorToastShown) {
          toast.error(errorMsg);
          setErrorToastShown(true);
        }
        return;
      }

      onSubscriptionCreated();
      toast.success("Subscription has been created");

      setName("");
      setAmount("");
      setCategory("");
      setFrequency("");
      setStartDate("");
      setEndDate("");
      setRepeatCount("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      const errorMsg = "An unexpected error occurred.";
      setErrorMessage(errorMsg);

      if (!errorToastShown) {
        toast.error(errorMsg);
        setErrorToastShown(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Netflix Premium"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger>
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

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select onValueChange={setFrequency} value={frequency} required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Optional if repeat count is provided"
            />
          </div>

          <div>
            <Label htmlFor="repeatCount">
              Repeat Count
            </Label>
            <Input
              id="repeatCount"
              type="number"
              min="1"
              value={repeatCount}
              onChange={(e) => setRepeatCount(e.target.value)}
              placeholder="Optional if end date is provided"
            />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="text-red-500">*</span> Either end date or repeat count must be provided
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-600 w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
