"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExpenseCategories } from "@/components/expense-categories";
import IncomeExpenseAnalysis from "@/components/incomevsexpense";
import { CreditCard, Wallet, PiggyBank, TrendingUp } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 2 }, (_, i) => currentYear - i);

const calculatePercentage = (current: number, goal: number) => {
    if (goal === 0) {
      return 0; 
    }
    return Math.round((current / goal) * 100);
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
    type: "incomeExpenseAnalysis" | "Piechart_data"; 
    data: IncomeExpenseData[] | PieChartCategoryData[]; 
  }; 

  export default function PastReportsPage() {
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [financialData, setFinancialData] = useState<any>(null);
  
    const [incomeExpenseData, setIncomeExpenseData] = useState<IncomeExpenseData[]>(
      []
    );
    const [pieChartData, setPieChartData] = useState<PieChartCategoryData[]>([]);
    
    const [loading, setLoading] = useState<boolean>(false);
  
    const fetchPastReport = async () => {
      if (!selectedMonth || !selectedYear) return;
  
      setLoading(true);
      const jwtToken = localStorage.getItem("jwt_token");
  
      if (!jwtToken) {
        console.error("JWT token is missing.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(
          `https://spendtrail-backend.onrender.com/api/dashboard/past-reports/?month=${selectedMonth}&year=${selectedYear}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
  
        const data = await response.json();
        console.log("Fetched past report data:", data);
  
        setFinancialData(data.financialData);
        
        setIncomeExpenseData(
          data.graph_data.find((item: { type: string; }) => item.type === 'incomeExpenseAnalysis')?.data as IncomeExpenseData[] || []
        );
        
        setPieChartData(
          data.graph_data.find((item: { type: string; }) => item.type === 'Piechart_data')?.data as PieChartCategoryData[] || []
        );
      } catch (error) {
        console.error("Error fetching past report:", error);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Past Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="month">Month</Label>
              <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent className="bg-background text-sm">
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="year">Year</Label>
              <Select onValueChange={setSelectedYear} value={selectedYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4 w-full bg-green-500" onClick={fetchPastReport} disabled={!selectedMonth || !selectedYear}>
            {loading ? "Fetching..." : "Fetch Report"}
          </Button>
        </CardContent>
      </Card>

      {financialData && (
        <>
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

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
        </>
      )}
    </div>
  );
}