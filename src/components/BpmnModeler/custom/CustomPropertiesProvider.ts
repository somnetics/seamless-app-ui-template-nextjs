import { is } from 'bpmn-js/lib/util/ModelUtil'; // Utility to check element types
// import { LOW_PRIORITY } from 'bpmn-js-properties-panel'; // Use low priority to load after defaults
import createCustomGroup from './CustomGroup'; // We'll create this next
// import { Translate } from 'diagram-js/lib/i18n/translate'; // For localization

export default class CustomPropertiesProvider {
  static $inject = ['propertiesPanel', 'translate'];

  constructor(propertiesPanel: any, translate: any) {
    propertiesPanel.registerProvider(500, this);
  }

  getGroups(element: any) {
    return (groups: any[]) => {
      if (is(element, 'bpmn:Task')) {
        groups.push(createCustomGroup(element));
      }
      return groups;
    };
  }
}