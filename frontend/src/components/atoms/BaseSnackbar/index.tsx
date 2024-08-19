import Snackbar from '@mui/material/Snackbar';

type Props = {
  open: boolean;
  onClose: () => void;
  message: string;
};

export const BaseSnackbar = ({ open, onClose, message }: Props) => {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: 'success.light',
          },
        }}
        open={open}
        onClose={onClose}
        message={message}
        key='topcenter'
        autoHideDuration={1200}
      />
    </>
  );
};
