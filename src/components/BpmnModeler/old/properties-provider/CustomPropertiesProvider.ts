export default {
  __init__: ["customPropertiesProvider"],
  customPropertiesProvider: ["type", CustomPropertiesProvider]
};

function CustomPropertiesProvider(propertiesPanel: any) {

  this.getTabs = function (element: any) {

    // 🔥 CRITICAL: only show for Task elements
    if (!element.businessObject || element.type !== "bpmn:Task") {
      return [];
    }

    return [
      {
        id: "custom",
        label: "Custom",
        groups: [
          {
            id: "customProps",
            label: "Task Info",
            entries: [
              {
                id: "priority",
                label: "Priority",
                html: `<input type="text" id="priority" />`
              },
              {
                id: "owner",
                label: "Owner",
                html: `<input type="text" id="owner" />`
              }
            ]
          }
        ]
      }
    ];
  };

  propertiesPanel.registerProvider(this);
}
