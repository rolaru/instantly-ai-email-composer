import { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import Sidebar from '@/components/sidebar/sidebar';
import ComposeEmailForm from '@/components/compose-email-form/compose-email-form';
import EmailView from '@/components/email-view/email-view';
import DialogModal from '@/components/dialog-modal/dialog-modal';
import { doGetRequest } from './../services/request.service';
import { breakpoints as bp } from '@/common/utils';

const styles = {
  grid: {
    width: '100%',
    minHeight: '100vh',
    flexWrap: 'nowrap',
  },
  sidebarSection: {
    minWidth: '22rem',
    maxWidth: '22rem',
    maxHeight: '100vh',
    overflowX: 'hidden',
    overflowY: 'auto',

    [bp.md]: {
      minWidth: '16rem',
      maxWidth: '16rem',
    },
  },
  selectedView: {
    flexGrow: 1,
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  composeEmailButton: {
    position: 'fixed',
    bottom: '0.75rem',
    right: '0.75rem',
    zIndex: 50,
  },
};

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showComposeEmailForm, setShowComposeEmailForm] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const preparedToSelectEmailId = useRef(null);

  useEffect(() => {
    getEmails();
  }, []);

  async function getEmails() {
    try {
      const { data } = await doGetRequest('/emails');
      setEmails(data);
    } catch (error) {
      alert('Error loading emails.');
      console.error(error);
    }
  }

  function openEmail(id) {
    const emailToSelect = emails.find((email) => email.id === id);

    if (emailToSelect) {
      setSelectedEmail(emailToSelect);
      setShowComposeEmailForm(false);
    }
  }

  function onComposeClick() {
    setSelectedEmail(null);
    setShowComposeEmailForm(true);
  }

  function onSelectEmail(id) {
    if (showComposeEmailForm) {
      preparedToSelectEmailId.current = id;
      setIsDiscardModalOpen(true);
    } else {
      openEmail(id);
    }
  }

  const onDiscardClick = () => setIsDiscardModalOpen(true);
  const onDiscardClose = () => setIsDiscardModalOpen(false);

  function onDiscardEmail() {
    onDiscardClose();

    if (preparedToSelectEmailId.current) {
      openEmail(preparedToSelectEmailId.current);
      preparedToSelectEmailId.current = null;
    } else {
      setShowComposeEmailForm(false);
    }
  }

  const onCloseEmailView = () => setSelectedEmail(null);
  const onEmailSent = () => {
    setShowComposeEmailForm(false);
    getEmails();
  };

  return (
    <>
      <Grid container sx={styles.grid}>
        <Grid size={3} sx={styles.sidebarSection}>
          <Sidebar
            emails={emails}
            selectedEmailId={selectedEmail?.id}
            onSelectEmail={onSelectEmail}
          />
        </Grid>
        <Grid size={9} sx={styles.selectedView}>
          {showComposeEmailForm && (
            <ComposeEmailForm
              onEmailSent={onEmailSent}
              onDiscardClick={onDiscardClick}
            />
          )}
          {selectedEmail && (
            <EmailView {...selectedEmail} onClose={onCloseEmailView} />
          )}
        </Grid>
      </Grid>
      {!showComposeEmailForm && (
        <Button
          sx={styles.composeEmailButton}
          variant="contained"
          size="large"
          endIcon={<CreateIcon />}
          onClick={onComposeClick}
        >
          Compose
        </Button>
      )}
      <DialogModal
        title="Are you sure you want to discard the e-mail?"
        isOpen={isDiscardModalOpen}
        onClose={onDiscardClose}
        onConfirm={onDiscardEmail}
        confirmButtonText="Yes"
      />
    </>
  );
}
