import { EventEmitter } from 'node:events';
import { exec } from 'node:child_process';
import path from 'node:path';
import chokidar from 'chokidar';
import type { IFileDescription } from './interfaces/IFileDescription';
import { isHead } from './history';

export declare interface FileWatcher {
    on(event: 'mdChange', listener: (files: IFileDescription[]) => void): this;
    on(event: 'templateChange', listener: () => void): this;

    emit(event: 'mdChange', files: IFileDescription[]): boolean;
    emit(event: 'templateChange'): boolean;
}

export class FileWatcher extends EventEmitter {
    constructor() {
        super();

        this.initWatcher();
    }

    public static async getMarkdownFiles(): Promise<IFileDescription[]> {
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

    private async onFilelistChange(): Promise<void> {
        const markdownFileList = await FileWatcher.getMarkdownFiles();
        const markdownFiles = markdownFileList.filter((file) => !isHead(file));

        if (markdownFiles.length > 0) {
            this.emit('mdChange', markdownFiles);
        }
    }

    private initWatcher(): void {
        const mdWatcher = chokidar.watch(process.env.MD_FILES_PATH, {
            persistent: true,
            ignorePermissionErrors: false,
            atomic: true,
            /**
             * @todo
             */
            //ignored: /^.*(?<!\.md)$/i,
        });

        mdWatcher.on('add', this.onFilelistChange.bind(this));
        mdWatcher.on('change', this.onFilelistChange.bind(this));

        const templateWatcher = chokidar.watch('./template.hbs', {
            persistent: true,
            ignorePermissionErrors: false,
            atomic: true,
        });

        templateWatcher.on('change', () => this.emit('templateChange'));
    }
}

function shell(cmd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
        });
    });
}
