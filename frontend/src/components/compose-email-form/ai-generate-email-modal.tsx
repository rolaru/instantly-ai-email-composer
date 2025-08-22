import { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import TextField from '@mui/material/TextField';
import DialogModal from '@/components/dialog-modal/dialog-modal';
import FullscreenLoading from '@/components/fullscreen-loading/fullscreen-loading';
import { breakpoints as bp } from '@/common/utils';

const styles = {
  aiModal: {
    '& .MuiPaper-root': {
      width: '100%',
      maxWidth: '80vw',

      [bp.sm]: {
        margin: '0.5rem',
        maxWidth: '100%',
      },
    },
  },
  aiTextarea: {
    width: '100%',
  },
};

interface AiGenerateEmailModalProps {
  isAiModalOpen: boolean;
  onAiModalClose: () => void;
  onResponse: (generatedEmail: Object) => void;
}

const aiEndpoint = `${
  process.env.NEXT_PUBLIC_APIS_URL ?? ''
}/ai/generate-email`;

export default function AiGenerateEmailModal({
  isAiModalOpen,
  onAiModalClose,
  onResponse,
}: AiGenerateEmailModalProps) {
  const [userPrompt, setUserPrompt] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: aiEndpoint }),
  });

  useEffect(() => {
    // After the send button was clicked, wait for the
    // final assistant response and close the modal.

    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role !== 'assistant') {
      return;
    }

    const textMessagePart = latestMessage?.parts.find(
      (part) => part.type === 'text' && part.state === 'done'
    );
    if (textMessagePart?.type !== 'text' || !textMessagePart.text) {
      return;
    }

    try {
      onResponse(JSON.parse(textMessagePart.text));
      setUserPrompt('');
      setShowLoading(false);
      onAiModalClose();
    } catch (e) {
      setShowLoading(false);
      alert('An error occured when trying to generate the email texts.');
      console.error(e);
    }
  }, [messages]);

  const onChangeUserPrompt = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setUserPrompt(e.target.value);

  async function onSendAiPrompt() {
    try {
      setShowLoading(true);
      await sendMessage({ text: userPrompt });
    } catch (e) {
      alert('An error occured when trying to generate the email texts.');
      console.error(e);
    }
  }

  return !showLoading ? (
    <DialogModal
      title="What should the e-mail be about?"
      isOpen={isAiModalOpen}
      onClose={onAiModalClose}
      onConfirm={onSendAiPrompt}
      confirmButtonText="Generate email text"
      sx={styles.aiModal}
    >
      <TextField
        multiline
        rows={5}
        sx={styles.aiTextarea}
        value={userPrompt}
        onChange={onChangeUserPrompt}
      ></TextField>
    </DialogModal>
  ) : (
    <FullscreenLoading isOpen={showLoading} />
  );
}
