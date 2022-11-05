import * as cheerio from 'cheerio';
import { compile } from 'handlebars';

interface Heading {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    id: string;
    title: string;
}

const sidebar = compile(`
<nav id="sidebar" aria-label="Table of contents">
    <div role="menu">
    {{#each headings}}
        <div class="level-{{this.level}}" role="menuitem">
            <a href="#{{this.id}}">
                {{this.title}}
            </a>
        </div>
    {{/each}}
    </div>
</nav>
`);

function getHeadings(html: string): Heading[] {
    const headings: Heading[] = [];
    const $ = cheerio.load(html);

    cheerio;

    for (const item of $('.heading')) {
        const id = item.attribs?.id;
        const lastChild = item.lastChild;

        if (!id || !lastChild || lastChild.type !== 'text') continue;

        headings.push({
            level: Number(item.name.slice(1)) as Heading['level'],
            id: id,
            title: lastChild.data,
        });
    }

    return headings;
}

export function generateSidebar(html: string): string | null {
    const headings = getHeadings(html);

    if (headings.length === 0) return null;

    return sidebar({ headings });
}
