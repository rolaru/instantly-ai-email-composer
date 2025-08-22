import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';

interface FullscreenLoadingProps {
  isOpen: boolean;
}

const styles = {
  loadingDialog: {
    '& .MuiPaper-root': {
      minWidth: '12rem',
      minHeight: '12rem',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(#b0b0b080, transparent 70%)',
      boxShadow: 'none'
    },
  },
};

export default function FullscreenLoading({ isOpen }: FullscreenLoadingProps) {
  return (
    <Dialog sx={styles.loadingDialog} open={isOpen}>
      <CircularProgress />
    </Dialog>
  );
}
