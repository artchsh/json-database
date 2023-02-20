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
     * @returns {Array} changed database
     */
    removeById(id: string): any[];
    /**
     * Method, that gets entire database
     * @returns {array}
     */
    get(): any[];
    /**
     * Method, that searches for specified object
     * @param {string} id Search for an object with this id
     * @returns {object}
     */
    findById(id: string): object;
    /**
     * Method, that clears database (danger)
     * @returns {array} cleared database
     */
    clear(): any[];
    #private;
}
//# sourceMappingURL=index.d.ts.map