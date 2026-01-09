import path from "path";

// Resolve absolute path from a relative path
export const resolveAbsPath = (p: string): string => {
    return path.resolve(process.cwd(), p);
};