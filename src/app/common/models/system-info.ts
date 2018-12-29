
//
// Datatype for <shng-server>:<port>/admin/systeminfo.json
//
export interface SystemInfo {
  now: string;
  system: string;
  sh_vers: string;
  sh_desc: string;
  plg_vers: string;
  plg_desc: string;
  sh_dir: string;
  vers: string;
  node: string;
  arch: string;
  user: string;
  freespace: number;
  uptime: number;
  sh_uptime: number;
  pyversion: string;
  ip: string;
  ipv6: string;
}
