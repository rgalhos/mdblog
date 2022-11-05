import type { ShowdownExtension } from 'showdown';

export default [
    {
        type: 'html',
        regex: /<img /g,
        replace: `<img loading="lazy" `,
    },
] as ShowdownExtension[];
