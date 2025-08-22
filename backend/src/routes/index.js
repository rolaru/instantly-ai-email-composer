import emailsRoutes from './emails/index.js';
import aiRoutes from './ai/index.js';

export default async function routes(fastify) {
  // Mount the emails routes under /emails
  fastify.register(emailsRoutes, { prefix: '/emails' });
  fastify.register(aiRoutes, { prefix: '/ai' });
}
