import {
  NavigationContainerRef,
  NavigationState
} from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: object) {
  navigationRef.current?.navigate(name, params);
}

export function reset(params: NavigationState) {
  navigationRef.current?.resetRoot(params);
}
