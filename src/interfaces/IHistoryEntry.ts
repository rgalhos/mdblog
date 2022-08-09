import type { IFileDescription } from './IFileDescription';

export interface IHistoryEntry extends IFileDescription {
    //htmlFile: string;
    previousHash?: string | null;
}
