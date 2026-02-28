// import { Translate } from 'diagram-js/lib/i18n/translate';
import customProps from './CustomProps'; // We'll create this next

export default function createCustomGroup(element: any) {
  return {
    id: 'custom',
    label: 'Custom Properties',
    entries: customProps(element)
  };
}