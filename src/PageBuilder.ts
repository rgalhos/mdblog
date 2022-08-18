import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import type { IFileDescription } from './interfaces/IFileDescription';
import type { ITemplateContext } from './interfaces/ITemplateContext';
import { FileWatcher } from './FileWatcher';
import { getEditHistory } from './history';
import { makeHtml } from './makeHtml';
import { project } from './utils';
import './hbs-helpers';

export class PageBuilder {
    private template!: HandlebarsTemplateDelegate;

    constructor() {
        this.loadTemplate();
    }

    public loadTemplate(): void {
        this.template = Handlebars.compile(readFileSync('./template.hbs').toString('utf-8'));
    }

    public build(fileDesc: IFileDescription): void {
        const renderStartTime = +Date.now();
        const markdownContent = readFileSync(fileDesc.path).toString('utf-8');

        const extractedMetadata = extractMetadata(markdownContent);

        extractedMetadata.metaTags.robots = extractedMetadata.metaTags?.robots || {
            type: 'name',
            content: process.env.PUBLICENV_ROBOTS as string,
        };

        const metaTags = Object.entries(extractedMetadata.metaTags)
            .map(([name, { content, type }]) => `<meta ${type}="${name}" content="${content}" />`)
            .join('\n');

        const context: ITemplateContext = {
            pageTitle: extractedMetadata.pageTitle ?? fileDesc.basename,
            file: fileDesc,
            metaTags: metaTags,
            markdownContent: makeHtml(markdownContent),
            editHistory: getEditHistory(fileDesc.path).map((entry) =>
                project(entry, ['filename', 'size', 'md5sum', 'mtime'])
            ),
            renderStartTime: renderStartTime,
            stringifiedFileInfo: JSON.stringify(project(fileDesc, ['filename', 'basename', 'size', 'md5sum', 'mtime'])),
            ...this.getEnvVariables(),
        };

        const html = this.template(context);

        writeFileSync(path.join(process.env.HTML_FILES_PATH, fileDesc.filename + '.html'), html, { encoding: 'utf-8' });
    }

    private getEnvVariables(): Dictionary<string> {
        const envVars: Dictionary<string> = {};
        const allVars = Object.entries(process.env).filter(([k, v]) => k.startsWith('PUBLICENV_') && !!v);
        for (const [k, v] of allVars) {
            const key = 'ENV_' + k.slice('PUBLICENV_'.length);
            envVars[key] = v as string;
        }
        return envVars;
    }

    public async rebuildPages(): Promise<void> {
        const markdownFiles = await FileWatcher.getMarkdownFiles();
        this.loadTemplate();

        for (const entry of markdownFiles) {
            this.build(entry);
        }
    }
}

export function extractMetadata(markdownContent: string): {
    pageTitle: string | null;
    metaTags: Dictionary<{ content: string; type: 'name' | 'property' }>;
} {
    //#region <meta name> tags
    const metaTags: Dictionary<{ content: string; type: 'name' | 'property' }> = {};
    const matchedMetaTags = markdownContent.match(/^\s*\{\{\s*meta(-property)?\s+[\w:]+\s*=\s*.+?\s*\}\}$/gm) || [];
    const parsedMetaTags = matchedMetaTags.map(
        (tag) =>
            tag.match(/^\s*\{\{\s*meta(?:-(?<type>property))?\s+(?<tag>[\w:]+)\s*=\s*(?<content>.+?)\s*\}\}$/)
                ?.groups || {}
    );

    for (const { type, tag, content } of parsedMetaTags) {
        if (!tag || !content) continue;

        metaTags[tag] = {
            content: content.replace(/"/g, '&quot;'),
            type: type === 'property' ? 'property' : 'name',
        };
    }
    //#endregion <meta name> tags

    //#region page title
    const pageTitle = markdownContent?.match(/^\s*\{\{\s*title\s+(.+?)\s*\}\}$/m)?.[1] || null;
    //#endregion page title

    return { metaTags, pageTitle };
}
