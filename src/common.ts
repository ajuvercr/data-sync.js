
export type FromJson<T> = (json: any) => T;
export type ToJson<T> = (t: T) => any;

export interface DataSync<T> {
    get(): Promise<T | undefined>;
    set(t: T): Promise<void>;
}

export abstract class DataSyncBase<T> implements DataSync<T> {
    protected readonly from_json: FromJson<T> ;
    protected readonly to_json: ToJson<T>;
    protected readonly identifier: string;

    private readonly init_promise: Promise<void>;

    protected inner: T | undefined;

    constructor(identifier: string, from_json: FromJson<T>, to_json: ToJson<T>) {
        this.identifier = identifier;
        this.from_json = from_json;
        this.to_json = to_json;
        this.init_promise =  this.init();
    }

    protected abstract init(): Promise<void>;

    protected abstract safe(t: any): Promise<void>;

    protected load(json: any): void {
        this.inner = this.from_json(json);
    }

    async get(): Promise<T | undefined> {
        await this.init_promise;
        return this.inner;
    }

    async set(t: T): Promise<void> {
        await this.init_promise;
        this.inner = t;
        await this.safe(this.to_json(t));
    }
}

