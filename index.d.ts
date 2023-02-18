export = Database;
declare class Database {
    /**
     * Create a database.
     * @param {string} name - The name of the database
     */
    constructor(name: string);
    dbPath: string;
    /**
     * @param {object} value
     * @returns {object} with id, that was added
     */
    add(value: object): object;
    /**
     * Method, that removes document with specific id
     * @param {string} id
     * @returns {Array} changed entire database
     */
    remove(id: string): any[];
    /**
     * Method, that gets entire database
     * @returns {array}
     */
    get(): any[];
    /**
     * Method, that clears database (danger)
     */
    clear(): void;
}
//# sourceMappingURL=index.d.ts.map