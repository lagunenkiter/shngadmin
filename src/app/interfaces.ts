
//
// Datatype for <shng-server>:<port>/admin/shng_serverinfo.json
//
export interface ServerinfoType {
  default_language: string;
  client_ip: string;
  itemtree_fullpath: boolean;
  itemtree_searchstart: number;
  tz: string;
  tzname: string;
}


//
// Datatype for <shng-server>:<port>/admin/systeminfo.json
//
export interface SysteminfoType {
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


//
// Datatype for <shng-server>:<port>/admin/pypi.json
//
export interface PypiType {
  name: string;
  vers_installed: string;
  is_required: boolean;
  is_required_for_testsuite: boolean;
  is_required_for_docbuild: boolean;
  vers_req_min: string;
  vers_req_max: string;
  vers_req_msg: string;
  vers_req_source: string;
  vers_ok: boolean;
  vers_recent: boolean;
  pypi_version: string;
  pypi_version_ok: boolean;
  pypi_version_not_available_msg: string;
  pypi_doc_url: string;
  sort: string;
}

// -------------------------------------------------------

//
// Datatype for <shng-server>:<port>/admin/items.json
//
export interface ItemDetailsType {
  path: string;
  name: string;
  type: string;
  value: string;
  change_age: number;
  update_age: number;
  last_update: string;
  last_change: string;
  changed_by: string;
  updated_by: string;
  previous_value: string;
  previous_change_age: number;
  previous_update_age: number;
  previous_update: string;
  previous_change: string;
  enforce_updates: string;
  cache: string;
  eval: string;
  trigger: string;
  trigger_condition: string;
  trigger_condition_raw: string;
  on_update: string;
  on_change: string;
  log_change: string;
  cycle: string;
  crontab: string;
  autotimer: string;
  threshold: string;
  config: {};
  logics: string;
  triggers: string;
  filename: string;
}


export interface ItemType {
  path: string;
  name: string;
  tags: number[];
  nodes: ItemType[];
}

export interface ItemtreeType {
  [index: number]: ItemType;
}


// -------------------------------------------------------

//
// Datatype for <shng-server>:<port>/admin/scheduler.json
//
export interface SchedulerType {
  group: string;
  name: string;
  next: string;
  cycle: string;
  cron: string;
}

// -------------------------------------------------------


export interface PluginParameterType {
  name: string;
  type: string;
  value: string;
  default: string;

}


export interface PluginItemAttributeType {
  name: string;
  type: string;
}


export interface PluginMetadataType {
  type: string;
  description: string;
  description_long: string;
  documentation: string;
  support: string;
  keywords: string;
  maintainer: string;
  tester: string;
  classpath: string;
  classname: string;
  sh_minversion: string;
  sh_maxversion: string;
}


//
// Datatype for <shng-server>:<port>/admin/plugininfo.json
//
export interface PlugininfoType {
  pluginname: string;
  configname: string;
  version: string;
  smartplugin: boolean;
  multiinstance: boolean;
  instancename: string;
  webif_url: string;
  parameters: PluginParameterType[];
  arttibutes: PluginItemAttributeType[];
  metadata: PluginMetadataType;
  stoppable: boolean;
  stopped: boolean;
  triggers: string[];
}


//
// Datatype for <shng-server>:<port>/admin/scenes.json
//
export interface SceneinfoType {
  path: string;
  name: string;
  value_list: string[];
  scene_path: string[];
  values: {}[];
}


//
// Datatype for <shng-server>:<port>/admin/threads.json
//
export interface ThreadinfoType {
  name: string;
  sort: string;
  id: string;
  alive: boolean;
}







//
// PrimeNG
//
export interface TreeNode {
  data?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
}
