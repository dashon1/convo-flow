import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ResponseTimeAnalysis({ messages }) {
  const statusCounts = {
    unread: 0,
    read: 0,
    replied: 0,
    follow_up: 0,
    archived: 0
  };

  messages.forEach(msg => {
    if (statusCounts.hasOwnProperty(msg.status)) {
      statusCounts[msg.status]++;
    }
  });

  const totalMessages = messages.length;
  const responseRate = totalMessages > 0 
    ? ((statusCounts.replied / totalMessages) * 100).toFixed(1)
    : 0;

  const statusColors = {
    unread: "bg-red-100 text-red-700",
    read: "bg-blue-100 text-blue-700",
    replied: "bg-green-100 text-green-700",
    follow_up: "bg-yellow-100 text-yellow-700",
    archived: "bg-slate-100 text-slate-700"
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Response Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center pb-4 border-b">
          <p className="text-sm text-slate-600 mb-2">Response Rate</p>
          <p className="text-4xl font-bold text-green-600">{responseRate}%</p>
        </div>
        
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <Badge className={statusColors[status]}>
                {status.replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${totalMessages > 0 ? (count / totalMessages) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="font-semibold text-slate-900 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}