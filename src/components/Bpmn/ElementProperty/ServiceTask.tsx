import { ChangeEventHandler } from "react";
import Image from "next/image";
import Textbox from "@/components/Textbox";
import AutoSuggest from "@/components/AutoSuggest";

// render property panel
const PropertyPanel = ({
  property,
  setProperty,
  onChange,
  setOnClick,
  setDirty,
  readonly
}: {
  property: any,
  setProperty: Function,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>,
  setOnClick: Function,
  setDirty: Function,
  readonly: boolean
}) => {
  return (
    <>
      <div className="flex flex-col gap-1 col-span-12">
        <label htmlFor="assignee">Assignee</label>
        {/* <Textbox
          id="assignee"
          name="assignee"
          type="text"
          placeholder="Tom"
          value={property.assignee ?? ""}
          onChange={onChange}
          required={true}
        /> */}
        <AutoSuggest
          name="requestUrl"
          options={[
            { label: "One", value: "one" },
            { label: "Two", value: "two" },
            { label: "Three", value: "three" },
            { label: "Four", value: "four" },
          ]}
          multiple={false}
          // endpoint={formField.endpoint}
          // method={formField.method}
          // labelField={formField.labelField}
          // valueField={formField.valueField}
          render={(item, highlight, query) => {
            const onMouseOver = (e: any) => {
              console.log(e.target)
            }

            return (
              <div className="d-flex align-items-center pe-none" onMouseOver={onMouseOver}>
                <Image
                  className="pe-none"
                  src={`/images/icons/stack/${item.stack}.png`}
                  width={40}
                  height={40}
                  alt={item.stack}
                />
                <div className="d-flex flex-column ms-2 pe-none">
                  <p className="d-flex align-items-baseline pe-none">
                    <i className={`me-1 service-${item.health == "Running" ? "online" : "offline"}-sm pe-none`}></i>
                    {highlight(item.name, query)}
                  </p>
                  <small className="d-flex text-muted text-wrap align-items-center pe-none">
                    <span className={`rest-method ${item.method.toLowerCase()} me-1 pe-none`}>
                      {item.method}
                    </span>
                    {highlight(item.url.replace(/^\/|\/$/g, ""), query)}
                  </small>
                </div>
              </div>
            )
          }}
          onChange={onChange}
          value={property.requestUrl ?? ""}
        />
      </div>

      {/* <div className="flex flex-col gap-1 col-span-12">
        <label htmlFor="id">Candidate Users</label>
        <Textbox
          id="candidateUsers"
          name="candidateUsers"
          type="text"
          placeholder="Tom, Larry"
          value={property.candidateUsers ?? ""}
          onChange={onChange}
          required={true}
        />
      </div>

      <div className="flex flex-col gap-2 col-span-12">
        <label htmlFor="candidateGroups">Candidate Groups</label>
        <Textbox
          id="candidateGroups"
          name="candidateGroups"
          type="text"
          placeholder="HR, Accounts, Sales"
          value={property.candidateGroups}
          onChange={onChange}
          required={true}
        />
      </div> */}
    </>

    // <>
    //   <p className="fw-bold py-2 mb-3 bg-body bg-light-subtle border-top border-bottom">
    //     Assignment
    //   </p>
    //   <div className="col-12 mb-3">
    //     <label htmlFor="candidateUsers" className="form-label">
    //       Candidate Users
    //     </label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       id="candidateUsers"
    //       name="candidateUsers"
    //       value={property.candidateUsers ?? ""}
    //       onChange={onChange}
    //       readOnly={readonly}
    //       required
    //       placeholder="Tom, Larry"
    //     />
    //   </div>
    //   <div className="col-12 mb-3">
    //     <label htmlFor="candidateGroups" className="form-label">
    //       Candidate Groups
    //     </label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       id="candidateGroups"
    //       name="candidateGroups"
    //       value={property.candidateGroups ?? ""}
    //       onChange={onChange}
    //       readOnly={readonly}
    //       required
    //       placeholder="HR, Accounts, Sales"
    //     />
    //   </div>
    //   <p className="fw-bold py-2 mb-3 bg-body bg-light-subtle border-top border-bottom">
    //     Task Schedule
    //   </p>
    //   <div className="col-12">
    //     <label htmlFor="headers" className="form-label">
    //       Due Date
    //     </label>
    //     <div className="input-group mb-3">
    //       <span className="input-group-text px-2" tabIndex={-1}>
    //         <i className="material-symbols-rounded text-body-tertiary fs-6">
    //           equal
    //         </i>
    //       </span>
    //       <input
    //         type="text"
    //         className="form-control"
    //         id="headers"
    //         name="headers"
    //         value={property.headers ?? ""}
    //         onChange={onChange}
    //         readOnly={readonly}
    //         required
    //         placeholder='now() + duration("P7D")'
    //       />
    //     </div>
    //   </div>
    // </>
  )
}

