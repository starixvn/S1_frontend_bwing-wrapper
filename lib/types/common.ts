import { IButtonProps } from 'native-base';

export interface ModalAction {
  label: string;
  onPress?: () => void;
  disableAutoClose?: boolean;
  disabled?: boolean;
  loading?: boolean;
  props?: IButtonProps;
}
