/**
 * Migration: Seed initial emails from mocks/emails.json
 */

// Load mock emails
const emails = require('./../mocks/emails.json');

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  if (!Array.isArray(emails) || emails.length === 0) return; // nothing to seed

  // Normalize records: ensure required keys exist; timestamps default via DB
  const rows = emails.map(e => ({
    to: e.to || null,
    cc: e.cc || null,
    bcc: e.bcc || null,
    subject: e.subject || null,
    body: e.body || null
  }));

  await knex('emails').insert(rows);
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  if (!Array.isArray(emails) || emails.length === 0) return;
  const subjects = emails.map(e => e.subject).filter(Boolean);
  if (subjects.length === 0) return;
  await knex('emails').whereIn('subject', subjects).del();
};
