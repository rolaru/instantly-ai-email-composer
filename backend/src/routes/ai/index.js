/**
 * AI CHATBOT ROUTES
 *
 * NOTE:
 * For simplicity of viewing and due to time constraints
 * I left all the logic of the Chatbot in this file.
 */
import { Readable } from 'node:stream';
import { openai } from '@ai-sdk/openai';
import { streamText, generateText, convertToModelMessages } from 'ai';
import 'dotenv/config';

const models = {
  routerAssistant: openai('gpt-4o-mini'), // Fast, cost effective and ideal for the routing task since it should suffice to determine the assistant type
  salesAssistant: openai('gpt-4o-mini'), // Good fit for generating short, high quality sales e-mails
  followupAssistant: openai('gpt-4.1'), // Great for generating more
};

const commonSystemPromptsOutputRequirements =
  '- OUTPUT STRICTLY AS COMPACT JSON: {"subject": "...", "body": "..."}. NO EXTRA TEXT.\n' +
  '- Always add an end greeting after which the user can enter his/her name, IN THE MESSAGE BODY.\n' +
  '- Always leave an empty row between the greeting and the body of the message, as well as between the body and ending of the message. All this comes IN THE BODY OF THE MESSAGE.';

const systemPrompts = {
  routerAssistant:
    'You are a routing classifier. Output exactly one of: sales, followup.\n' +
    '- sales: prospecting, outreach, pitching value, booking demos, pricing, ROI, cold emails.\n' +
    '- followup: polite, warn and empathetic check-ins, reminders, conforting in case of insatisfaction, touching base, status updates after no reply.',
  salesAssistant:
    'You are Sales Assistant. Generate concise sales emails tailored to the recipient.\n' +
    'Constraints:\n' +
    '- Total body under 40 words, in 1–4 short sentences (7–10 words each).\n' +
    '- Clear value proposition and call to action.\n' +
    commonSystemPromptsOutputRequirements,
  followupAssistant:
    'You are Follow-up Assistant. Generate polite, friendly, warn and empathetic check-in follow-up emails.\n' +
    'A couple of example moods for the messages: "just checking in", "how are you today?", "Long time no see..."' +
    'Constraints:\n' +
    '- The body can have even 5-8 sentences (max 15 words each).\n' +
    '- Maintain a friendly, low-pressure tone with a gentle call to action.\n' +
    commonSystemPromptsOutputRequirements,
};

export default async function aiRoutes(fastify) {
  fastify.post('/generate-email', async (request, reply) => {
    const { messages } = request.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      reply.code(400);
      return { error: 'Missing or invalid "messages" array' };
    }

    try {
      const modelMessages = convertToModelMessages(messages);
      const userPromptModelMessage = getLatestUserPrompt(modelMessages);
      const assistantType = await routeAssistant(userPromptModelMessage);

      // Get the specialized system prompt and model depending tn the type of assistant
      const systemPrompt = getSystemPromptFor(assistantType);
      const model = getLlmFor(assistantType);

      // Generate the result as a text stream and send it as a response
      const result = await streamText({
        model,
        system: systemPrompt,
        messages: modelMessages,
        temperature: 0.7, // Allow the generation of a broader range of responses
      });

      // Use UI message stream response variant only
      const webResponse = result.toUIMessageStreamResponse();
      reply.code(webResponse.status || webResponse.statusCode || 200);
      webResponse.headers?.forEach?.((value, key) => reply.header(key, value));
      const body = webResponse.body;
      const nodeStream = body ? Readable.fromWeb(body) : null;
      return reply.send(nodeStream);
    } catch (streamErr) {
      request.log.error(streamErr);
      reply.code(500);
      return { error: 'Failed to stream AI response.' };
    }
  });
}

/**
 * ROUTER LOGIC
 */

/**
 * Classifies the user's intent into one of the specialized assistants.
 * Returns 'sales' | 'followup'. Defaults to 'followup' on ambiguity.
 */
async function routeAssistant(userPrompt) {
  try {
    const { text } = await generateText({
      model: models.routerAssistant,
      system: systemPrompts.routerAssistant,
      prompt: `Prompt: "${
        userPrompt || ''
      }"\nAnswer with exactly one token: sales or followup.`,
      temperature: 0, // Be very precise
    });
    const label = String(text || '')
      .trim()
      .toLowerCase();
    return label.includes('followup') ? 'followup' : 'sales';
  } catch {
    return 'sales';
  }
}

/**
 * Returns the proper LLM for the selected assistant.
 */
function getLlmFor(type) {
  return type === 'sales' ? models.salesAssistant : models.followupAssistant;
}

/**
 * Returns the system prompt for the selected assistant.
 */
function getSystemPromptFor(type) {
  return type === 'sales'
    ? systemPrompts.salesAssistant
    : systemPrompts.followupAssistant;
}

/**
 * UTILS
 */

/**
 * Get the last user prompt from the message history.
 */
function getLatestUserPrompt(modelMessages) {
  const lastUserMessage = [...modelMessages]
    .reverse()
    .find((m) => m.role === 'user');
  const lastUserPrompt =
    typeof lastUserMessage?.content === 'string'
      ? lastUserMessage.content
      : Array.isArray(lastUserMessage?.content)
      ? lastUserMessage.content
          .map((p) => (p.type === 'text' ? p.text : ''))
          .join('\n')
          .trim()
      : '';

  return lastUserPrompt;
}
