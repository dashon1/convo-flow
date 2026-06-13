import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mail, 
  Phone, 
  Building2, 
  MessageCircle,
  MoreVertical,
  ExternalLink
} from "lucide-react";

const channelIcons = {
  email: Mail,
  slack: MessageCircle,
  whatsapp: MessageCircle,
  instagram: MessageCircle,
  phone: Phone,
  discord: MessageCircle,
  teams: MessageCircle,
  telegram: MessageCircle,
  linkedin: MessageCircle,
  other: MessageCircle
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  on_hold: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  potential: "bg-purple-100 text-purple-700"
};

export default function ClientGrid({ clients, messages, isLoading }) {
  const getMessageCount = (clientId) => {
    return messages.filter(m => m.client_id === clientId).length;
  };

  const getUnreadCount = (clientId) => {
    return messages.filter(m => m.client_id === clientId && m.status === 'unread').length;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No clients yet</h3>
          <p className="text-slate-600">Start by adding your first client</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => {
        const PreferredIcon = channelIcons[client.preferred_channel] || MessageCircle;
        const messageCount = getMessageCount(client.id);
        const unreadCount = getUnreadCount(client.id);
        
        return (
          <Card key={client.id} className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-${client.avatar_color || 'blue'}-400 to-${client.avatar_color || 'blue'}-600 text-white font-semibold text-lg shadow-lg`}>
                    {client.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    {client.company && (
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Building2 className="w-3 h-3" />
                        {client.company}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={statusColors[client.project_status]}>
                  {client.project_status?.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-2">
                  <PreferredIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500 capitalize">{client.preferred_channel}</span>
                </div>
              </div>

              {client.email && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}

              {client.hourly_rate && (
                <div className="text-sm">
                  <span className="text-slate-500">Rate: </span>
                  <span className="font-semibold text-green-600">${client.hourly_rate}/hr</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  <span>{messageCount} messages</span>
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-100 text-red-700 text-xs">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
              </div>

              {client.notes && (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg line-clamp-2">
                  {client.notes}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}