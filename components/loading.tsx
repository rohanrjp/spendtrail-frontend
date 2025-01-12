import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-[150px]" />
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px] mt-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px] mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px] mt-1" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

