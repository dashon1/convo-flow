import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  Archive, 
  RefreshCw,
  Zap
} from "lucide-react";

export default function QuickActions({ onAction }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="w-4 h-4" />
            Review Follow-ups
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Archive className="w-4 h-4" />
            Archive Old Messages
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={onAction}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}