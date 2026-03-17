export type Appliance = {
  id: number;
  name: string;
  baseFine: number;
  watts: number;
};

export type ReportRecord = {
  id: number;
  applianceId: number;
  applianceName: string;
  responsibleUserId: number;
  responsibleUserName: string;
  reporterUserId: number;
  reporterUserName: string;
  fine: number;
  notes: string;
  evidenceImage: string | null;
  createdAt: string;
};

const appliances: Appliance[] = [
  { id: 1, name: 'Induction', baseFine: 15, watts: 1800 },
  { id: 2, name: 'Light', baseFine: 5, watts: 60 },
  { id: 3, name: 'Fan', baseFine: 5, watts: 75 },
  { id: 4, name: 'Washing Machine', baseFine: 15, watts: 500 },
  { id: 5, name: 'Geyser', baseFine: 25, watts: 2000 },
  { id: 6, name: 'Cooler', baseFine: 25, watts: 250 },
  { id: 7, name: 'Light + Fan', baseFine: 10, watts: 135 },
];

let reports: ReportRecord[] = [];

export const store = {
  getAppliances: () => appliances,
  getReports: () => reports,
  findApplianceById: (id: number) => appliances.find((appliance) => appliance.id === id),
  createReport: (report: Omit<ReportRecord, 'id' | 'createdAt'>) => {
    const next: ReportRecord = {
      ...report,
      id: reports.length + 1,
      createdAt: new Date().toISOString(),
    };
    reports = [next, ...reports];
    return next;
  },
};