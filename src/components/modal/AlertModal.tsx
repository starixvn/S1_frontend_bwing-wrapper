import useLocalization from '@hooks/useLocalization';
import { AlertActions } from '@modules/alert';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import Modal from './Modal';

const AlertModal = () => {
  const dispatch = useDispatch();
  const { t } = useLocalization();

  const alertList = useSelector((s: RootState) => s.alert.data);
  const alert = alertList ? alertList[0] : undefined;

  const isVisible = alert != null && !alert.isDismissed;

  if (alert === undefined) return null;
  let {
    title = t('common.importantNote'),
    message,
    onDismiss,
    actions,
    persistent,
    hideCloseButton,
  } = alert;

  function _onDismiss() {
    if (typeof onDismiss === 'function') onDismiss();
    else dispatch(AlertActions.dismiss());

    setTimeout(() => {
      dispatch(AlertActions.next());
    }, 200);
  }

  return (
    <Modal
      isOpen={isVisible}
      hideCloseButton={hideCloseButton}
      title={title}
      onClose={_onDismiss}
      actions={actions}
      closeOnOverlayClick={!persistent}>
      {t(message)}
    </Modal>
  );
};

export default AlertModal;
