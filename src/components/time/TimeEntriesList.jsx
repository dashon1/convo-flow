import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Trash2, DollarSign, Clock, CheckCircle } from "lucide-react";

export default function TimeEntriesList({ timeEntries, clients, isLoading, onDelete, onToggleBilled }) {
  const getClient = (clientId) => {
    return clients.find(c => c.id === clientId);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timeEntries.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No time entries yet</h3>
          <p className="text-slate-600">Start tracking your billable hours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.map((entry) => {
                const client = getClient(entry.client_id);
                const total = (entry.hours || 0) * (entry.hourly_rate || 0);
                
                return (
                  <TableRow key={entry.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-${client?.avatar_color || 'blue'}-400 to-${client?.avatar_color || 'blue'}-600 text-white text-xs font-semibold`}>
                          {client?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{client?.name || 'Unknown'}</p>
                          {client?.company && (
                            <p className="text-xs text-slate-500">{client.company}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.project_name || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.description || '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.hours}h
                    </TableCell>
                    <TableCell className="text-right">
                      ${entry.hourly_rate}/hr
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      ${total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleBilled(entry)}
                        className={entry.is_billed ? 'text-green-600' : 'text-slate-400'}
                      >
                        {entry.is_billed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Billed
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 mr-1" />
                            Unbilled
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(entry.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}