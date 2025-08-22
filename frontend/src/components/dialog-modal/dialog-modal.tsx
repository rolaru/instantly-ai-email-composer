import { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface DialogModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: React.EventHandler<React.MouseEvent>;
  onConfirm: React.EventHandler<React.MouseEvent>;
  title?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  actionButtons?: React.FC | null;
  sx?: SxProps<Theme>;
}

export default function DialogModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  actionButtons: ActionButtons,
  cancelButtonText,
  confirmButtonText,
  sx = {},
  children,
}: DialogModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={sx}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {ActionButtons ? (
          <ActionButtons />
        ) : (
          <>
            <Button onClick={onClose}>{cancelButtonText || 'Cancel'}</Button>
            <Button onClick={onConfirm} autoFocus>
              {confirmButtonText ? confirmButtonText : 'OK'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
