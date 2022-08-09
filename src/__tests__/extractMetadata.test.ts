import { extractMetadata } from '../createPage';

const header = `<!---
{{ meta-property og:title = Markdown Syntax }}
    {{meta-property og:description = A file I use to test markdown syntax}}
{{meta-property}}
{{meta }}
        {{ meta a b}}
{{meta invalid tag=test test test}}
  {{     meta-property     og:image   =   https://file.domain.tld/img/01ab37a1b.png           }}
{{meta description=This is a <meta name="description" /> tag}}
{{ title A silly little title to test this silly little code }}
-->`;

it('can extract meta tags', () => {
    const matches = extractMetadata(header);

    expect(matches.metaTags['og:title']).toEqual({
        content: 'Markdown Syntax',
        type: 'property',
    });

    expect(matches.metaTags['og:description']).toEqual({
        content: 'A file I use to test markdown syntax',
        type: 'property',
    });

    expect(matches.metaTags['og:image']).toEqual({
        content: 'https://file.domain.tld/img/01ab37a1b.png',
        type: 'property',
    });

    expect(matches.metaTags['description']).toEqual({
        content: 'This is a <meta name=&quot;description&quot; /> tag',
        type: 'name',
    });

    expect(Object.keys(matches.metaTags).length).toBe(4);

    expect(matches.pageTitle).toEqual('A silly little title to test this silly little code');
});
