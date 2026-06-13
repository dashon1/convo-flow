import React from 'react';
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  Archive, 
  Flag,
  MessageSquare,
  Mail,
  MessageCircle,
  Phone
} from "lucide-react";

const channelIcons = {
  email: Mail,
  slack: MessageCircle,
  whatsapp: MessageSquare,
  instagram: MessageCircle,
  phone: Phone,
  discord: MessageCircle,
  teams: MessageCircle,
  telegram: MessageCircle,
  linkedin: MessageCircle,
  other: MessageSquare
};

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700", 
  urgent: "bg-red-100 text-red-700"
};

const statusColors = {
  unread: "bg-red-100 text-red-700",
  read: "bg-gray-100 text-gray-700",
  replied: "bg-green-100 text-green-700",
  follow_up: "bg-yellow-100 text-yellow-700",
  archived: "bg-slate-100 text-slate-700"
};

export default function MessageList({ messages, clients, isLoading, onMessageAction }) {
  const getClient = (clientId) => {
    return clients.find(c => c.id === clientId) || { name: "Unknown Client", avatar_color: "gray" };
  };

  const getChannelIcon = (channel) => {
    const Icon = channelIcons[channel] || MessageSquare;
    return Icon;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages found</h3>
          <p className="text-slate-600">Start by adding your first client message</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const client = getClient(message.client_id);
        const ChannelIcon = getChannelIcon(message.channel);
        
        return (
          <Link key={message.id} to={createPageUrl(`MessageDetail?id=${message.id}`)}>
            <Card 
              className={`bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                message.status === 'unread' ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Client Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-${client.avatar_color || 'blue'}-400 to-${client.avatar_color || 'blue'}-600 text-white font-semibold text-lg shadow-lg`}>
                  {client.name[0]?.toUpperCase()}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{client.name}</h3>
                    <ChannelIcon className="w-4 h-4 text-slate-500" />
                    <Badge className={priorityColors[message.priority]}>
                      {message.priority}
                    </Badge>
                  </div>
                  
                  {message.subject && (
                    <h4 className="font-medium text-slate-800 mb-1 truncate">{message.subject}</h4>
                  )}
                  
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3">{message.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{format(new Date(message.message_date || message.created_date), 'MMM d, h:mm a')}</span>
                    {message.project_name && (
                      <span className="flex items-center gap-1">
                        <span>•</span>
                        <span>{message.project_name}</span>
                      </span>
                    )}
                    {message.follow_up_date && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock className="w-3 h-3" />
                        Follow-up: {format(new Date(message.follow_up_date), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={statusColors[message.status]}>
                    {message.status.replace('_', ' ')}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onMessageAction(message.id, 'read', { status: 'read' })}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMessageAction(message.id, 'replied', { status: 'replied' })}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Mark as Replied
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMessageAction(message.id, 'follow_up', { status: 'follow_up' })}>
                        <Flag className="w-4 h-4 mr-2" />
                        Set Follow-up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMessageAction(message.id, 'archive', { status: 'archived' })}>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
        );
      })}
    </div>
  );
}