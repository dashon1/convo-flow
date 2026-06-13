import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle }) => (
  <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function TimeStats({ timeEntries, clients }) {
  const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  const totalRevenue = timeEntries.reduce((sum, entry) => 
    sum + ((entry.hours || 0) * (entry.hourly_rate || 0)), 0
  );
  const unbilledRevenue = timeEntries
    .filter(entry => !entry.is_billed)
    .reduce((sum, entry) => sum + ((entry.hours || 0) * (entry.hourly_rate || 0)), 0);
  const avgHourlyRate = totalHours > 0 ? totalRevenue / totalHours : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Hours"
        value={`${totalHours.toFixed(1)}h`}
        icon={Clock}
        color="text-blue-600"
        bgColor="bg-blue-500"
        subtitle="All tracked time"
      />
      <StatCard
        title="Total Revenue"
        value={`$${totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        color="text-green-600"
        bgColor="bg-green-500"
        subtitle="Total earnings"
      />
      <StatCard
        title="Unbilled"
        value={`$${unbilledRevenue.toFixed(2)}`}
        icon={AlertCircle}
        color="text-orange-600"
        bgColor="bg-orange-500"
        subtitle="Pending invoices"
      />
      <StatCard
        title="Avg Rate"
        value={`$${avgHourlyRate.toFixed(0)}/hr`}
        icon={TrendingUp}
        color="text-purple-600"
        bgColor="bg-purple-500"
        subtitle="Average hourly"
      />
    </div>
  );
}