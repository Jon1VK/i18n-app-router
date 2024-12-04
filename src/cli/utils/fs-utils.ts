import { existsSync, mkdirSync, rmSync, statSync } from "fs";
import path from "path";

/**
 * Converts a relative path to an absolute path in the current working dir
 */
export function getAbsolutePath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

/**
 * Indicates if a path points to a directory
 */
export function isDirectory(path: string) {
  if (!existsSync(path)) return false;
  return statSync(path).isDirectory();
}

/**
 * Indicates if a path points to a file
 */
export function isFile(path: string) {
  if (!existsSync(path)) return false;
  return statSync(path).isFile();
}

/**
 * Makes a directory on the specified path
 */
export function makeDirectory(path: string) {
  if (existsSync(path)) return;
  mkdirSync(path, { recursive: true });
}

/**
 * Removes a directory on the specified path
 */
export function rmDirectory(path: string) {
  rmSync(path, { recursive: true, force: true });
}
