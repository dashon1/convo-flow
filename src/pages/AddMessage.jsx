import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MessageForm from "../components/forms/MessageForm";

export default function AddMessage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await base44.entities.Client.list("-name");
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error loading clients:", error);
      setClients([]);
    }
  };

  const handleSubmit = async (messageData) => {
    setIsLoading(true);
    try {
      await base44.entities.Message.create({
        ...messageData,
        message_date: messageData.message_date || new Date().toISOString().slice(0, 16)
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error creating message:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="bg-white/80"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Message</h1>
            <p className="text-slate-600">Record a client communication</p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              Message Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <MessageForm
              clients={clients}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}