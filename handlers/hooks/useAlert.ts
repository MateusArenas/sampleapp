import React from 'react';
import AlertContext, { AlertContextData } from '../Alert';

export default function useAlert(): AlertContextData {
  const methods = React.useContext(AlertContext);
  return methods;
}
