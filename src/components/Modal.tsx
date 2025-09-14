import React from 'react';
import styles from '../styles/Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
            <button style={{ backgroundColor: '#ffffff'}} className={styles.closeBtn} onClick={onClose}><FontAwesomeIcon icon={faXmark}/></button>


                {children}
            </div>
        </div>
    );
};

export default Modal;
