declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi & {
            admin: any;
        };
    }) => Promise<void>;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: {};
        validator(): void;
    };
    controllers: {
        admin: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            findOne(ctx: any): Promise<any>;
            findMany(ctx: any): Promise<any>;
            delete(ctx: any): Promise<any>;
            restore(ctx: any): Promise<any>;
            deleteMany(ctx: any): Promise<any>;
            restoreMany(ctx: any): Promise<any>;
            getSettings(ctx: any): Promise<any>;
            setSettings(ctx: any): Promise<any>;
        };
    };
    routes: {
        admin: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: string[];
                };
            }[];
        };
    };
    services: {
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
                    tag?: string; /**
                     * Plugin server methods
                     */
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
    contentTypes: {};
    policies: {
        adminCanRead: (policyContext: any, config: any, { strapi }: {
            strapi: any;
        }) => any;
        adminCanRestore: (policyContext: any, config: any, { strapi }: {
            strapi: any;
        }) => any;
        adminCanDeletePermanently: (policyContext: any, config: any, { strapi }: {
            strapi: any;
        }) => any;
    };
    middlewares: {};
};
export default _default;
