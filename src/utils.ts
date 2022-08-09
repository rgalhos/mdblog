import { readFileSync } from 'fs';
import type { IHistory } from './interfaces/IHistory';
import type { IHistoryEntry } from './interfaces/IHistoryEntry';

export function bytesToSizeString(bytes: number, precision = 1): string {
    const sizes = [null, 'B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;

    if (bytes === 0) return '0 B';
    while ((i++, bytes > 1000)) bytes /= 1 << 10;

    return bytes.toFixed(i === 1 ? 0 : precision) + ' ' + sizes[i];
}

export function getEditHistory(path: string): IHistoryEntry[] {
    const history: IHistory = JSON.parse(readFileSync('./history.json').toString('utf-8'));

    if (!Object.prototype.hasOwnProperty.call(history.hashDict, path)) {
        return [];
    }

    const entries: IHistoryEntry[] = [];

    let hash: IHistoryEntry['previousHash'] = history.hashDict[path];
    let entry: IHistoryEntry;
    while (typeof hash === 'string' && (entry = history.entries[hash]) && hash !== entry.previousHash) {
        entry = history.entries[hash];
        entries.push(entry);
        hash = entry.previousHash;
    }

    entries.shift();

    return entries;
}

export function wait(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export function project<T>(original: T, fields: { [field in keyof T]: 0 | 1 | boolean }): UnknownDictionary;
export function project<T>(original: T, fields: (keyof T)[]): UnknownDictionary;
export function project<T extends Dictionary<keyof T>>(
    original: T,
    fields: (keyof T)[] | { [field in keyof T]: 0 | 1 | boolean }
): UnknownDictionary {
    const projected: UnknownDictionary = {};

    if (Array.isArray(fields)) {
        for (const field of fields) {
            projected[field as string] = original[field];
        }
    } else {
        for (const [field, project] of Object.entries(fields)) {
            if (project) {
                projected[field] = original[field];
            }
        }
    }

    return projected;
}
