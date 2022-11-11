export interface PageOptions {
    title: string | null;
    metaTags: Dictionary<{ content: string; type: 'name' | 'property' }>;
    hideSidebar: boolean;
    lazyLoadImages: boolean;
    hideEditHistory: boolean;
    disableXssFilter: boolean;
}

export type AvailableOptions =
    | 'title'
    | 'meta'
    | 'meta-property'
    | 'hide_sidebar'
    | 'lazy_load_images'
    | 'hide_edit_history'
    | 'disable_xss_prevention';
