import React from 'react';
import type { Report } from '../types';

type FineTableProps = {
  reports: Report[];
};

const FineTable: React.FC<FineTableProps> = ({ reports }) => (
  <div className="glass-panel overflow-hidden p-0">
    <table className="min-w-full text-left">
      <thead className="bg-slate-950 text-sm uppercase tracking-[0.18em] text-white dark:bg-slate-800/90">
        <tr>
          <th className="px-5 py-4">Responsible</th>
          <th className="px-5 py-4">Appliance</th>
          <th className="px-5 py-4">Reported by</th>
          <th className="px-5 py-4">Fine</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id} className="border-t border-slate-200/70 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{report.responsibleUserName}</td>
            <td className="px-5 py-4">{report.applianceName}</td>
            <td className="px-5 py-4">{report.reporterUserName}</td>
            <td className="px-5 py-4 font-bold text-rose-600 dark:text-rose-300">Rs. {report.fine}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default FineTable;