// get element properties
const GetProperties = (elementProp: any, businessObject: any) => {
  // get element properties
  let properties = elementProp;

  // if businessObject
  if (businessObject) {
    // set form definition default value
    let formDefinition = "", assignmentDefinitions = { assignee: "", candidateUsers: "", candidateGroups: "" };

    // console.log(businessObject.documentation[0].text);

    if (businessObject.$attrs) {
      // set candidate users assignments
      assignmentDefinitions.assignee = businessObject.$attrs["flowable:assignee"] ?? "";
    }

    if (businessObject.documentation && businessObject.documentation[0]) {
      // set eleemnt description
      elementProp.description = businessObject.documentation[0].text ?? "";
    }

    console.log(businessObject.extensionElements.values);
    // console.log(businessObject.extensionElements.values[0].$children[0])

    // if extension elements exists
    if (businessObject.extensionElements !== "undefined") {
      // console.log(businessObject.extensionElements.values)
      // get zeebe form defination
      // formDefinition = businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:formdefinition");

      // // get zeebe assignment defination
      // const assignmentDefinition = businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:assignmentdefinition");

      // // set candidate users assignments
      // assignmentDefinitions.candidateUsers = assignmentDefinition[0].candidateUsers ?? "";

      // // set candidate groups assignments
      // assignmentDefinitions.candidateGroups = assignmentDefinition[0].candidateGroups ?? "";
    }

    // update property
    properties = {
      ...elementProp,
      // formDefinition: formDefinition,
      ...assignmentDefinitions
    };
  }

  // return element properties
  return properties;
}

// set element properties
const SetProperties = (elementObj: any, modeler: any, businessObject: any, property: any) => {
  // set bpmn modeling
  const modeling = modeler.get("modeling");

  // if sequence flow
  if (businessObject) {
    // io mapping
    const requestMethod = createModdleElement(modeler, "flowable:Field", { name: "requestMethod", string: "POST" }, businessObject);
    const requestUrl = createModdleElement(modeler, "flowable:Field", { name: "requestUrl", string: "http://localhost/abc" }, businessObject);


    //     <flowable:field name="requestHeaders">Content-Type: application/json</flowable:field>
    //     <flowable:field name="requestBody">{
    //   "num" : "${resp.num}",
    //   "mult" : "${resp.mult}"
    // }</flowable:field>

    //         <flowable:field name="requestBodyEncoding">UTF-8</flowable:field>
    //         <flowable:field name="requestTimeout">5000</flowable:field>
    //         <flowable:field name="disallowRedirects">true</flowable:field>
    //         <flowable:field name="failStatusCodes">4XX,5XX</flowable:field>
    //         <flowable:field name="handleStatusCodes">4XX,5XX</flowable:field>
    //         <flowable:field name="responseVariableName">resp</flowable:field>
    //         <flowable:field name="ignoreException">false</flowable:field>
    //         <flowable:field name="saveRequestVariables">true</flowable:field>
    //         <flowable:field name="saveResponseParameters">true</flowable:field>
    //         <flowable:field name="resultVariablePrefix">demo</flowable:field>
    //         <flowable:field name="saveResponseParametersTransient">false</flowable:field>
    //         <flowable:field name="saveResponseVariableAsJson">true</flowable:field>

    // from definition
    // const requestMethod = createModdleElement(modeler, "flowable:String", { $body: "HAPPY" }, flowableField);
    // const requestMethod = createModdleElement(modeler, "flowable:String", { body: "HAPPY" }, flowableField);

    // // assignment definition
    // const assignmentDefinition = flowObj?.createZeebeModdleElement("zeebe:AssignmentDefinition", { candidateUsers: property.candidateUsers, candidateGroups: property.candidateGroups }, businessObject);

    // // extension elements
    const extensionElements = createModdleElement(modeler, "bpmn:ExtensionElements", { values: [requestMethod, requestUrl] }, businessObject);

    // console.log(property)

    // update extension elements
    modeling.updateModdleProperties(elementObj, businessObject, { extensionElements });

    // const exprElement = moddle.create('flowable:Expression');
    // exprElement.$body = '${someExpressionHere}';

    // const fieldElement = moddle.create('flowable:Field', { name: 'requestMethod' });
    // fieldElement.expression = exprElement;  // instead of .string


    // modeler.updateModdleProperties(elementObj, businessObject, { "flowable:assignee": property.assignee });
  }
}

// create moddle element
const createModdleElement = (modeler: any, elementType: string, properties: any, parent: any) => {
  // get bpmn moddle
  const moddle = modeler.get("moddle");

  // create bpmn moddle
  const element = moddle.create(elementType, properties);

  // get element
  parent && (element.$parent = parent);

  // return element
  return element;
}

// export components
export default {
  PropertyPanel: PropertyPanel,
  GetProperties: GetProperties,
  SetProperties: SetProperties
}