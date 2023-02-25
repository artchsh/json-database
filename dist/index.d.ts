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
    /**
     * @param {objectEx} value
     * @param {cbFunc} cb
     * @returns {object}
     */
    add(value: objectEx, cb?: cbFunc): objectEx;
    /**
     * @param {string} id
     * @param {cbFunc} cb
     * @returns {unknown | object[]}
     */
    removeById(id: string, cb?: cbFunc): unknown;
    /**
     *
     * @param {cbFunc} cb
     * @returns {unknown | object}
     */
    get(cb?: cbFunc): any;
    /**
     * @param {string} id
     * @param {cbFunc} cb
     * @returns {object | null}
     */
    findById(id: string, cb: cbFunc): objectEx | null;
    /**
     * @param {object} query
     * @param {cbFunc} cb
     * @returns {object | null}
     */
    findOne(query: object, cb?: cbFunc): any;
    /**
     * @param {object} query
     * @param {object} edit
     * @param {cbFunc} cb
     * @returns {object[] | unknown}
     */
    findOneAndEdit(query: object, edit: object, cb?: cbFunc): any;
    /**
     * @param {cbFunc} cb
     * @returns {object[] | unknown}
     */
    clear(cb?: cbFunc): any;
}