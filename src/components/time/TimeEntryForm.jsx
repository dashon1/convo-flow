import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TimeEntryForm({ clients, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    client_id: '',
    project_name: '',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
    hourly_rate: '',
    is_billed: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get client's hourly rate if not specified
    if (!formData.hourly_rate && formData.client_id) {
      const client = clients.find(c => c.id === formData.client_id);
      formData.hourly_rate = client?.hourly_rate || 0;
    }
    
    onSubmit(formData);
  };

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      client_id: clientId,
      hourly_rate: client?.hourly_rate || formData.hourly_rate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client *</Label>
          <Select value={formData.client_id} onValueChange={handleClientChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date *</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Hours Worked *</Label>
          <Input
            type="number"
            step="0.25"
            min="0"
            placeholder="2.5"
            value={formData.hours}
            onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value)})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Hourly Rate *</Label>
          <Input
            type="number"
            min="0"
            placeholder="75"
            value={formData.hourly_rate}
            onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Project/Task Name</Label>
          <Input
            placeholder="Website redesign"
            value={formData.project_name}
            onChange={(e) => setFormData({...formData, project_name: e.target.value})}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            placeholder="What did you work on?"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="billed"
          checked={formData.is_billed}
          onChange={(e) => setFormData({...formData, is_billed: e.target.checked})}
          className="rounded border-slate-300"
        />
        <Label htmlFor="billed" className="cursor-pointer">Already billed/invoiced</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!formData.client_id || !formData.hours || !formData.date}>
          Save Time Entry
        </Button>
      </div>
    </form>
  );
}