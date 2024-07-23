import React from 'react';
import BottomSheetInputContext, { BottomSheetInputContextData } from '../BoxInput';

export default function useBottomSheetInput(): BottomSheetInputContextData {
  const methods = React.useContext(BottomSheetInputContext);
  return methods;
}
