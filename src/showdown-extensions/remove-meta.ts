import type { ShowdownExtension } from 'showdown';

export const METATAG_REGEX = /^\s*\{\{\s*meta(-property)?\s+[\w:]+\s*=\s*.+?\s*\}\}$/;
export const TITLETAG_REGEX = /^\s*\{\{\s*title\s+(.+?)\s*\}\}$/;

export default [
    {
        type: 'lang',
        filter: (text: string): string => text.replace(new RegExp(METATAG_REGEX, 'gm'), ''),
    },
    {
        type: 'lang',
        filter: (text: string): string => text.replace(new RegExp(TITLETAG_REGEX, 'gm'), ''),
    },
] as ShowdownExtension[];
