"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { removeToken, getToken } from "@/utils/auth";
import { Loader2 } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  join_date: string;
  income_goal?: number;
  savings_goal?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [incomeGoal, setIncomeGoal] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingSavings, setLoadingSavings] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No token found, please log in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://spendtrail-backend.onrender.com/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.detail || "Failed to fetch user data, Please login again"
          );
        }

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateGoal = async (goalType: "income" | "savings") => {
    const token = getToken();
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const goalValue = goalType === "income" ? incomeGoal : savingsGoal;
    if (!goalValue || isNaN(parseFloat(goalValue))) {
      alert("Please enter a valid amount");
      return;
    }

    goalType === "income" ? setLoadingIncome(true) : setLoadingSavings(true);

    try {
      const res = await fetch(
        `https://spendtrail-backend.onrender.com/api/dashboard/update_${goalType}_goal`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount_to_update: parseFloat(goalValue) }),
        }
      );

      const responseData = await res.json();
      console.log("API Response:", responseData);

      if (!res.ok)
        throw new Error(responseData.detail || "Failed to update goal");

      setUserData((prev) =>
        prev ? { ...prev, [`${goalType}_goal`]: parseFloat(goalValue) } : prev
      );

      goalType === "income" ? setIncomeGoal("") : setSavingsGoal("");
      alert(
        `${
          goalType === "income" ? "Income" : "Savings"
        } goal updated successfully`
      );
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      goalType === "income"
        ? setLoadingIncome(false)
        : setLoadingSavings(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    removeToken();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto text-gray-500" size={24} />
        <p className="mt-2 text-gray-500">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push("/sign-in")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-35 w-35">
              {userData?.avatar && userData.avatar.startsWith("http") ? (
                <AvatarImage src={userData.avatar} alt={userData.name} />
              ) : (
                <AvatarFallback className="bg-blue-300 text-white text-5xl flex items-center justify-center w-full h-full">
                  {userData?.avatar ||
                    userData?.name?.charAt(0).toUpperCase() ||
                    "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-4xl">{userData?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{userData?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">User ID</p>
              <p>{userData?.id}</p>
            </div>
            <div>
              <p className="font-semibold">Join Date</p>
              <p>
                {userData?.join_date
                  ? new Date(userData.join_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Income Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter new income goal"
            value={incomeGoal}
            onChange={(e) => setIncomeGoal(e.target.value)}
          />
          <Button
            onClick={() => handleUpdateGoal("income")}
            disabled={loadingIncome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loadingIncome ? "Updating..." : "Update Income Goal"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Savings Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter new savings goal"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
          />
          <Button
            onClick={() => handleUpdateGoal("savings")}
            disabled={loadingSavings}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loadingSavings ? "Updating..." : "Update Savings Goal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
