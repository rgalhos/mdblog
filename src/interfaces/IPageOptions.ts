export interface PageOptions {
    title: string | null;
    metaTags: Dictionary<{ content: string; type: 'name' | 'property' }>;
    hideSidebar: boolean;
    lazyLoadImages: boolean;
    disableXssFilter: boolean;
}

export type AvailableOptions =
    | 'title'
    | 'meta'
    | 'meta-property'
    | 'hide_sidebar'
    | 'lazy_load_images'
    | 'disable_xss_prevention';
