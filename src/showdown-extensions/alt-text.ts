import { compile } from 'handlebars';
import type { ShowdownExtension } from 'showdown';

const renderImage = compile(`
<div class="alt-img-container">
    {{{ img }}}
    <span class="alt-i" data-tooltip="{{ altText }}" aria-hidden="true">
        ALT
    </span>
</div>
`);

export default [
    {
        type: 'html',
        filter: (text: string): string =>
            text.replace(/<p.*?>\s*(<img.+?alt="([^"]+)"[^>]+?>)\s*<\/p>/gm, (_str, img, altText) =>
                renderImage({
                    img,
                    altText,
                })
            ),
    },
] as ShowdownExtension[];
