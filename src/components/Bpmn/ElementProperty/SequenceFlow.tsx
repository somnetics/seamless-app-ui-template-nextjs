import { ChangeEventHandler } from "react";

// render property panel
const PropertyPanel = ({
  property,
  onChange,
  readonly
}: {
  property: any,
  onChange: ChangeEventHandler<HTMLInputElement>,
  readonly: boolean
}) => {
  return (
    <div className="col-12 mb-3">
      <label htmlFor="conditionExpression" className="form-label">
        Condition Expression
      </label>
      <div className="input-group mb-3">
        <span className="input-group-text px-2" tabIndex={-1}>
          <i className="material-symbols-rounded text-body-tertiary fs-6">
            equal
          </i>
        </span>
        <input
          type="text"
          className="form-control"
          id="conditionExpression"
          name="conditionExpression"
          value={property.conditionExpression ?? ""}
          onChange={onChange}
          readOnly={readonly}
          required
          placeholder="body.value = value"
        />
      </div>
    </div>
  )
}

// get element properties
const GetProperties = (elementProp: any, businessObject: any) => {
  // get element properties
  let properties = elementProp;

  // if businessObject
  if (typeof businessObject !== "undefined" && typeof businessObject.conditionExpression !== "undefined" && businessObject.conditionExpression.body.trim() !== "") {
    // get condition values
    const conditionValue: any = { conditionExpression: businessObject.conditionExpression.body.substring(1) };

    // update property
    properties = {
      ...elementProp,
      ...conditionValue,
    };
  }

  // return element properties
  return properties;
}

// set element properties
const SetProperties = (elementObj: any, flowObj: any, businessObject: any, property: any) => {
  // check if not blank
  if (typeof businessObject !== "undefined" && typeof property.conditionExpression !== "undefined" && property.conditionExpression.trim() !== "") {
    // create condition expression
    const conditionExpression = flowObj?.createModdleElement("bpmn:FormalExpression", { body: `=${property.conditionExpression}` }, businessObject);

    // update element properties
    flowObj?.modeling.updateModdleProperties(elementObj, businessObject, { conditionExpression: conditionExpression });
  } else {
    // update element properties
    flowObj?.modeling.updateModdleProperties(elementObj, businessObject, { conditionExpression: undefined });
  }
}

// export components
export default {
  PropertyPanel: PropertyPanel,
  GetProperties: GetProperties,
  SetProperties: SetProperties
}