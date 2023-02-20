declare const randomUUID: any;
declare const fs: any;
declare class Database {
    #private;
    dbPath: string;
    /**
     * Create a database.
     * @param {string} name - The name of the database
     */
    constructor(name: string);
    /**
     * @param {object} value
     * @returns {object} with id, that was added
     */
    add(value: {
        [key: string]: any;
    }): object;
    /**
     * Method, that removes document with specific id
     * @param {string} id
     * @returns {object[]} changed database
     */
    removeById(id: string): object[];
    /**
     * Method, that gets entire database
     * @returns {object[]}
     */
    get(): object[];
    /**
     * Method, that searches for specified object
     * @param {string} id Search for an object with this id
     * @returns {object}
     */
    findById(id: string): object;
    /**
     * Method, that searches for an object with that specific key and its value. If found nothing, then returns empty object
     * @param {object} query
     * @returns {object}
     */
    findOne(query: object): object;
    /**
     * Method, that clears database (danger)
     * @returns {object[]} cleared database
     */
    clear(): object[];
}
//# sourceMappingURL=index.d.ts.map