import { DataSync, FromJson, ToJson } from './common';
import { FileDataSync } from './file';

export * from './common';
export * from './file';

export type Types = "file";

export function create<T>(type: Types, location: string, to_json?: ToJson<T>, from_json?: FromJson<T>): DataSync<T> {
    to_json = to_json || JSON.stringify;
    from_json = from_json || JSON.parse;

    switch(type) {
        case "file":
            return new FileDataSync(location, from_json, to_json);
    }
}

