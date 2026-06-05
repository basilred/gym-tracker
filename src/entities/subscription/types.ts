export interface Visit {
  id: string;
  date: string;
}

export interface Subscription {
  id: string;
  name: string;
  totalSessions: number;
  startDate: string;
  visits: Visit[];
}

export interface SubscriptionStorage {
  _schemaVersion: number;
  data: Subscription[];
}
