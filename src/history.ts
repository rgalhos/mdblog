import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { IHistory } from './interfaces/IHistory';
import type { IFileDescription } from './interfaces/IFileDescription';
import type { IHistoryEntry } from './interfaces/IHistoryEntry';

const historyFileTemplate: IHistory = {
    entries: {},
    hashDict: {},
};

~(function createHistoryIfNotExists(): void {
    if (existsSync('./history.json')) {
        return;
    }

    writeFileSync('./history.json', JSON.stringify(historyFileTemplate, null, 4));
})();

export function addHeadToHistory(fileDesc: IFileDescription): IHistoryEntry {
    const uuid = randomUUID();
    const entry: IHistoryEntry = {
        ...fileDesc,
        previousHash: getCurrentHead(fileDesc.path),
    };

    saveHistoryEntry(uuid, entry, true);

    return entry;
}

export function getCurrentHead(path: string): string | null {
    return getHistory().hashDict?.[path] || null;
}

export function getHistory(): IHistory {
    return JSON.parse(readFileSync('./history.json').toString('utf-8'));
}

export function isHead(fileDesc: IFileDescription): boolean {
    const history = getHistory();
    const headId = history.hashDict[fileDesc.path];
    return !!headId && history.entries[headId]?.md5sum === fileDesc.md5sum;
}

export function getEditHistory(path: string): IHistoryEntry[] {
    const history = getHistory();
    const entries: IHistoryEntry[] = [];

    let head = history.entries[history.hashDict[path]];
    while (head) {
        entries.push(head);

        if (!head.previousHash) break;
        
        head = history.entries[head.previousHash];
    }

    return entries;
}

function saveHistoryEntry(uuid: string, entry: IHistoryEntry, newHead = false): void {
    const history = getHistory();
    // yeah, no checks
    history.entries[uuid] = entry;
    if (newHead) {
        history.hashDict[entry.path] = uuid;
    }
    saveHistory(history);
}

function saveHistory(historyObj: IHistory): void {
    writeFileSync('./history.json', JSON.stringify(historyObj, null, 4), { encoding: 'utf-8' });
}
