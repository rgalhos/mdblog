import type { IFileDescription } from './IFileDescription';

export type ITemplateContext = UnknownDictionary & {
    metaTags: string;
    pageTitle: string;
    file: IFileDescription;
    markdownContent: string;
    editHistory: UnknownDictionary[];
    renderStartTime: number;
};
