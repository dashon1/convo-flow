import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus
} from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import MessageList from "../components/dashboard/MessageList";
import QuickActions from "../components/dashboard/QuickActions";
import FilterBar from "../components/dashboard/FilterBar";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    channel: "all",
    client: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [messagesData, clientsData] = await Promise.all([
        base44.entities.Message.list("-message_date", 50),
        base44.entities.Client.list("-created_date")
      ]);
      setMessages(messagesData || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessages([]);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageAction = async (messageId, action, data = {}) => {
    try {
      await base44.entities.Message.update(messageId, data);
      loadData();
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const statusMatch = filters.status === "all" || message.status === filters.status;
    const priorityMatch = filters.priority === "all" || message.priority === filters.priority;
    const channelMatch = filters.channel === "all" || message.channel === filters.channel;
    const clientMatch = filters.client === "all" || message.client_id === filters.client;
    return statusMatch && priorityMatch && channelMatch && clientMatch;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === "unread").length,
    followUp: messages.filter(m => m.status === "follow_up").length,
    urgent: messages.filter(m => m.priority === "urgent").length,
    replied: messages.filter(m => m.status === "replied").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Communication Inbox</h1>
            <p className="text-slate-600 mt-1">Manage all your client messages in one place</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("AddMessage")} className="flex-1 md:flex-none">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Message
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Quick Actions */}
        <QuickActions onAction={loadData} />

        {/* Filters */}
        <FilterBar 
          filters={filters} 
          onFiltersChange={setFilters}
          clients={clients}
        />

        {/* Messages List */}
        <MessageList
          messages={filteredMessages}
          clients={clients}
          isLoading={isLoading}
          onMessageAction={handleMessageAction}
        />
      </div>
    </div>
  );
}