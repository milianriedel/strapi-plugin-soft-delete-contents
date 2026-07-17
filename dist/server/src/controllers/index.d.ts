declare const _default: {
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
export default _default;
