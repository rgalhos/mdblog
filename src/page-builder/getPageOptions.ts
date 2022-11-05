import type { PageOptions, AvailableOptions } from '../interfaces/IPageOptions';

export function getPageOptions(rawContent: string): PageOptions {
    const opts: PageOptions = {
        title: null,
        metaTags: {},
        lazyLoadImages: false,
        hideSidebar: false,
        disableXssFilter: false,
    };

    const header = rawContent.match(/<!---?(.|\n)*?-?-->/)?.[0];

    if (typeof header !== 'string') {
        return opts;
    }

    let tags = header.match(/^\s*\{\{.*?\}\}\s*$/gm);

    if (tags === null) {
        return opts;
    }

    tags = tags.map((tag) => tag.replace(/^\s*\{\{\s*|\s*\}\}\s*/g, ''));

    for (const t of tags) {
        const [tag, ...rest] = t.split(' ') as [AvailableOptions, ...string[]];
        const contents = rest.join(' ').trim();

        if (tag === 'title') {
            opts.title = contents.replace('<', '&lt;');
        } else if (tag === 'hide_sidebar') {
            opts.hideSidebar = true;
        } else if (tag === 'lazy_load_images') {
            opts.lazyLoadImages = true;
        } else if (tag === 'disable_xss_prevention') {
            // User must configure CORS correctly, obviously
            opts.disableXssFilter = true;
        } else if (tag === 'meta' || tag === 'meta-property') {
            const [key, ...r] = contents.split(/\s*=\s*/);
            const value = r.join('=').replace(/"/g, '&quot;');

            if (key && value) {
                opts.metaTags[key] = {
                    content: value,
                    type: tag === 'meta' ? 'name' : 'property',
                };
            }
        }
    }

    return opts;
}
