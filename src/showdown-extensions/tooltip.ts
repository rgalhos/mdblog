import type { ShowdownExtension } from 'showdown';

export default [
    {
        type: 'lang',
        regex: /\{(.+?)\}\{(.+?)\}/g,
        replace: `<span class="tooltip">$1<span class="tooltip-content">$2</span></span>`,
    },
] as ShowdownExtension[];
