export declare const getSoftDeletedByAuth: (auth: any) => {
    id: number;
    strategy: string;
};
export declare const getService: (name: string) => any;
declare type CustomEventHubEmit = {
    uid: string;
    entity: any;
} & ({
    event: 'entry.delete';
    action: 'soft-delete' | 'delete-permanently';
} | {
    event: 'entry.update';
    action: 'restore';
} | {
    event: 'entry.unpublish';
    action: 'restore';
});
export declare const eventHubEmit: (params: CustomEventHubEmit) => Promise<void>;
export {};
