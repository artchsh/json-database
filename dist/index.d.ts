type cbFunc = (error: unknown, docs: object | object[] | null) => void;
type objectEx = {
    [key: string]: any;
};
declare class JsonDatabase {
    #private;
    dbPath: string;
    tableName: string;
    constructor(name: string, table?: string);
    /**
     * @param {objectEx} value
     * @param {cbFunc} cb
     * @returns {object}
     */
    add(value: objectEx, cb?: cbFunc): unknown[];
    /**
     * @param {string} id
     * @param {cbFunc} cb
     * @returns {unknown | object[]}
     */
    removeById(id: string, cb?: cbFunc): unknown[] | undefined;
    /**
     * @param {cbFunc} cb
     * @returns {unknown | object}
     */
    all(cb?: cbFunc): [unknown | null, objectEx | null];
    getCurrentTable(cb?: cbFunc): [unknown | null, objectEx[] | null];
    /**
     * @param {string} id
     * @param {cbFunc} cb
     * @returns {object | null}
     */
    findById(id: string, cb?: cbFunc): unknown[];
    /**
     * @param {object} query
     * @param {cbFunc} cb
     * @returns {object | null}
     */
    findOne(query: object, cb?: cbFunc): unknown[];
    /**
     * @param {object} query
     * @param {object} edit
     * @param {cbFunc} cb
     * @returns {object[] | unknown}
     */
    findOneAndEdit(query: object, edit: object, cb?: cbFunc): unknown[];
    /**
     * @param {cbFunc} cb
     * @returns {object[] | unknown}
     */
    clear(cb?: cbFunc): unknown[];
}
export { JsonDatabase };
//# sourceMappingURL=index.d.ts.map