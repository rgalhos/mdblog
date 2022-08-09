export {};

declare global {
    type Dictionary<T> = { [key: string]: T };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type UnknownDictionary = { [key: string]: any };
}
