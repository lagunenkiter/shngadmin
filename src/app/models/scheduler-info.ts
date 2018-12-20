//
// Datatype for <shng-server>:<port>/api/schedulers
//
export interface SchedulerInfo {
  group: string;
  name: string;
  next: string;
  cycle: string;
  cron: string;
}
