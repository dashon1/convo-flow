import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  Edit,
  Trash2,
  Plus,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";

export default function MessageDetail() {
  const [searchParams] = useSearchParams();
  const messageId = searchParams.get('id');
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (messageId) {
      loadMessageDetail();
    }
  }, [messageId]);

  const loadMessageDetail = async () => {
    setIsLoading(true);
    try {
      const messages = await base44.entities.Message.list();
      const msg = messages?.find(m => m.id === messageId);
      
      if (msg) {
        setMessage(msg);
        
        const clients = await base44.entities.Client.list();
        const clientData = clients?.find(c => c.id === msg.client_id);
        setClient(clientData);

        const notesData = await base44.entities.Note.filter({ message_id: messageId });
        setNotes(notesData || []);
      }
    } catch (error) {
      console.error("Error loading message detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (!message) return;
    
    setIsLoadingSummary(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Summarize this client message in 2-3 concise sentences:\n\nSubject: ${message.subject || 'No subject'}\n\nContent: ${message.content}`,
        add_context_from_internet: false
      });
      setAiSummary(result);
    } catch (error) {
      console.error("Error generating summary:", error);
      setAiSummary("Failed to generate summary. Please try again.");
    }
    setIsLoadingSummary(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await base44.entities.Note.create({
        message_id: messageId,
        client_id: message.client_id,
        title: `Note for ${message.subject || 'message'}`,
        content: newNote,
        tags: []
      });
      setNewNote("");
      loadMessageDetail();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteMessage = async () => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await base44.entities.Message.delete(messageId);
        navigate(createPageUrl("Dashboard"));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading message...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-slate-600">Message not found</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="bg-white/80"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Message Details</h1>
            <p className="text-slate-600">View and manage this communication</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-white/80">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={deleteMessage}
              className="bg-white/80 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Message Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-${client?.avatar_color || 'blue'}-400 to-${client?.avatar_color || 'blue'}-600 text-white font-semibold text-lg shadow-lg`}>
                  {client?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <CardTitle className="text-xl">{client?.name || 'Unknown Client'}</CardTitle>
                  <p className="text-sm text-slate-500">{client?.company || ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={priorityColors[message.priority]}>
                  {message.priority}
                </Badge>
                <Badge className={statusColors[message.status]}>
                  {message.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-slate-500">Channel</p>
                <div className="flex items-center gap-2 mt-1">
                  <MessageCircle className="w-4 h-4 text-slate-400" />
                  <p className="font-medium capitalize">{message.channel}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date & Time</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <p className="font-medium">
                    {format(new Date(message.message_date || message.created_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              {message.project_name && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Project</p>
                  <p className="font-medium mt-1">{message.project_name}</p>
                </div>
              )}
            </div>

            {message.subject && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{message.subject}</h3>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>

            {message.tags && message.tags.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {message.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {message.follow_up_date && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-medium text-amber-900">
                    Follow-up scheduled for {format(new Date(message.follow_up_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiSummary ? (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-slate-700">{aiSummary}</p>
              </div>
            ) : (
              <Button
                onClick={generateAISummary}
                disabled={isLoadingSummary}
                variant="outline"
                className="w-full"
              >
                {isLoadingSummary ? (
                  <>Generating summary...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Summary
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Notes & Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Add a note about this message..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={addNote} disabled={!newNote.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            {notes.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                {notes.map(note => (
                  <div key={note.id} className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">
                      {format(new Date(note.created_date), 'MMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-slate-700">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}