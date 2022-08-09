import type { ShowdownExtension } from 'showdown';

export const METATAG_REGEX = /^\s*\{\{\s*meta(-property)?\s+[\w:]+\s*=\s*.+?\s*\}\}$/gm;
export const TITLETAG_REGEX = /^\s*\{\{\s*title\s+(.+?)\s*\}\}$/gm;

export default [
    {
        type: 'lang',
        filter: (text: string): string => text.replace(METATAG_REGEX, ''),
    },
    {
        type: 'lang',
        filter: (text: string): string => text.replace(TITLETAG_REGEX, ''),
    },
] as ShowdownExtension[];
