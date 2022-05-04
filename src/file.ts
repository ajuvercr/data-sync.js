import { DataSyncBase } from "./common";
import { readFile, writeFile } from "node:fs/promises";
import { watch } from "fs/promises";

export class FileDataSync<T> extends DataSyncBase<T> {
    protected lastSaved: any | undefined;
    protected init(): void {
        (async () => {
            try {
                const watcher = watch(this.identifier);
                for await (const event of watcher) {
                    if (event.eventType == "change") {
                        const content = await readFile(this.identifier, "utf-8");
                        try {
                            this.load(content);
                        } catch (e) {
                            console.error("not json", content)
                            console.error(e)
                            this.inner = undefined;
                            return undefined
                        }
                    }
                }
            } catch (err: any) {
                if (err.name === 'AbortError')
                    return;
                throw err;
            }
        })()
    }

    protected async safe(t: any): Promise<void> {
        if(t !== this.lastSaved) {
            this.lastSaved = t;
            return await writeFile(this.identifier, t);
        }
    }
}

