import type { ShowdownExtension } from 'showdown';

export default [
    {
        type: 'html',
        regex: /(<h([1-4])\s+id="([^"]+?)"\s*>)(.*<\/h\2>)/g,
        replace: `$1<a class="anchor" href="#$3" aria-hidden="true"><i class="mdi mdi-link-variant"></i></a>$4`,
    },
] as ShowdownExtension[];
