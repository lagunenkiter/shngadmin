

//
// Datatype for <shng-server>:<port>/api/installed
//
export interface PluginInstalled {
  type: string;
  description: string;
  version: string;
  documentation: string;
  multi_instance: string;
}

export interface PluginsInstalled {
  [key: string]: PluginInstalled;
}

