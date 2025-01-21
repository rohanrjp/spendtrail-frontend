"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";

export function AIFinancialAdvice() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("User is not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://spendtrail-backend.onrender.com/api/ai",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch financial advice. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setAdvice(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvice();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          AI Financial Advice
        </CardTitle>
        <Brain className="h-4 w-4 text-purple-500" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[100px] w-full bg-slate-200 dark:bg-gray-800 animate-pulse" />
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{advice}</p>
        )}
      </CardContent>
    </Card>
  );
}
