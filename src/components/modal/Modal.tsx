import useLocalization from '@hooks/useLocalization';
import { ModalAction } from 'lib/types/common';
import { IBoxProps, Modal as NMModal, useTheme } from 'native-base';
import { IModalProps } from 'native-base/lib/typescript/components/composites/Modal/types';
import React, { FC } from 'react';
import Button from '../form/Button';

export interface ModalProps extends IModalProps {
  title?: string;
  renderFooter?: React.FC;
  actions?: ModalAction[];
  _body?: IBoxProps;
  _footer?: IBoxProps;
  isShowHeader?: boolean;
  hideCloseButton?: boolean;
}

const Modal: FC<ModalProps> = ({
  children,
  title,
  renderFooter,
  actions,
  _body,
  _footer,
  isShowHeader = true,
  hideCloseButton,
  ...modalProps
}) => {
  const { t } = useLocalization();
  const { colors, sizes } = useTheme();

  return (
    <NMModal
      _backdrop={{
        bg: 'rgba(0,25,66,.95)',
        opacity: 1,
      }}
      {...modalProps}>
      <NMModal.Content>
        {isShowHeader && (
          <>
            {!hideCloseButton && <NMModal.CloseButton />}
            <NMModal.Header>{t(title ?? ' ')}</NMModal.Header>
          </>
        )}
        <NMModal.Body {..._body}>{children}</NMModal.Body>
        <NMModal.Footer {..._footer}>
          {renderFooter ? (
            renderFooter({})
          ) : (
            <Button.Group space={2} width="100%" justifyContent="center">
              {actions ? (
                actions.map(a => (
                  <Button
                    disabled={a.disabled}
                    bg={a.disabled ? colors.primary[400] : colors.primary[350]}
                    isLoading={a.loading}
                    key={a.label}
                    flex={actions.length > 1 ? 1 : 0}
                    onPress={() => {
                      if (!a.disableAutoClose && modalProps.onClose)
                        modalProps.onClose();

                      a.onPress && a.onPress();
                    }}
                    {...a.props}>
                    {a.label}
                  </Button>
                ))
              ) : (
                <Button
                  flex={1}
                  onPress={() => {
                    modalProps.onClose();
                  }}>
                  {t('common.close')}
                </Button>
              )}
            </Button.Group>
          )}
        </NMModal.Footer>
      </NMModal.Content>
    </NMModal>
  );
};

export default Modal;
