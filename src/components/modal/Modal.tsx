import React from 'react';
import { Button, Modal } from '@material-ui/core';
import styles from './Modal.module.css';

interface ModalProps {
  error: any | null;
  toggleModal: () => void;
}

const Modals = (props: ModalProps) => {
  const { error, toggleModal } = props;

  return (
    <Modal
      aria-labelledby='simple-modal-title'
      aria-describedby='simple-modal-description'
      open={!!error}
      onClose={toggleModal}
    >
      <div className={styles.Modal}>
        <h2 id='modal-title'>Oops, something went wrong!</h2>
        <p id='simple-modal-description'>{error.message}</p>
        <p id='simple-modal-description'>
          {error.response ? error.response.data : 'Error'}
        </p>
        <Button
          variant='contained'
          className={styles.Button}
          onClick={toggleModal}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default Modals;
