// src/properties-provider/SeamlessPropsProvider.js
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

export default function SeamlessPropsProvider(propertiesPanel, translate) {
  return [
    {
      id: 'seamless-priority',
      element: (element) => element.businessObject.$type === 'bpmn:Task',
      component: PriorityEntry,
      isEdited: isTextFieldEntryEdited
    }
  ];

  function PriorityEntry(props) {
    const { element } = props;
    const bo = element.businessObject;

    const value = bo.get('seamless:priority') || '';

    const setValue = (val) => {
      const modeling = window.modeler.get('modeling');
      modeling.updateProperties(element, { 'seamless:priority': val });
    };

    return TextFieldEntry({
      id: 'seamless-priority',
      element,
      label: 'Priority',
      getValue: () => value,
      setValue
    });
  }
}
