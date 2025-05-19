import { useState, useCallback } from 'react';

const useModals = () => {
  const [modals, setModals] = useState({
    settings: false,
    polls: false,
    announcements: false,
    updates: false,
    notifications: false,
    bookings: false
  });

  const openModal = useCallback((modalName) => {
    setModals(prevState => ({
      ...prevState,
      [modalName]: true
    }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prevState => ({
      ...prevState,
      [modalName]: false
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      settings: false,
      polls: false,
      announcements: false,
      updates: false,
      notifications: false,
      bookings: false
    });
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals
  };
};

export default useModals;