/*
  TODO: This can be made a separate NPM library (instantly-db for example)
  to be used by both the Next.js project and the backend project, since
  the Next.js project can have it's own endpoints (e.g.: email endpoints
  can be moved in the Next.js project).
*/
import knex from 'knex';

const dbHandler = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
});

export default class DB {
  /**
   * Read rows from a table.
   * @param {string} table - Table name.
   * @param {object} [where] - Simple equality filter object. Pass null/undefined for no filter.
   * @param {object} [options]
   * @param {string[]|string} [options.columns='*'] - Columns to select.
   * @param {number} [options.limit]
   * @param {number} [options.offset]
   * @returns {Promise<object[]>}
   */
  static async read(table, where = undefined, options = {}) {
    let query = dbHandler(table);
    const { columns = '*', limit, offset } = options;
    if (where && Object.keys(where).length) query = query.where(where);
    if (limit != null) query = query.limit(limit);
    if (offset != null) query = query.offset(offset);
    return query.select(columns);
  }

  /**
   * Insert a row or rows.
   * @param {string} table
   * @param {object|object[]} data
   * @returns {Promise<number[]|number>} inserted id(s) where supported.
   */
  static async insert(table, data) {
    const rows = Array.isArray(data) ? data : [data];
    const ids = await dbHandler(table).insert(rows);
    return Array.isArray(data) ? ids : ids[0];
  }

  /**
   * Update rows matching filter.
   * @param {string} table
   * @param {object} where - equality filter.
   * @param {object} changes - fields to update.
   * @returns {Promise<number>} count of affected rows.
   */
  static async update(table, where, changes) {
    if (!where || !Object.keys(where).length)
      throw new Error(
        'Update requires a where filter to prevent mass updates.'
      );
    return dbHandler(table).where(where).update(changes);
  }

  /**
   * Delete rows matching filter.
   * @param {string} table
   * @param {object} where - equality filter.
   * @returns {Promise<number>} count of deleted rows.
   */
  static async delete(table, where) {
    if (!where || !Object.keys(where).length)
      throw new Error(
        'Delete requires a where filter to prevent mass deletion.'
      );
    return dbHandler(table).where(where).del();
  }

  /**
   * Convenience: find by id (default id column 'id').
   * @param {string} table
   * @param {number|string} id
   * @param {string} [idColumn='id']
   * @returns {Promise<object|null>}
   */
  static async findById(table, id, idColumn = 'id') {
    const row = await dbHandler(table)
      .where({ [idColumn]: id })
      .first();
    return row || null;
  }
}
