import type { ShowdownExtension } from 'showdown';

export default [
    {
        type: 'lang',
        regex: /\[hash\]([0-9a-fA-F]{32}(?:[0-9a-fA-F]{32}(?:[0-9a-fA-F]{64}(?:[0-9a-fA-F]{128})?)?)?)\[\/hash\]/g,
        replace: `<code class="colored-hash" data-hash="$1">$1</code>`,
    },
] as ShowdownExtension[];
