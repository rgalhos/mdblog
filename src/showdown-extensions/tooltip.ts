import { randomBytes } from 'node:crypto';
import { compile } from 'handlebars';
import type { ShowdownExtension } from 'showdown';

const renderTooltip = compile(`
<span class="tooltip" aria-describedby="{{ id }}">
    {{{ text }}}
    <span class="tooltip-content" id="{{ id }}" role="tooltip">
        {{{ tooltip }}}
    </span>
</span>
`);

export default [
    {
        type: 'lang',
        filter: (text: string): string =>
            text.replace(/\{(.+?)\}\{(.+?)\}/g, (_str, text, tooltip): string =>
                renderTooltip({
                    text: text,
                    tooltip: tooltip,
                    id: 'tooltip-' + randomBytes(4).readUint32LE().toString(36),
                })
            ),
    },
] as ShowdownExtension[];
