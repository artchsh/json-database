declare const randomUUID: any;
declare const fs: any;
type cbFunc = (error: unknown, docs: object | object[] | null) => void;
type objectEx = {
    [key: string]: any;
};
declare const defaultCallback: cbFunc;
declare class Database {
    #private;
    dbPath: string;
    constructor(name: string);
    add(value: objectEx, cb?: cbFunc): objectEx;
    removeById(id: string, cb?: cbFunc): unknown;
    get(cb?: cbFunc): any;
    findById(id: string, cb: cbFunc): objectEx | null;
    findOne(query: object, cb?: cbFunc): any;
    findOneAndEdit(query: object, edit: object, cb?: cbFunc): any;
    clear(cb?: cbFunc): any;
}
//# sourceMappingURL=index.d.ts.map