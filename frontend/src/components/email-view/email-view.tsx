import { Email } from '@/common/types/email.types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { breakpoints as bp } from '@/common/utils';

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: '0 0 1px 0',
    height: 'calc(100% - 4.2rem)',
    overflowY: 'auto',

    [bp.sm]: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 30,
    },
  },
  closeButton: {
    display: 'none',

    [bp.sm]: {
      alignSelf: 'flex-end',
      display: 'block',
      maxWidth: '3rem',
      maxHeight: '3rem'
    },
  },
  header: {
    pb: 1,
  },
  content: {
    pt: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  label: {
    fontWeight: 600,
    minWidth: 48,
  },
  chip: {
    mb: 0.5,
  },
  bodyWrapper: {
    whiteSpace: 'pre-wrap',
  },
  dividerSpacing: {
    my: 1,
  },
} as const;

interface EmailViewProps extends Email {
  onClose?: () => void;
}

export default function EmailView({
  to,
  cc,
  bcc,
  subject,
  body,
  created_at: createdAt,
  onClose,
}: EmailViewProps) {
  const addressRow = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 48 }}>
          {label}:
        </Typography>
        <Chip key={value} label={value} size="small" sx={{ mb: 0.5 }} />
      </Stack>
    );
  };

  return (
    <Card variant="outlined" sx={styles.card}>
      <CardHeader
        title={subject || '(No subject)'}
        subheader={
          createdAt ? `Created: ${new Date(createdAt).toLocaleString()}` : ''
        }
        action={
          onClose ? (
            <IconButton sx={styles.closeButton} size="large" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null
        }
        sx={styles.header}
      />
      <CardContent sx={styles.content}>
        <Stack spacing={1}>
          {addressRow('To', to)}
          {addressRow('Cc', cc)}
          {addressRow('Bcc', bcc)}
        </Stack>
        <Divider sx={styles.dividerSpacing} />
        <Box sx={styles.bodyWrapper}>
          <Typography variant="body1" component="div">
            {body}
          </Typography>
        </Box>
        <Divider sx={styles.dividerSpacing} />
      </CardContent>
    </Card>
  );
}
