import { ShowdownExtension } from 'showdown';

export default [
    {
        type: 'lang',
        filter: (text: string): string => text.replace(/^\s*\{\{\s*meta(-property)?\s+[\w:]+\s*=\s*.+?\s*\}\}$/gm, ''),
    },
    {
        type: 'lang',
        filter: (text: string): string => text.replace(/^\s*\{\{\s*title\s+(.+?)\s*\}\}$/gm, ''),
    },
] as ShowdownExtension[];
