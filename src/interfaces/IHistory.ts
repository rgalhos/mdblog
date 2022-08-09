import type { IHistoryEntry } from './IHistoryEntry';

export interface IHistory {
    entries: { [uuid: string]: IHistoryEntry };
    hashDict: { [path: string]: string };
}
