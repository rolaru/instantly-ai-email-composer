import { FormEvent, useState } from 'react';
import { css } from '@emotion/react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import AiGenerateEmailModal from './ai-generate-email-modal';
import { doPostRequest } from '@/services/request.service';
import { breakpoints as bp } from '@/common/utils';

const styles = {
  form: css({
    boxSizing: 'border-box',
    padding: '1rem',
    width: '100%',
    height: '100vh',
    backgroundColor: '#fff',

    [bp.sm]: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 30,
    },
  }),
  stack: {
    width: '100%',
    height: '100%',
  },
  bodyTextarea: {
    flexGrow: 1,

    '& .MuiInputBase-root': {
      flexGrow: 1,
      alignItems: 'flex-start',
    },
  },
  actionButtonsBar: {
    justifyContent: 'space-between',
    gap: '1rem',
    paddingBottom: '1rem',
  },
  discardButton: {
    justifySelf: 'flex-start',
  },
  rightButtonsGroup: {
    display: 'flex',
    gap: '1rem',
  },
};

const defaultFormState = {
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
};

interface ComposeEmailFormProps {
  onEmailSent: () => void;
  onDiscardClick: React.EventHandler<React.MouseEvent>;
}

export default function ComposeEmailForm({
  onEmailSent,
  onDiscardClick,
}: ComposeEmailFormProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);

  const onChangeFormField = (field: string, value: string) =>
    setFormState({ ...formState, [field]: value });

  const onAiModalOpen = () => setIsAiModalOpen(true);
  const onAiModalClose = () => setIsAiModalOpen(false);

  function onEmailGenerationResponse(generatedEmail) {
    if (generatedEmail?.subject && generatedEmail?.body) {
      const { subject, body } = generatedEmail;
      setFormState({ ...formState, subject, body });
    } else {
      alert(
        'Unofrtunately there was an error getting the subject or the body of the generated email'
      );
    }
  }

  async function onSendEmail(e: FormEvent) {
    e.preventDefault();

    try {
      // TODO: A more in depth validation (like email & other fields format could be done with zod for example)
      if (!formState.to || !formState.subject) {
        alert('Missing "To" or "Subject" fields.');
        return;
      }

      const { status } = await doPostRequest('/emails', formState);
      if (status === 201) {
        onEmailSent();
      }
    } catch (e) {
      alert('Error sending the email.');
      console.error(e);
    }
  }

  return (
    <>
      <form css={styles.form} onSubmit={onSendEmail}>
        <Stack sx={styles.stack} spacing={1.5}>
          <FormControl>
            <InputLabel htmlFor="email-to">To:</InputLabel>
            <Input
              id="email-to"
              required
              value={formState.to}
              onChange={(e) => onChangeFormField('to', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="email-cc">CC:</InputLabel>
            <Input
              id="email-cc"
              value={formState.cc}
              onChange={(e) => onChangeFormField('cc', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="email-bcc">BCC:</InputLabel>
            <Input
              id="email-bcc"
              value={formState.bcc}
              onChange={(e) => onChangeFormField('bcc', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="email-subject">Subject:</InputLabel>
            <Input
              id="email-subject"
              required
              value={formState.subject}
              onChange={(e) => onChangeFormField('subject', e.target.value)}
            />
          </FormControl>
          <TextField
            rows={8}
            multiline
            variant="standard"
            sx={styles.bodyTextarea}
            value={formState.body}
            onChange={(e) => onChangeFormField('body', e.target.value)}
          />
          <FormGroup row={true} sx={styles.actionButtonsBar}>
            <Button
              variant="contained"
              color="error"
              endIcon={<DeleteForeverIcon />}
              onClick={onDiscardClick}
            >
              Discard
            </Button>
            <Box sx={styles.rightButtonsGroup}>
              <Button
                sx={styles.discardButton}
                variant="contained"
                color="secondary"
                endIcon={<AutoAwesomeIcon />}
                onClick={onAiModalOpen}
              >
                AI
              </Button>
              <Button variant="contained" type="submit" endIcon={<SendIcon />}>
                Send
              </Button>
            </Box>
          </FormGroup>
        </Stack>
      </form>
      <AiGenerateEmailModal
        isAiModalOpen={isAiModalOpen}
        onAiModalClose={onAiModalClose}
        onResponse={onEmailGenerationResponse}
      />
    </>
  );
}
