import * as path from 'node:path';

/** Create a relative path from a directory to a file */
export function buildRelativePath(fromDir: string, toFilePath: string) {
  return './' + path.join(path.relative(fromDir, path.dirname(toFilePath)), path.basename(toFilePath)).replace(/\\/g, '/');
}

/** Ensure absolute path */
export function ensureAbsolutePath(baseDir: string, dirOrFilePath: string): string {
  if (path.isAbsolute(dirOrFilePath)) {
    return path.resolve(dirOrFilePath);
  } else {
    return path.resolve(baseDir, dirOrFilePath);
  }
}
