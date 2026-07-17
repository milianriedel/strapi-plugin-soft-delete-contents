declare const _default: {
    admin: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        pluginStore: {
            get(params?: Partial<{
                key: string;
                type?: string;
                environment?: string;
                name?: string;
                tag?: string;
            }>): Promise<unknown>;
            set(params?: Partial<{
                key: string;
                value: unknown;
                type?: string;
                environment?: string;
                name?: string;
                tag?: string;
            }>): Promise<void>;
            delete(params?: Partial<{
                key: string;
                type?: string;
                environment?: string;
                name?: string;
                tag?: string;
            }>): Promise<void>;
        };
        findOne(ctx: any): Promise<any>;
        findMany(ctx: any): Promise<any[]>;
        delete(ctx: any): Promise<any>;
        restore(ctx: any): Promise<any>;
        deleteMany(ctx: any): Promise<import("@strapi/database/dist/types").CountResult>;
        restoreMany(ctx: any): Promise<import("@strapi/database/dist/types").CountResult>;
        getSettings(): Promise<unknown>;
        setSettings(settings: any): Promise<unknown>;
    };
};
export default _default;
