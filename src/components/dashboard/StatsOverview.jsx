import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Mail 
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
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

export default function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Messages"
        value={stats.total}
        icon={MessageSquare}
        color="text-blue-600"
        bgColor="bg-blue-500"
      />
      <StatCard
        title="Unread"
        value={stats.unread}
        icon={Mail}
        color="text-red-600"
        bgColor="bg-red-500"
      />
      <StatCard
        title="Follow-ups"
        value={stats.followUp}
        icon={Clock}
        color="text-amber-600"
        bgColor="bg-amber-500"
      />
      <StatCard
        title="Urgent"
        value={stats.urgent}
        icon={AlertTriangle}
        color="text-orange-600"
        bgColor="bg-orange-500"
      />
      <StatCard
        title="Replied"
        value={stats.replied}
        icon={CheckCircle2}
        color="text-green-600"
        bgColor="bg-green-500"
      />
    </div>
  );
}