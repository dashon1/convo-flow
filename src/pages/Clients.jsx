import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import ClientGrid from "../components/clients/ClientGrid";
import ClientStats from "../components/clients/ClientStats";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clientsData, messagesData] = await Promise.all([
        base44.entities.Client.list("-created_date"),
        base44.entities.Message.list("-created_date")
      ]);
      setClients(clientsData || []);
      setMessages(messagesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setClients([]);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Client Management</h1>
              <p className="text-slate-600">Manage your client relationships and preferences</p>
            </div>
          </div>
          <Link to={createPageUrl("AddClient")}>
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <ClientStats clients={clients} messages={messages} />

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/80 border-slate-200"
          />
        </div>

        {/* Clients Grid */}
        <ClientGrid 
          clients={filteredClients}
          messages={messages}
          isLoading={isLoading}
          onClientUpdate={loadData}
        />
      </div>
    </div>
  );
}