import React, { useState } from 'react';
import type { Appliance, User } from '../types';

type ReportFormProps = {
  appliances: Appliance[];
  users: User[];
  reporterId: number;
  onSubmit: (payload: {
    applianceId: number;
    responsibleUserId: number;
    reporterUserId: number;
    notes: string;
    image?: File | null;
  }) => Promise<void>;
};

const ReportForm: React.FC<ReportFormProps> = ({ appliances, users, reporterId, onSubmit }) => {
  const [applianceId, setApplianceId] = useState<number>(appliances[0]?.id ?? 0);
  const [responsibleUserId, setResponsibleUserId] = useState<number>(users[0]?.id ?? 0);
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = appliances.length > 0 && users.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);

    try {
      await onSubmit({ applianceId, responsibleUserId, reporterUserId: reporterId, notes, image });
      setNotes('');
      setImage(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Appliance misuse</label>
        <select
          value={applianceId}
          onChange={(event) => setApplianceId(Number(event.target.value))}
          className="field"
        >
          {appliances.map((appliance) => (
            <option key={appliance.id} value={appliance.id}>
              {appliance.name} • Rs. {appliance.baseFine}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Responsible flatmate</label>
        <select
          value={responsibleUserId}
          onChange={(event) => setResponsibleUserId(Number(event.target.value))}
          className="field"
          disabled={!users.length}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      {!users.length ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          No other flatmates exist yet. Ask them to sign up before creating reports against them.
        </p>
      ) : null}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Details</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          placeholder="Describe what was left running and how long it stayed on."
          className="field min-h-[120px] resize-none"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Evidence image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="field file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </div>
      <button type="submit" disabled={submitting || !canSubmit} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? 'Submitting report...' : 'Submit report'}
      </button>
    </form>
  );
};

export default ReportForm;
