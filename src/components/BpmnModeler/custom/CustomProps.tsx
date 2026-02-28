import { h } from 'preact'; // Required for JSX in Preact-style components
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'; // Hook for services like modeling

export default function customProps(element: any) {
  return [
    {
      id: 'myCustomProp',
      element,
      component: CustomPropEntry,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function CustomPropEntry(props: { element: any; id: string }) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.get('custom:myCustomProp') || '';
  };

  const setValue = (value: string) => {
    modeling.updateProperties(element, {
      'custom:myCustomProp': value
    });
  };

  return (
    <TextFieldEntry
      id={id}
      element={element}
      label={translate('My Custom Prop')}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}