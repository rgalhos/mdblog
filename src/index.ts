import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { FileWatcher } from './FileWatcher';
import { PageBuilder } from './PageBuilder';
import { addHeadToHistory } from './history';

//#region startup checks
if (!process.env.MD_FILES_PATH) {
    throw new Error('MD_FILES_PATH env var is not defined');
} else if (!existsSync(process.env.MD_FILES_PATH)) {
    throw new Error('MD_FILES_PATH directory does not exist');
} else if (!process.env.HTML_FILES_PATH) {
    throw new Error('HTML_FILES_PATH env var is not defined');
} else if (!existsSync(process.env.HTML_FILES_PATH)) {
    throw new Error('HTML_FILES_PATH directory does not exist');
} else if (!process.env.SAVED_MD_FILES_PATH) {
    throw new Error('SAVED_MD_FILES_PATH env var is not defined');
} else if (!existsSync(process.env.SAVED_MD_FILES_PATH)) {
    throw new Error('SAVED_MD_FILES_PATH directory does not exist');
}
//#endregion startup checks

~(function (): void {
    const fileWatcher = new FileWatcher();
    const pageBuilder = new PageBuilder();

    fileWatcher.on('mdChange', (entries) => {
        for (const entry of entries) {
            const copyPath = path.join(process.env.SAVED_MD_FILES_PATH, entry.filename + '.' + entry.md5sum + '.md');

            // File might already be there in case of a rollback
            if (!existsSync(copyPath)) {
                copyFileSync(entry.path, copyPath);
            }

            addHeadToHistory(entry);

            pageBuilder.build(entry);
        }
    });

    fileWatcher.on('templateChange', () => {
        console.log('template.hbs was modified. Rebuilding pages.');
        pageBuilder.rebuildPages();
    });
})();
