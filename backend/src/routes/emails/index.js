/**
 * Email routes
 * 
 * NOTE: I'm aware that it would be more fited for these routes to be put
 * in the Next.js project for the future (due to the Next.js SSR mechanisms).
 * If I would have moved the endpoints in the Front-End project, a knex DB
 * connection would have been required there as well and the DB logic from
 * "src/db/index.js" should be put in a common library folder, to be accessible
 * for both FE and BE.
 * 
 * For simplicity, I left the endpoints here for now. 
 */
import DB from './../../db/index.js';

export default async function emailsRoutes(fastify) {
  fastify.get('/', async () => {
    const emails = await DB.read('emails');
    return emails;
  });

  fastify.post('/', async (request, reply) => {
    const { to, cc = null, bcc = null, subject, body } = request.body || {};

    if (!to || !subject || !body) {
      reply.code(400);
      return { error: 'Missing required fields: to, subject, body' };
    }
    try {
      const id = await DB.insert('emails', { to, cc, bcc, subject, body });
      const created = await DB.findById('emails', id);
      reply.code(201);
      return created;
    } catch (err) {
      request.log.error(err);
      reply.code(500);
      return { error: 'Failed to create email' };
    }
  });
}
