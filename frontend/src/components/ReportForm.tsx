import React, { useState } from 'react';
import type { Appliance, Report as ReportRecord, User } from '../types';

type ReportFormProps = {
  appliances: Appliance[];
  users: User[];
  reports: ReportRecord[];
  reporterId: number;
  onSubmit: (payload: {
    applianceId: number;
    responsibleUserId: number;
    reporterUserId: number;
    notes: string;
    image?: File | null;
  }) => Promise<void>;
};

const ReportForm: React.FC<ReportFormProps> = ({ appliances, users, reports, reporterId, onSubmit }) => {
  const [applianceId, setApplianceId] = useState<number>(appliances[0]?.id ?? 0);
  const [responsibleUserId, setResponsibleUserId] = useState<number>(users[0]?.id ?? 0);
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = appliances.length > 0 && users.length > 0;
  const maxNotesLength = 280;

  const selectedAppliance = appliances.find((appliance) => appliance.id === applianceId);
  const previousSameApplianceReports = reports.filter(
    (report) => report.responsibleUserId === responsibleUserId && report.applianceId === applianceId
  ).length;
  const escalationSteps = Math.floor(previousSameApplianceReports / 10);
  const payableFine = (selectedAppliance?.baseFine ?? 0) + escalationSteps * 5;
  const tierProgress = previousSameApplianceReports % 10;
  const reportsUntilNextStep = tierProgress === 0 ? 10 : 10 - tierProgress;

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
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">Live fine preview</p>
          <p className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">Payable now: Rs. {payableFine}</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white px-3 py-2">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Base fine</p>
            <p className="mt-1 text-lg font-black text-slate-900">Rs. {selectedAppliance?.baseFine ?? 0}</p>
          </div>
          <div className="rounded-xl bg-white px-3 py-2">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Escalation added</p>
            <p className="mt-1 text-lg font-black text-slate-900">Rs. {escalationSteps * 5}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Previous reports for this person and this appliance: <span className="font-bold text-slate-900">{previousSameApplianceReports}</span>
          . Every 10 reports adds Rs. 5.
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-slate-900 transition-all duration-300" style={{ width: `${(tierProgress / 10) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
          {reportsUntilNextStep} more report{reportsUntilNextStep === 1 ? '' : 's'} until next +Rs. 5 step
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Details</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          maxLength={maxNotesLength}
          placeholder="Describe what was left running and how long it stayed on."
          className="field min-h-[120px] resize-none"
        />
        <p className="mt-2 text-right text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
          {notes.length}/{maxNotesLength}
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Evidence image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="field file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {image ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold">Selected: {image.name}</span>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 hover:border-slate-900 hover:text-slate-900"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
      <button type="submit" disabled={submitting || !canSubmit} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? 'Submitting report...' : 'Submit report'}
      </button>
    </form>
  );
};

export default ReportForm;
