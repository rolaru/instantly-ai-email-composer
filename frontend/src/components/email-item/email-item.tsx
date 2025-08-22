import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { combineStyles } from '@/common/utils';
import { Email } from '@/common/types/email.types';

const styles = {
  card: {
    padding: '1rem',
    width: '100%',
    cursor: 'pointer',
  },
  selectedCard: {
    backgroundColor: '#f0f0f0',
  },
};

interface EmailItemProps extends Email {
  isSelected: boolean;
  onSelectEmail: (id: string) => void;
}

export default function EmailItem({
  id,
  to,
  subject = '',
  body = '',
  isSelected,
  onSelectEmail = () => {},
}: EmailItemProps) {
  const onClick = () => onSelectEmail(id);

  return (
    <ListItem>
      <Card
        sx={combineStyles(styles.card, isSelected ? styles.selectedCard : {})}
        onClick={onClick}
      >
        <Typography variant="subtitle2" color="primary">
          {to}
        </Typography>
        <Typography variant="subtitle2" noWrap={true}>
          <b>{subject}</b>
        </Typography>
        <Typography variant="body2" noWrap={true}>
          {body ? body.substring(0, 50) : ''}
        </Typography>
      </Card>
    </ListItem>
  );
}
