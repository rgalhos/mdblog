import { getPageOptions } from '../page-builder/getPageOptions';

const header = `<!---
{{ meta-property og:title = Markdown Syntax }}
     {{meta-property og:description   =  A file I use to test markdown syntax}}
{{meta-property}}
{{meta }}
        {{ meta a b}}
    {{     meta-property og:image=https://file.domain.tld/img/01ab37a1b.png           }}
{{meta description=This is a <meta name="description" /> tag}}
{{ title A silly little title to test this silly little code }}
{{ hide_sidebar }}
{{ lazy_load_images }}
{{ disable_xss_prevention }}
-->`;

it('can extract option tags', () => {
    const opts = getPageOptions(header);

    console.log(opts.metaTags)

    expect(opts.metaTags['og:title']).toEqual({
        content: 'Markdown Syntax',
        type: 'property',
    });

    expect(opts.metaTags['og:description']).toEqual({
        content: 'A file I use to test markdown syntax',
        type: 'property',
    });

    expect(opts.metaTags['og:image']).toEqual({
        content: 'https://file.domain.tld/img/01ab37a1b.png',
        type: 'property',
    });

    expect(opts.metaTags['description']).toEqual({
        content: 'This is a <meta name=&quot;description&quot; /> tag',
        type: 'name',
    });

    expect(Object.keys(opts.metaTags).length).toBe(4);

    expect(opts.title).toEqual('A silly little title to test this silly little code');

    expect(opts.hideSidebar).toEqual(true);

    expect(opts.lazyLoadImages).toEqual(true);
});
