import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp 
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ClientStats({ clients, messages }) {
  const activeClients = clients.filter(c => c.project_status === 'active').length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.hourly_rate || 0), 0);
  const avgRate = clients.length > 0 ? (totalRevenue / clients.length).toFixed(0) : 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Clients"
        value={clients.length}
        icon={Users}
        color="text-blue-600"
        bgColor="bg-blue-500"
      />
      <StatCard
        title="Active Projects"
        value={activeClients}
        icon={TrendingUp}
        color="text-green-600"
        bgColor="bg-green-500"
      />
      <StatCard
        title="Companies"
        value={clients.filter(c => c.company).length}
        icon={Building2}
        color="text-purple-600"
        bgColor="bg-purple-500"
      />
      <StatCard
        title="Avg Rate"
        value={`$${avgRate}/hr`}
        icon={DollarSign}
        color="text-amber-600"
        bgColor="bg-amber-500"
      />
    </div>
  );
}