import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import type { IFileDescription } from '../interfaces/IFileDescription';
import type { ITemplateContext } from '../interfaces/ITemplateContext';
import { getPageOptions } from './getPageOptions';
import { FileWatcher } from '../FileWatcher';
import { getEditHistory } from '../history';
import { makeHtml } from './makeHtml';
import { project } from '../utils';
import './helpers';
import { generateSidebar } from './generateSidebar';

export class PageBuilder {
    private template!: HandlebarsTemplateDelegate;

    constructor() {
        this.loadTemplate();
    }

    public loadTemplate(): void {
        this.template = Handlebars.compile(readFileSync('./template.hbs').toString('utf-8'));
    }

    public build(fileDesc: IFileDescription): void {
        console.log(`Rebuilding ${fileDesc.basename} [${fileDesc.md5sum}]`);

        const renderStartTime = +Date.now();
        const markdownContent = readFileSync(fileDesc.path).toString('utf-8');
        const pageOptions = getPageOptions(markdownContent);

        pageOptions.metaTags.robots = pageOptions.metaTags?.robots || {
            type: 'name',
            content: process.env.PUBLICENV_ROBOTS as string,
        };

        const metaTags = Object.entries(pageOptions.metaTags)
            .map(([name, { content, type }]) => `<meta ${type}="${name}" content="${content}" />`)
            .join('\n');

        const htmlPageContent = makeHtml(markdownContent, pageOptions);

        let sidebar: null | string = null;
        if (!pageOptions.hideSidebar) {
            sidebar = generateSidebar(htmlPageContent);
        }

        const context: ITemplateContext = {
            pageTitle: pageOptions.title ?? fileDesc.basename,
            file: fileDesc,
            metaTags: metaTags,
            markdownContent: htmlPageContent,
            editHistory: getEditHistory(fileDesc.path).map((entry) =>
                project(entry, ['filename', 'size', 'md5sum', 'mtime'])
            ),
            renderStartTime: renderStartTime,
            stringifiedFileInfo: JSON.stringify(project(fileDesc, ['filename', 'basename', 'size', 'md5sum', 'mtime'])),

            sidebar: sidebar,
            hideEditHistory: pageOptions.hideEditHistory,

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
