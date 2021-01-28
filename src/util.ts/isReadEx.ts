import { ReadEx } from "../ReadEx";

/**
 * Check if something is a ReadEx without creating a circular dependency
 */
export function isReadEx(object: any): object is ReadEx {
  const lazyModule = require("../ReadEx");
  return object instanceof lazyModule.ReadEx;
}
