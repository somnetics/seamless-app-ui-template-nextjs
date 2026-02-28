// import { Translate } from 'diagram-js/lib/i18n/translate'; // For localization
import CustomPropertiesProvider from './CustomPropertiesProvider';

export default {
  __init__: ['customPropertiesProvider'],
  customPropertiesProvider: ['type', CustomPropertiesProvider]
};