import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import EmailItem from '@/components/email-item/email-item';
import { breakpoints as bp } from '@/common/utils';
import { Email } from '@/common/types/email.types';

const styles = {
  drawer: {
    '& > .MuiPaper-root': {
      position: 'static',
      minHeight: '100vh',
      overflow: 'hidden',

      [bp.sm]: {
        position: 'fixed',
        width: '100%',
        zIndex: 20,
      },
    },
  },
};

interface SidebarProps {
  isOpenOnMobile: boolean;
  emails: Email[];
  selectedEmailId: string;
  onSelectEmail: (id: string) => void;
}

export default function Sidebar({
  emails,
  selectedEmailId,
  onSelectEmail,
}: SidebarProps) {
  return (
    <Drawer sx={styles.drawer} variant="permanent">
      <List>
        {emails.map((email) => (
          <EmailItem
            key={email.id}
            {...email}
            isSelected={selectedEmailId === email.id}
            onSelectEmail={onSelectEmail}
          />
        ))}
      </List>
    </Drawer>
  );
}
