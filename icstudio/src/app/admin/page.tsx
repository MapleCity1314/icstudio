"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>
        
        {/* 可以添加更多卡片 */}
      </div>
    </div>
  );
}