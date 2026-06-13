import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Plus,
  Download
} from "lucide-react";
import { format } from "date-fns";

import TimeEntryForm from "../components/time/TimeEntryForm";
import TimeEntriesList from "../components/time/TimeEntriesList";
import TimeStats from "../components/time/TimeStats";

export default function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [entriesData, clientsData] = await Promise.all([
        base44.entities.TimeEntry.list("-date"),
        base44.entities.Client.list("-name")
      ]);
      setTimeEntries(entriesData || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error loading time tracking data:", error);
      setTimeEntries([]);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (entryData) => {
    try {
      await base44.entities.TimeEntry.create(entryData);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Error creating time entry:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this time entry?")) {
      try {
        await base44.entities.TimeEntry.delete(id);
        loadData();
      } catch (error) {
        console.error("Error deleting time entry:", error);
      }
    }
  };

  const toggleBilled = async (entry) => {
    try {
      await base44.entities.TimeEntry.update(entry.id, {
        is_billed: !entry.is_billed
      });
      loadData();
    } catch (error) {
      console.error("Error updating time entry:", error);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Client', 'Project', 'Description', 'Hours', 'Rate', 'Total', 'Billed'],
      ...timeEntries.map(entry => {
        const client = clients.find(c => c.id === entry.client_id);
        const total = (entry.hours || 0) * (entry.hourly_rate || 0);
        return [
          format(new Date(entry.date), 'yyyy-MM-dd'),
          client?.name || 'Unknown',
          entry.project_name || '',
          entry.description || '',
          entry.hours,
          entry.hourly_rate,
          total.toFixed(2),
          entry.is_billed ? 'Yes' : 'No'
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Time Tracking</h1>
              <p className="text-slate-600">Track billable hours and earnings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="bg-white/80"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Entry
            </Button>
          </div>
        </div>

        {/* Stats */}
        <TimeStats timeEntries={timeEntries} clients={clients} />

        {/* Form */}
        {showForm && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b">
              <CardTitle>New Time Entry</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TimeEntryForm
                clients={clients}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Time Entries List */}
        <TimeEntriesList
          timeEntries={timeEntries}
          clients={clients}
          isLoading={isLoading}
          onDelete={handleDelete}
          onToggleBilled={toggleBilled}
        />
      </div>
    </div>
  );
}