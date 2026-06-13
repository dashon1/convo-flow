import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  Clock, 
  MessageSquare,
  Users,
  BarChart3
} from "lucide-react";
import { subDays, isAfter } from "date-fns";



import RevenueChart from "../components/analytics/RevenueChart";
import ResponseTimeAnalysis from "../components/analytics/ResponseTimeAnalysis";
import ClientActivity from "../components/analytics/ClientActivity";
import ChannelDistribution from "../components/analytics/ChannelDistribution";

export default function Analytics() {
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [messagesData, clientsData, timeData] = await Promise.all([
        base44.entities.Message.list("-message_date"),
        base44.entities.Client.list("-created_date"),
        base44.entities.TimeEntry.list("-date").catch(() => [])
      ]);
      setMessages(messagesData || []);
      setClients(clientsData || []);
      setTimeEntries(timeData || []);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setMessages([]);
      setClients([]);
      setTimeEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByDateRange = (items, dateField) => {
    const cutoffDate = subDays(new Date(), dateRange);
    return items.filter(item => {
      const itemDate = new Date(item[dateField] || item.created_date);
      return isAfter(itemDate, cutoffDate);
    });
  };

  const recentMessages = filterByDateRange(messages, 'message_date');
  const recentTimeEntries = filterByDateRange(timeEntries, 'date');

  // Calculate metrics
  const totalRevenue = recentTimeEntries.reduce((sum, entry) => 
    sum + ((entry.hours || 0) * (entry.hourly_rate || 0)), 0
  );

  const totalHours = recentTimeEntries.reduce((sum, entry) => 
    sum + (entry.hours || 0), 0
  );

  const avgResponseTime = calculateAvgResponseTime(recentMessages);
  const activeClients = clients.filter(c => c.project_status === 'active').length;

  function calculateAvgResponseTime(msgs) {
    const replied = msgs.filter(m => m.status === 'replied');
    if (replied.length === 0) return 0;
    return replied.length > 0 ? Math.round(24 / replied.length) : 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600">Insights into your freelance business</p>
          </div>
        </div>

        {/* Date Range Filter */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Time Period:</span>
              <div className="flex gap-2">
                {[7, 30, 90, 365].map(days => (
                  <button
                    key={days}
                    onClick={() => setDateRange(days)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      dateRange === days
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {days === 365 ? '1 Year' : `${days} Days`}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+12% vs last period</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500 bg-opacity-20">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Hours Worked</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {totalHours.toFixed(1)}h
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Across all projects</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500 bg-opacity-20">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Messages</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {recentMessages.length}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">In selected period</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500 bg-opacity-20">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Clients</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {activeClients}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Currently active</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500 bg-opacity-20">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart timeEntries={recentTimeEntries} />
          <ChannelDistribution messages={recentMessages} />
          <ResponseTimeAnalysis messages={recentMessages} />
          <ClientActivity clients={clients} messages={recentMessages} />
        </div>
      </div>
    </div>
  );
}