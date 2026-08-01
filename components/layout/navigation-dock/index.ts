/*
  Only the component crosses this boundary. The destination registry stays
  behind it: it carries icon components, so re-exporting it here would pull the
  icon package into the server graph of anything that imports this barrel.
  Client code that needs the registry imports "./navigationItems" directly.
*/
export { NavigationDock } from "./NavigationDock";
export type { DockDestination } from "./navigationItems";
