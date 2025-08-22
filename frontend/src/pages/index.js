import { useEffect, useRef, useState } from 'react';
import { breakpoints as bp } from '@/common/utils';

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

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
    }
  }


  function onSelectEmail(id) {
      openEmail(id);
  }

  const onCloseEmailView = () => setSelectedEmail(null);

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
          {selectedEmail && (
            <EmailView {...selectedEmail} onClose={onCloseEmailView} />
          )}
        </Grid>
      </Grid>
    </>
}
