'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentExpenses } from "@/components/recent-expenses";
import { ExpenseCategories } from "@/components/expense-categories";
import  IncomeExpenseAnalysis  from "@/components/incomevsexpense";
import { CreditCard, Wallet, PiggyBank, TrendingUp } from "lucide-react";
import { AIFinancialAdvice } from "@/components/ai-financial-advice";

type FinancialData = {
  expenses: { current: number; goal: number };
  budget: { current: number; goal: number };
  income: { current: number; goal: number };
  savings: { current: number; goal: number };
};


type PieChartCategoryData = {
  name: string;
  value: number;
};

type IncomeExpenseData = {
  label: string;
  amount: number;
  fill: string;
};

type DashboardDataItem = {
  type: "incomeExpenseAnalysis" | "Piechart_data"; // Restrict to valid types
  data: IncomeExpenseData[] | PieChartCategoryData[]; // Depending on type
};

const calculatePercentage = (current: number, goal: number) => {
  if (goal === 0) {
    return 0;  // To handle division by zero (avoid infinity)
  }
  return Math.round((current / goal) * 100);
};

export default function DashboardPage() {
  const [incomeExpenseData, setIncomeExpenseData] = useState<IncomeExpenseData[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartCategoryData[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);

  // Fetch data function with JWT token
  const fetchDashboardData = async () => {
    const jwtToken = localStorage.getItem('jwt_token');  // Retrieve JWT token from local storage

    if (!jwtToken) {
      console.error("JWT token is missing in localStorage.");
      return;
    }

    try {
      // Make the API request with Authorization header
      const response = await fetch("https://spendtrail-backend.onrender.com/api/dashboard/graphs", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Ensure the response is ok
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: DashboardDataItem[] = await response.json();

      // Process and set data for respective components
      const incomeExpenseAnalysis = data.find(
        (item) => item.type === "incomeExpenseAnalysis"
      )?.data;

      const pieChartCategories = data.find(
        (item) => item.type === "Piechart_data"
      )?.data;

      setIncomeExpenseData(incomeExpenseAnalysis as IncomeExpenseData[] || []);
      setPieChartData(pieChartCategories as PieChartCategoryData[] || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchFinancialData = async () => {
    const jwtToken = localStorage.getItem('jwt_token');  // Retrieve JWT token from local storage
  
    if (!jwtToken) {
      console.error("JWT token is missing in localStorage.");
      return;
    }
  
    try {
      // Make the API request with Authorization header for financialData
      const response = await fetch("https://spendtrail-backend.onrender.com/api/dashboard/financialData", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Ensure the response is ok
      if (!response.ok) {
        throw new Error(`Error fetching financial data: ${response.statusText}`);
      }
  
      const data: FinancialData | null = await response.json();
  
      // Check if data is not null before using it
      if (data) {
        setFinancialData(data);  // Assuming you have a state setter `setFinancialData`
      } else {
        console.error("Received null financial data");
      }
    } catch (error) {
      console.error("Error fetching financial data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchFinancialData();
  }, []);

  if (!financialData) {
    return <div>Loading financial data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1">
        <AIFinancialAdvice />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{financialData.expenses.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentage(financialData.expenses.current, financialData.expenses.goal)}% of total budget</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-red-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.expenses.current, financialData.expenses.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹{financialData.expenses.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{financialData?.budget.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">₹{(financialData.budget.goal - financialData?.budget.current).toFixed(2)} remaining</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-green-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.budget.current, financialData.budget.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹{financialData.budget.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{financialData.income.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentage(financialData.income.current, financialData.income.goal)}% of total incomes goal</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.income.current, financialData.income.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹{financialData.income.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{financialData.savings.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentage(financialData.savings.current, financialData.savings.goal)}% of savings goal</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-purple-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.savings.current, financialData.savings.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹{financialData.savings.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentExpenses />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense vs Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseAnalysis data={incomeExpenseData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseCategories data={pieChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}