export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MD_FILES_PATH: string;
            HTML_FILES_PATH: string;
            SAVED_MD_FILES_PATH: string;
        }
    }
}
