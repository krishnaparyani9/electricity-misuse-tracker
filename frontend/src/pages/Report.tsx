import React from 'react';
import ReportForm from '../components/ReportForm';
import type { Appliance, Report as ReportRecord, User } from '../types';

type ReportPageProps = {
  appliances: Appliance[];
  users: User[];
  reports: ReportRecord[];
  currentUser: User;
  onSubmit: (payload: {
    applianceId: number;
    responsibleUserId: number;
    reporterUserId: number;
    notes: string;
    image?: File | null;
  }) => Promise<void>;
};

const Report: React.FC<ReportPageProps> = ({ appliances, users, reports, currentUser, onSubmit }) => (
  <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div className="mb-6">
      <p className="badge">New report</p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Document electricity misuse</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        Reports create visible accountability. Submit the appliance, responsible flatmate, notes, and optional proof image.
      </p>
    </div>
    <ReportForm appliances={appliances} users={users.filter((user) => user.id !== currentUser.id)} reports={reports} reporterId={currentUser.id} onSubmit={onSubmit} />
  </section>
);

export default Report;
