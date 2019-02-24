
//
// Datatype for <shng-server>:<port>/api/server
//
export interface ServerInfo {
  default_language: string;
  client_ip: string;
  itemtree_fullpath: boolean;
  itemtree_searchstart: number;
  tz: string;
  tzname: string;
  core_branch: string;
  plugins_branch: string;
  websocket_host: string;
  websocket_port: string;
  daemon_knx: string;
  daemon_ow: string;
  daemon_mqtt: string;
  daemon_node_red: string;
}
