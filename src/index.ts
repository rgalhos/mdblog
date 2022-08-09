import { exec } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
import { createPage } from './createPage';
import { addHeadToHistory, isHead } from './history';
import type { IFileDescription } from './interfaces/IFileDescription';

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

function shell(cmd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
        });
    });
}

async function getMarkdownFiles(): Promise<IFileDescription[]> {
    const files = await shell(
        `find "${process.env.MD_FILES_PATH}" -type f -iname "*.md" -exec sh -c 'printf "%s %s %s\n" "$(du -b $1 | cut -f1)" "$(stat -c %Y $1)" "$(md5sum $1)"' '' '{}' '{}' \\;`
    );

    return files.stdout
        .slice(0, -1)
        .split('\n')
        .map((line) => line.split(/ +/g))
        .map((data) => {
            const { base, name } = path.parse(data[3]);

            return {
                size: Number(data[0]),
                mtime: Number(data[1]),
                md5sum: data[2],
                path: data[3],
                basename: base,
                filename: name,
            };
        });
}

async function main(): Promise<void> {
    const markdownFileList = await getMarkdownFiles();
    const markdownFiles = markdownFileList.filter((file) => !isHead(file));

    for (const entry of markdownFiles) {
        const copyPath = path.join(process.env.SAVED_MD_FILES_PATH, entry.filename + '.' + entry.md5sum + '.md');

        // File might already be there in case of a rollback
        if (!existsSync(copyPath)) {
            copyFileSync(entry.path, copyPath);
        }

        addHeadToHistory(entry);

        createPage(entry);
    }
}

const watcher = chokidar.watch(process.env.MD_FILES_PATH, {
    persistent: true,
    ignorePermissionErrors: false,
    atomic: true,
    /**
     * @todo
     */
    //ignored: /^.*(?<!\.md)$/i,
});

watcher.on('add', main);
watcher.on('change', main);
