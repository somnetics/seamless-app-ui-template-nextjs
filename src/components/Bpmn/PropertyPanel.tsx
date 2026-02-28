import React, { ChangeEventHandler } from "react";
// import SimpleBar from "simplebar-react";
// import ElementIcon from "./element-icon-renderer";
const ElementIcon = require("./element-icon-renderer");

// import bpmn element properties
import SequenceFlow from "@/components/Bpmn/ElementProperty/SequenceFlow";
import RestOutboundConnector from "@/components/Bpmn/ElementProperty/RestOutboundConnector";
import RabbitMQMessageStartEventConnector from "@/components/Bpmn/ElementProperty/RabbitMQMessageStartEventConnector";
import UserTask from "@/components/Bpmn/ElementProperty/UserTask";
import ServiceTask from "@/components/Bpmn/ElementProperty/ServiceTask";

import Textbox from "@/components/Textbox";

export default function PropertyPanel({
  property,
  setProperty,
  onChange,
  setOnClick,
  setDirty,
  readonly,
  theme
}: {
  property: any,
  setProperty: Function,
  onChange: ChangeEventHandler<HTMLInputElement>,
  setOnClick: Function,
  setDirty: Function,
  readonly: boolean,
  theme: string
}) {
  // get element icon
  const getElementIcon = (theme: string, $type: string) => {
    // return svg icon
    return ElementIcon.iconsByType[$type.replace("bpmn:", "")]({ fill: theme === "light" ? "#525252" : "#c6c6c6" });
  }

  return (
    <>
      <div className="properties-header">
        <span>
          {getElementIcon(theme, property.$type)}
        </span>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-semibold leading-none">{property.type}</h5>
          <p className="text-xs leading-none">{property.description || property.$type}</p>
        </div>
      </div>
      {/* <SimpleBar autoHide={true} style={{ height: "calc(100vh - 147px)" }}> */}
      <div className="grid grid-cols-12 space-y-4 p-3">
        <div className="flex flex-col gap-1 col-span-12">
          <label htmlFor="id">Id</label>
          <Textbox
            id="id"
            name="id"
            type="text"
            placeholder="Enter Element Id"
            value={property.id}
            onChange={onChange}
            required={true}
          />
        </div>

        <div className="flex flex-col gap-2 col-span-12">
          <label htmlFor="name">Name</label>
          <Textbox
            id="name"
            name="name"
            type="text"
            placeholder="Enter Element Name"
            value={property.name}
            onChange={onChange}
            required={true}
          />
        </div>

        {property.template === "bpmn:SequenceFlow" ?
          <SequenceFlow.PropertyPanel
            property={property}
            onChange={onChange}
            readonly={readonly}
          />
          : ""}

        {property.template === "io.camunda.connectors.HttpJson.v2" ?
          <RestOutboundConnector.PropertyPanel
            property={property}
            setProperty={setProperty}
            onChange={onChange}
            setOnClick={setOnClick}
            setDirty={setDirty}
            readonly={readonly}
          />
          : ""}

        {property.template === "io.camunda.connectors.inbound.RabbitMQ.MessageStart.v1" ?
          <RabbitMQMessageStartEventConnector.PropertyPanel
            property={property}
            setProperty={setProperty}
            onChange={onChange}
            setOnClick={setOnClick}
            setDirty={setDirty}
            readonly={readonly}
          />
          : ""}

        {property.template === "bpmn:UserTask" &&
          <UserTask.PropertyPanel
            property={property}
            setProperty={setProperty}
            onChange={onChange}
            setOnClick={setOnClick}
            setDirty={setDirty}
            readonly={readonly}
          />
        }

        {property.template === "bpmn:ServiceTask" &&
          <ServiceTask.PropertyPanel
            property={property}
            setProperty={setProperty}
            onChange={onChange}
            setOnClick={setOnClick}
            setDirty={setDirty}
            readonly={readonly}
          />
        }
      </div>
      {/* </SimpleBar> */}
    </>
  )
}

// get element properties
export function GetProperties(elementProp: any, businessObject: any) {
  // get element properties
  let properties = elementProp;

  // check element template
  if (elementProp.template === "bpmn:SequenceFlow") {
    // get properties
    properties = SequenceFlow.GetProperties(elementProp, businessObject);
  } else if (elementProp.template === "io.camunda.connectors.HttpJson.v2") {
    // get properties
    properties = RestOutboundConnector.GetProperties(elementProp, businessObject);
  } else if (elementProp.template === "io.camunda.connectors.inbound.RabbitMQ.MessageStart.v1") {
    // get properties
    properties = RabbitMQMessageStartEventConnector.GetProperties(elementProp, businessObject);
  } else if (elementProp.template === "bpmn:UserTask") {
    // get properties
    properties = UserTask.GetProperties(elementProp, businessObject);
  } else if (elementProp.template === "bpmn:ServiceTask") {
    // get properties
    properties = ServiceTask.GetProperties(elementProp, businessObject);
  }

  // return element properties
  return properties;
}

// set element properties
export function SetProperties(elementObj: any, flowObj: any, businessObject: any, property: any) {
  // check element template
  if (property.template == "bpmn:SequenceFlow") {
    // set properties
    SequenceFlow.SetProperties(elementObj, flowObj, businessObject, property);
  } else if (property.template === "io.camunda.connectors.HttpJson.v2") {
    // set properties
    RestOutboundConnector.SetProperties(elementObj, flowObj, businessObject, property);
  } else if (property.template === "io.camunda.connectors.inbound.RabbitMQ.MessageStart.v1") {
    // set properties
    RabbitMQMessageStartEventConnector.SetProperties(elementObj, flowObj, businessObject, property);
  } else if (property.template === "bpmn:UserTask") {
    // set properties
    UserTask.SetProperties(elementObj, flowObj, businessObject, property);
  } else if (property.template === "bpmn:ServiceTask") {
    // set properties
    ServiceTask.SetProperties(elementObj, flowObj, businessObject, property);
  }
}