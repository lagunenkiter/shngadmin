
//
// Datatype for <shng-server>:<port>/admin/shng_serverinfo.json
//
export interface ServerInfo {
  default_language: string;
  client_ip: string;
  itemtree_fullpath: boolean;
  itemtree_searchstart: number;
  tz: string;
  tzname: string;
}
