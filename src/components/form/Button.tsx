import { Button as NBButton, IButtonProps } from 'native-base';
import React from 'react';

const Button = (props: IButtonProps) => {
  return <NBButton {...props} />;
};

Button.Group = NBButton.Group;

export default Button;
