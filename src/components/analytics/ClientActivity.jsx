import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientActivity({ clients, messages }) {
  const clientActivity = clients.map(client => {
    const clientMessages = messages.filter(m => m.client_id === client.id);
    return {
      id: client.id,
      name: client.name,
      company: client.company,
      messageCount: clientMessages.length,
      unreadCount: clientMessages.filter(m => m.status === 'unread').length,
      status: client.project_status,
      avatar_color: client.avatar_color
    };
  }).sort((a, b) => b.messageCount - a.messageCount).slice(0, 5);

  const statusColors = {
    active: "bg-green-100 text-green-700",
    on_hold: "bg-yellow-100 text-yellow-700",
    completed: "bg-blue-100 text-blue-700",
    potential: "bg-purple-100 text-purple-700"
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Top Active Clients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientActivity.map((client, index) => (
            <div key={client.id} className="flex items-center gap-3">
              <div className="text-lg font-bold text-slate-400 w-6">#{index + 1}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-${client.avatar_color || 'blue'}-400 to-${client.avatar_color || 'blue'}-600 text-white font-semibold shadow-lg`}>
                {client.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{client.name}</p>
                {client.company && (
                  <p className="text-xs text-slate-500">{client.company}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{client.messageCount}</p>
                <p className="text-xs text-slate-500">messages</p>
              </div>
              {client.unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-700">
                  {client.unreadCount}
                </Badge>
              )}
            </div>
          ))}
          {clientActivity.length === 0 && (
            <p className="text-center text-slate-500 py-8">No client activity yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}