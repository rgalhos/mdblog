import type { ShowdownExtension } from 'showdown';

export default [
    {
        type: 'html',
        filter: (text: string): string =>
            text.replace(
                /<p(?:\s+class="([^"]+?)"\s*)?(style="[^"]+?")?.*?>\s*(<img.+?alt[^>]+?>)\s*<\/p>/gm,
                (_str, pclass, pstyle, img) =>
                    `<div class="alt-img-container ${pclass || ''}" ${
                        pstyle || ''
                    }>${img}\n<span class="alt-i">ALT</span></div>`
            ),
    },
] as ShowdownExtension[];
