"use client";  
  
import { useState, useEffect } from "react";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Button } from "@/components/ui/button";  
import { PlusCircle } from "lucide-react";  
import { CreateSubscriptionDialog } from "@/components/create-subscription-dialog";  
import {  
  Dialog,  
  DialogContent,  
  DialogHeader,  
  DialogTitle,  
  DialogFooter,  
} from "@/components/ui/dialog";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { toast } from "sonner";  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  
type Subscription = {  
  id: number;  
  name: string;  
  amount: number;  
  category: string;  
  frequency: string;  
  start_date: string;  
  end_date?: string;  
  repeat_count?: number;
  is_active: boolean;  
};  
  
export default function SubscriptionsPage() {  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);  
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);  
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);  
  
  useEffect(() => {  
    fetchSubscriptions();  
  }, []);  
  
  const fetchSubscriptions = async () => {  
    setIsLoading(true);  
    setError(null);  
  
    const token = localStorage.getItem("jwt_token");  
  
    try {  
      const response = await fetch(  
        "https://spendtrail-backend.onrender.com/api/subscriptions",  
        {  
          method: "GET",  
          headers: {  
            "Content-Type": "application/json",  
            Authorization: `Bearer ${token}`,  
          },  
        }  
      );  
  
      if (!response.ok) {  
        if (response.status === 401) {  
          throw new Error("User not authenticated");  
        }  
        throw new Error("Failed to fetch subscriptions, Please Login again");  
      }  
  
      const data: Subscription[] = await response.json();  
      setSubscriptions(data);  
    } catch (err) {  
      setError(  
        err instanceof Error  
          ? err.message  
          : "An error occurred while fetching subscriptions"  
      );  
      console.error(err);  
    } finally {  
      setIsLoading(false);  
    }  
  };  
  
  const handleEditSubscription = (subscription: Subscription) => {  
    setEditingSubscription(subscription);  
    setIsEditDialogOpen(true);  
  };  
  
  if (isLoading) {  
    return (  
      <div className="space-y-6">  
        <h1 className="text-3xl font-bold">Subscriptions</h1>  
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">  
          {Array(3)  
            .fill(null)  
            .map((_, index) => (  
              <Card key={index} className="p-4">  
                <CardHeader className="flex flex-row items-center justify-between">  
                  <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 animate-pulse" />  
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />  
                </CardHeader>  
                <CardContent>  
                  <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2" />  
                </CardContent>  
              </Card>  
            ))}  
        </div>  
      </div>  
    );  
  }  
  
  if (error) {  
    return (  
      <div className="space-y-6">  
        <h1 className="text-3xl font-bold">Subscriptions</h1>  
        <p className="text-red-500">{error}</p>  
      </div>  
    );  
  }  
  
  return (  
    <div className="space-y-6">  
      <h1 className="text-3xl font-bold">Subscriptions</h1>  
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">  
        <Card  
          className="cursor-pointer"  
          onClick={() => setIsCreateDialogOpen(true)}  
        >  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">  
              Create Subscription  
            </CardTitle>  
            <PlusCircle className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">Add New</div>  
          </CardContent>  
        </Card>  
        {subscriptions.map((subscription) => (  
          <Card  
            key={subscription.id}  
            className="cursor-pointer relative"  
            onClick={() => handleEditSubscription(subscription)}  
          >  
            <CardHeader>  
              <CardTitle className="flex items-center gap-2">  
                <span>🔄</span>  
                {subscription.name}  
              </CardTitle>  
              {/* Status indicator in top-right corner */}  
              <div className="absolute top-2 right-2">  
                <span   
                  className={`text-xs px-2 py-1 rounded-full font-medium ${  
                    subscription.is_active   
                      ? 'bg-green-100 text-green-800'   
                      : 'bg-red-100 text-red-800'  
                  }`}  
                >  
                  {subscription.is_active ? 'Active' : 'Inactive'}  
                </span>  
              </div>  
            </CardHeader>  
            <CardContent>  
              <p className="text-2xl font-bold">₹ {subscription.amount}</p>  
              <p className="text-sm text-muted-foreground">{subscription.frequency}</p>  
              <p className="text-xs text-muted-foreground">{subscription.category}</p>  
            </CardContent>  
          </Card>  
        ))}
      </div>  
      <CreateSubscriptionDialog  
        open={isCreateDialogOpen}  
        onOpenChange={setIsCreateDialogOpen}  
        onSubscriptionCreated={fetchSubscriptions}  
      />  
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>  
      <DialogContent className="sm:max-w-[550px]">  
        <DialogHeader>  
          <DialogTitle>Update Subscription</DialogTitle>  
        </DialogHeader>  
        {editingSubscription && (  
          <form  
            onSubmit={async (e) => {  
              e.preventDefault();  
              try {  
                const token = localStorage.getItem("jwt_token");  
                if (!token) {  
                  throw new Error("User is not authenticated");  
                }  
      
                const response = await fetch(  
                  `https://spendtrail-backend.onrender.com/api/update_subscription`,  
                  {  
                    method: "PUT",  
                    headers: {  
                      "Content-Type": "application/json",  
                      Authorization: `Bearer ${token}`,  
                    },  
                    body: JSON.stringify({ 
                      id: editingSubscription.id,
                      amount: editingSubscription.amount,
                      name: editingSubscription.name,  
                      is_active: editingSubscription.is_active,  
                      ...(editingSubscription.end_date && { end_date: editingSubscription.end_date }),  
                      ...(editingSubscription.repeat_count && { repeat_count: editingSubscription.repeat_count }),  
                    }),  
                  }  
                );  
      
                if (!response.ok) {  
                  const errorData = await response.json();  
                  throw new Error(errorData.detail || "Failed to update subscription");  
                }  
                toast.success('Subscription has been updated')  
                setIsEditDialogOpen(false);  
                fetchSubscriptions();  
              } catch (err) {  
                let errorMessage = "An unknown error occurred.";  
                if (err instanceof Error) {  
                  errorMessage = err.message;  
                } else if (typeof err === "string") {  
                  errorMessage = err;  
                }  
                toast.error(errorMessage);  
              }  
            }}  
          >  
            <div className="grid gap-4 py-4">  
              {/* Name field - always shown */}  
              <div className="grid grid-cols-4 items-center gap-4">  
                <Label htmlFor="name" className="text-right">  
                  Name  
                </Label>  
                <Input  
                  id="name"  
                  type="text"  
                  value={editingSubscription.name}  
                  onChange={(e) => {  
                    setEditingSubscription({  
                      ...editingSubscription,  
                      name: e.target.value,  
                    });  
                  }}  
                  className="col-span-3"  
                  required  
                />  
              </div>  
      
              {/* Active status field - always shown */}  
              <div className="grid grid-cols-4 items-center gap-4">  
                <Label htmlFor="active" className="text-right">  
                  Status  
                </Label>  
                <Select   
                  value={editingSubscription.is_active ? "active" : "inactive"}  
                  onValueChange={(value) => {  
                    setEditingSubscription({  
                      ...editingSubscription,  
                      is_active: value === "active",  
                    });  
                  }}  
                >  
                  <SelectTrigger className="bg-background">  
                    <SelectValue />  
                  </SelectTrigger>  
                  <SelectContent className="bg-background">  
                    <SelectItem value="active">Active</SelectItem>  
                    <SelectItem value="inactive">Inactive</SelectItem>  
                  </SelectContent>  
                </Select>  
              </div>

              {/* Amount field - always shown */}  
              <div className="grid grid-cols-4 items-center gap-4">  
                <Label htmlFor="amount" className="text-right">  
                  Amount  
                </Label>  
                <Input  
                  id="amount"  
                  type="number"  
                  step="0.01"  
                  value={editingSubscription.amount}  
                  onChange={(e) => {  
                    setEditingSubscription({  
                      ...editingSubscription,  
                      amount: parseFloat(e.target.value),  
                    });  
                  }}  
                  className="col-span-3"  
                  required  
                />  
              </div>    
      
              {/* End date field - only shown if not null */}  
              {editingSubscription.end_date && (  
                <div className="grid grid-cols-4 items-center gap-4">  
                  <Label htmlFor="endDate" className="text-right">  
                    End Date  
                  </Label>  
                  <Input  
                    id="endDate"  
                    type="date"  
                    value={editingSubscription.end_date ? editingSubscription.end_date.split('T')[0] : ''}  
                    onChange={(e) => {  
                      setEditingSubscription({  
                        ...editingSubscription,  
                        end_date: e.target.value,  
                      });  
                    }}  
                    className="col-span-3"  
                  />  
                </div>  
              )}  
      
              {/* Repeat count field - only shown if not null */}  
              {editingSubscription.repeat_count && (  
                <div className="grid grid-cols-4 items-center gap-4">  
                  <Label htmlFor="repeatCount" className="text-right">  
                    Number of Times  
                  </Label>  
                  <Input  
                    id="repeatCount"  
                    type="number"  
                    min="1"  
                    value={editingSubscription.repeat_count}  
                    onChange={(e) => {  
                      setEditingSubscription({  
                        ...editingSubscription,  
                        repeat_count: parseInt(e.target.value),  
                      });  
                    }}  
                    className="col-span-3"  
                  />  
                </div>  
              )}  
            </div>  
            <DialogFooter>  
              <Button type="submit" className="bg-green-600">  
                Update Subscription  
              </Button>  
            </DialogFooter>  
          </form>  
        )}  
      </DialogContent>  
    </Dialog>
    </div>  
  );  
}