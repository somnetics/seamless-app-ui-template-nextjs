import React, { useCallback, useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';

import EventBus from "diagram-js/lib/core/EventBus";
import zoomScroll from "diagram-js/lib/core";


const ElementTemplates = require("./element-templates.json");
const ElementIcon = require("./element-icon-renderer");
// import bpmn element property panel
import PropertyPanel, { GetProperties, SetProperties } from "@/components/Bpmn/PropertyPanel";

import flowableModdle from './flowable.json';

import style from "./Modeler.module.css";
import { debounce } from '@/libs/functions';

// export element property type
export type ElementProperty = {
  id?: string;
  type?: string;
  $type?: string;
  template?: string;
  description?: string;
  icon?: string;
  name?: string | undefined;
}

// const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
//   <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//     xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
//     xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
//     xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
//     id="Definitions_1"
//     targetNamespace="http://bpmn.io/schema/bpmn">
//     <bpmn:process id="Process_1" name="Untitled" isExecutable="true">
//       <bpmn:startEvent id="StartEvent_1" />
//     </bpmn:process>
//     <bpmndi:BPMNDiagram id="BPMNDiagram_1">
//       <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
//         <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
//           <dc:Bounds x="182" y="162" width="36" height="36" />
//         </bpmndi:BPMNShape>
//       </bpmndi:BPMNPlane>
//     </bpmndi:BPMNDiagram>
//   </bpmn:definitions>`;

const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef" exporter="Flowable Open Source Modeler" exporterVersion="6.8.0">
  <process id="demo" name="demo" isExecutable="true">
    <documentation>demo</documentation>
    <startEvent id="workflow-start" name="workflow start" flowable:initiator="\${init_user}\" flowable:formKey="initiator-form" flowable:formFieldValidation="true">
      <documentation>start of workflow</documentation>
    </startEvent>
    <serviceTask id="demo-task-1" name="demo task" flowable:async="true" flowable:parallelInSameTransaction="true" flowable:type="http" flowable:skipExpression="false">
      <documentation>demo task for exploration</documentation>
      <extensionElements>
        <flowable:field name="requestMethod">
          <flowable:string><![CDATA[POST]]></flowable:string>
        </flowable:field>
        <flowable:field name="requestUrl">
          <flowable:string><![CDATA[http://172.30.10.27:8090/api/demo]]></flowable:string>
        </flowable:field>
        <flowable:field name="requestHeaders">
          <flowable:string><![CDATA[Content-Type: application/json
Csrf-Token: abcdefg-1234]]></flowable:string>
        </flowable:field>
        <flowable:field name="requestBody">
          <flowable:expression><![CDATA[{
  "num" : "\${resp.num}\",
  "mult" : "\${resp.mult}\"
}]]></flowable:expression>
        </flowable:field>
        <flowable:field name="requestBodyEncoding">
          <flowable:string><![CDATA[UTF-8]]></flowable:string>
        </flowable:field>
        <flowable:field name="requestTimeout">
          <flowable:string><![CDATA[5000]]></flowable:string>
        </flowable:field>
        <flowable:field name="disallowRedirects">
          <flowable:string><![CDATA[true]]></flowable:string>
        </flowable:field>
        <flowable:field name="failStatusCodes">
          <flowable:string><![CDATA[4XX,5XX]]></flowable:string>
        </flowable:field>
        <flowable:field name="handleStatusCodes">
          <flowable:string><![CDATA[4XX,5XX]]></flowable:string>
        </flowable:field>
        <flowable:field name="responseVariableName">
          <flowable:string><![CDATA[resp]]></flowable:string>
        </flowable:field>
        <flowable:field name="ignoreException">
          <flowable:string><![CDATA[false]]></flowable:string>
        </flowable:field>
        <flowable:field name="saveRequestVariables">
          <flowable:string><![CDATA[true]]></flowable:string>
        </flowable:field>
        <flowable:field name="saveResponseParameters">
          <flowable:string><![CDATA[true]]></flowable:string>
        </flowable:field>
        <flowable:field name="resultVariablePrefix">
          <flowable:string><![CDATA[demo]]></flowable:string>
        </flowable:field>
        <flowable:field name="saveResponseParametersTransient">
          <flowable:string><![CDATA[false]]></flowable:string>
        </flowable:field>
        <flowable:field name="saveResponseVariableAsJson">
          <flowable:string><![CDATA[true]]></flowable:string>
        </flowable:field>
      </extensionElements>
    </serviceTask>
    <sequenceFlow id="sid-E70A3A6E-2715-43E2-AB64-F4F3F117973B" sourceRef="workflow-start" targetRef="demo-task-1"></sequenceFlow>
    <userTask id="demo-user-task-1" name="demo user task" flowable:async="true" flowable:assignee="manager" flowable:candidateUsers="cand1,cand2" flowable:candidateGroups="group1,group2" flowable:dueDate="2026-02-05T18:30:00" flowable:formKey="demo-user-form" flowable:formFieldValidation="true" flowable:priority="high" flowable:skipExpression="false" flowable:taskIdVariableName="userID">
      <documentation>demo user task for exploration</documentation>
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[true]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <sequenceFlow id="sid-9FFD9ED2-4FE7-4C8B-BFB6-5F67087DF77D" sourceRef="demo-task-1" targetRef="demo-user-task-1"></sequenceFlow>
    <endEvent id="workflow-stop" name="workflow stop">
      <documentation>normal workflow stop</documentation>
    </endEvent>
    <sequenceFlow id="sid-DD2C34A4-3217-4887-A368-9EFE359C140D" sourceRef="demo-user-task-1" targetRef="workflow-stop"></sequenceFlow>
    <boundaryEvent id="demo-boundary-event-1" name="demo boundary event" attachedToRef="demo-task-1">
      <documentation>demo boundary event for demonstration</documentation>
      <errorEventDefinition errorRef="demoTaskError" flowable:errorVariableName="errorCode" flowable:errorVariableLocalScope="true" flowable:errorVariableTransient="true"></errorEventDefinition>
    </boundaryEvent>
    <endEvent id="error-stop" name="error stop">
      <documentation>error worflow stop</documentation>
    </endEvent>
    <sequenceFlow id="sid-08C854A1-FC8F-44FF-80DA-666E2FAE85B9" sourceRef="demo-boundary-event-1" targetRef="error-stop"></sequenceFlow>
    <boundaryEvent id="demo-timer-event-1" name="demo timer event" attachedToRef="demo-user-task-1" cancelActivity="true">
      <documentation>demo timer event for exploration</documentation>
      <timerEventDefinition>
        <timeDate>2026-02-05T18:30:00</timeDate>
      </timerEventDefinition>
    </boundaryEvent>
    <endEvent id="time-out-stop" name="time out stop">
      <documentation>stop event when user task timesout</documentation>
    </endEvent>
    <sequenceFlow id="sid-BDBDBD7B-2E36-4E7D-B84A-40D4E2373441" sourceRef="demo-timer-event-1" targetRef="time-out-stop"></sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_demo">
    <bpmndi:BPMNPlane bpmnElement="demo" id="BPMNPlane_demo">
      <bpmndi:BPMNShape bpmnElement="workflow-start" id="BPMNShape_workflow-start">
        <omgdc:Bounds height="30.0" width="30.0" x="100.0" y="163.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-task-1" id="BPMNShape_demo-task-1">
        <omgdc:Bounds height="80.0" width="99.99999999999997" x="180.0000067055228" y="138.0000051409008"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-user-task-1" id="BPMNShape_demo-user-task-1">
        <omgdc:Bounds height="80.0" width="100.0" x="325.00000670552276" y="138.0000051409008"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="workflow-stop" id="BPMNShape_workflow-stop">
        <omgdc:Bounds height="28.0" width="28.0" x="470.00000670552276" y="164.0000051409008"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-boundary-event-1" id="BPMNShape_demo-boundary-event-1">
        <omgdc:Bounds height="30.0" width="30.0" x="249.98622699526368" y="203.3687448859931"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="error-stop" id="BPMNShape_error-stop">
        <omgdc:Bounds height="27.99999999999997" width="28.0" x="300.0000111758713" y="255.00001899898157"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-timer-event-1" id="BPMNShape_demo-timer-event-1">
        <omgdc:Bounds height="31.0" width="31.0" x="395.1970207083614" y="202.95664209282782"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="time-out-stop" id="BPMNShape_time-out-stop">
        <omgdc:Bounds height="28.0" width="28.0" x="471.1970207083614" y="204.45664209282782"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="sid-BDBDBD7B-2E36-4E7D-B84A-40D4E2373441" id="BPMNEdge_sid-BDBDBD7B-2E36-4E7D-B84A-40D4E2373441" flowable:sourceDockerX="16.0" flowable:sourceDockerY="16.0" flowable:targetDockerX="14.0" flowable:targetDockerY="14.000000000000002">
        <omgdi:waypoint x="427.1466642196377" y="218.84853640097722"></omgdi:waypoint>
        <omgdi:waypoint x="471.19733115251586" y="218.55089683510408"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-E70A3A6E-2715-43E2-AB64-F4F3F117973B" id="BPMNEdge_sid-E70A3A6E-2715-43E2-AB64-F4F3F117973B" flowable:sourceDockerX="15.0" flowable:sourceDockerY="15.0" flowable:targetDockerX="49.999999999999986" flowable:targetDockerY="40.0">
        <omgdi:waypoint x="129.94999861807142" y="178.00000066831706"></omgdi:waypoint>
        <omgdi:waypoint x="180.00000636085238" y="178.00000290572666"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-DD2C34A4-3217-4887-A368-9EFE359C140D" id="BPMNEdge_sid-DD2C34A4-3217-4887-A368-9EFE359C140D" flowable:sourceDockerX="50.0" flowable:sourceDockerY="40.0" flowable:targetDockerX="14.0" flowable:targetDockerY="14.0">
        <omgdi:waypoint x="424.9500067055188" y="178.0000051409008"></omgdi:waypoint>
        <omgdi:waypoint x="470.00000670552276" y="178.0000051409008"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-08C854A1-FC8F-44FF-80DA-666E2FAE85B9" id="BPMNEdge_sid-08C854A1-FC8F-44FF-80DA-666E2FAE85B9" flowable:sourceDockerX="15.0" flowable:sourceDockerY="15.0" flowable:targetDockerX="14.0" flowable:targetDockerY="13.999999999999986">
        <omgdi:waypoint x="264.9862269952637" y="233.3187377661465"></omgdi:waypoint>
        <omgdi:waypoint x="264.9862269952637" y="269.00001899898155"></omgdi:waypoint>
        <omgdi:waypoint x="300.0000111758713" y="269.00001899898155"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-9FFD9ED2-4FE7-4C8B-BFB6-5F67087DF77D" id="BPMNEdge_sid-9FFD9ED2-4FE7-4C8B-BFB6-5F67087DF77D" flowable:sourceDockerX="49.999999999999986" flowable:sourceDockerY="40.0" flowable:targetDockerX="50.0" flowable:targetDockerY="40.0">
        <omgdi:waypoint x="279.950006705431" y="178.0000051409008"></omgdi:waypoint>
        <omgdi:waypoint x="325.00000670550344" y="178.0000051409008"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

export default function BpmnModelerViewer({ theme }: { theme: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler>(null);

  const moddleRef = useRef<any>(null);
  const modelingRef = useRef<any>(null);
  const elementRegistryRef = useRef<any>(null);

  const [serviceElements, setServiceElements] = useState<any>();
  const [elementId, setElementId] = useState<string>();
  const [processId, setProcessId] = useState<string>();
  const [property, setProperty] = useState<any>();
  const [importXML, setImportXML] = useState<string>();
  const [initialData, setInitialData] = useState<any>();
  const [isDirty, setDirty] = useState<boolean>(false);
  const [onClick, setOnClick] = useState<boolean>(false);
  const [services, setServices] = useState<any>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deploying, setDeploying] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [readonly, setReadonly] = useState<boolean>(false);
  const [currentPanel, setCurrentPanel] = useState<string>();
  const [revisions, setRevisions] = useState<any>([]);
  const [flowData, setFlowData] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [updateStatus, setUpdateStatus] = useState<any>({ show: false, timestamp: "", });
  const [browseFile, setBrowseFile] = useState<HTMLElement>();

  const initModeler = async () => {
    if (!containerRef.current) return;

    // init new modeler
    const modeler = new BpmnModeler({
      container: containerRef.current,
      bpmnRenderer: { defaultFillColor: theme === "light" ? "#ffffff" : "#101828", defaultStrokeColor: theme === "light" ? "#525252" : "#c6c6c6" },
      moddleExtensions: {
        custom: flowableModdle
      },
    });

    // set bpmn moddle
    moddleRef.current = modeler.get("moddle");

    // set bpmn modeling
    modelingRef.current = modeler.get("modeling");

    // set bpmn element registry
    elementRegistryRef.current = modeler.get("elementRegistry");

    // get event bus
    const eventBus: EventBus = modeler.get("eventBus");

    // element on  click
    eventBus.on("element.click", (e: any) => {
      // set on click
      setOnClick(true);

      // hide template replacer
      hideTemplateReplacer();

      // console.log(e.element.businessObject);

      // get element type
      const elementType: any = getElementType(e.element.businessObject);

      // get element property
      let elementProp: ElementProperty = {
        id: e.element.businessObject.id,
        type: elementType.name,
        $type: e.element.businessObject.$type,
        template: elementType.template,
        description: elementType.description,
        icon: getElementIcon(e.element.businessObject),
        name: e.element.businessObject.name || "",
      };

      // console.log(elementProp);

      // set element object
      setElementId(elementProp.id);

      // set current panel
      setCurrentPanel("Property");

      // get sequence flow properties        
      elementProp = GetProperties(elementProp, e.element.businessObject);

      // set element property
      setProperty(elementProp);
    });

    // element on change
    eventBus.on("element.changed", async (e: any) => {
      // set dirty
      setDirty(true);

      // set on click
      setOnClick(false);

      // if service task
      if (e.element.businessObject.$type === "bpmn:ServiceTask") {
        // set service elements
        setServiceElements(elementRegistryRef.current.filter((element: any) => element.type == "bpmn:Task" || element.type == "bpmn:ServiceTask"));
      }
    });

    // on key down
    eventBus.on("keyboard.keydown", (event: any) => {
      console.log("Key pressed:", event);
    });

    try {
      // import xml
      const { warnings } = await modeler.importXML(flowData.xml);

      // Initialize the modeler
      modelerRef.current = modeler;
    } catch (err) {
      console.error('Error importing XML', err);
    }
  }

  // update property
  const updateProperty = useCallback(
    debounce(async (property: any, callback: Function) => {
      // callback with results
      if (typeof callback === "function") callback(property);
    }, 500), []
  );

  // hide template replacer
  function hideTemplateReplacer() {
    // get replacer element
    const replacer = document.querySelector(".djs-popup.bpmn-element-list") as HTMLElement;

    // remove replacer element
    if (replacer) replacer.remove();
  }

  const getElementIcon = (businessObject: any) => {
    // get zeebe template icon
    const icon = businessObject.get("zeebe:modelerTemplateIcon");

    // icon exists
    if (icon) {
      // return img icon
      return React.createElement("img", {
        className: "bio-properties-panel-header-template-icon",
        width: "32",
        height: "32",
        src: icon
      })
    } else {
      // return svg icon
      return ElementIcon.iconsByType[businessObject.$type.replace("bpmn:", "")]({ fill: theme === "light" ? "#525252" : "#c6c6c6" });
    }
  }

  const getElementType = (businessObject: any) => {
    // define default type
    let name = businessObject.$type;

    // define default description
    let description = businessObject.$type;

    // get zeebe template
    const template = businessObject.get("zeebe:modelerTemplate");

    // zeebe template exists
    if (template) {
      // check template type
      switch (template) {
        case "io.camunda.connectors.HttpJson.v2":
          name = "REST Outbound Connector";
          description = "Invoke REST API";
          break;

        case "io.camunda.connectors.inbound.RabbitMQ.MessageStart.v1":
          name = "RabbitMQ Message Start Event Connector";
          description = "Receive a message from RabbitMQ";
          break;

        case "io.camunda.connectors.RabbitMQ.v1":
          name = "RabbitMQ Outbound Connector"
          description = "Send message to RabbitMQ";
          break;

        default:
          name = template;
          description = "";
          break;
      }

      // return template type
      return { template: template, name: name, description: description };
    } else {
      // check element type
      switch (name) {
        default:
          name = name.replace("bpmn:", "").replace(/([A-Z])/g, ' $1').trim();
          description = "";
          break;
      }

      // return template type
      return { template: businessObject.$type, name: name, description: description };
    }
  }

  // toogle theme
  async function toogleTheme() {
    // if flow data is defined
    if (typeof flowData !== "undefined") {
      // if modeler exists detach modeler
      if (typeof modelerRef.current !== "undefined") {
        // get result
        const result = await modelerRef.current?.saveXML({ format: true });

        // if modeler is loaded with xml
        if (typeof result !== "undefined") {
          // set data
          setFlowData((prevState: any) => ({
            ...prevState,
            xml: result.xml,
          }));
        }

        // detach modeler
        modelerRef.current?.detach();
      }
    }
  }

  // on property change
  const onChange = (e: any) => {
    e.preventDefault();

    // set dirty
    setDirty(true);

    // set on click
    setOnClick(false);

    // get element
    const { name, value } = e.target;

    // set data
    setProperty((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    // if property not undefined
    if (typeof property !== "undefined" && isDirty && !onClick) {
      // update property
      updateProperty(property, async (property: any) => {
        try {
          // get flow element
          const elementObj = elementRegistryRef.current.get(elementId);

          // get business object
          const businessObject = elementObj.businessObject;

          // update properties
          SetProperties(elementObj, modelerRef.current, businessObject, property);

          // // create documentation
          // const documentation = flowObj?.createModdleElement("bpmn:Documentation", { values: [{ test: "ssd" }] }, businessObject);

          // // update element properties
          // flowObj?.modeling.updateModdleProperties(elementObj, businessObject, { documentation });

          // set element property
          const elementProp: ElementProperty = {
            name: property.name || ""
          };

          // set element property
          // setProperty((prevProps: any) => ({
          //   ...prevProps,
          //   icon: props.icon
          // }));

          // update element properties
          modelingRef.current.updateProperties(elementObj, elementProp);

          // save flow date
          // saveData(flowObj);
        } catch (e: any) {
          // on error
          console.log(e.message);
        }
      });
    }
  }, [property]);

  useEffect(() => {
    if (typeof flowData !== "undefined") {
      // if theme
      initModeler();
    }
  }, [flowData]);

  useEffect(() => {
    // if theme
    if (typeof theme !== "undefined") {
      // toogle theme
      toogleTheme();
    }
  }, [theme]);

  useEffect(() => {
    // initModeler();
    setFlowData((prevState: any) => ({
      ...prevState,
      xml: DEFAULT_XML,
    }));
  }, []);

  const handleSave = async () => {
    try {
      if (modelerRef.current) {
        const { xml } = await modelerRef.current.saveXML({ format: true });

        if (!xml) return;

        // get form data
        // const formData = new FormData();

        // formData.append("filename", "test.bpmn");
        // formData.append("bpmn_file_string", xml);

        console.log(xml)

        // return false;

        // call api
        const response = await fetch("/flowable/process-definitions/deploy/string", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(formData),
          // body: formData,
          body: JSON.stringify({
            "filename": "test.bpmn",
            // "bpmn_file_string": btoa(xml),
            "bpmn_file_string": xml,
          })
        });

        if (response.status === 500) {
          throw new Error('500 Internal Server Error');
        } else {
          // get response data
          const data = await response.json();

          console.log(data);
        }
      }
    } catch (err) {
      console.error('Error saving BPMN XML:', err);
    }
  };

  // on export flow
  async function exportFlow(e: any) {
    e.preventDefault();

    // modeler save to xml
    try {
      if (!modelerRef.current) return;

      // get result
      const result = await modelerRef.current.saveXML({ format: true });

      if (result.xml) {
        // Create a Blob object
        const blob = new Blob([result.xml], { type: "application/bpmn20-xml" });

        // Generate a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${"test"}.bpmn`;

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up the ObjectURL
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      // return error
      console.error("could not save BPMN 2.0 diagram", err);
    }
  }

  return (
    <div className="flex">
      <div
        ref={containerRef}
        style={{ width: '100%', height: 'calc(100vh - 97px)', outline: "none" }}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={exportFlow}>Export</button>
      {currentPanel == "Property" ?
        <div className={style.propertyPanel}>
          {typeof property !== "undefined" ?
            <PropertyPanel
              property={property}
              setProperty={setProperty}
              onChange={onChange}
              setOnClick={setOnClick}
              setDirty={setDirty}
              readonly={readonly}
              theme={theme}
            />
            : ""}
        </div>
        : currentPanel == "Revisions" ?
          <div className={style.revisions + " border-start modal-content"}>
            {/* <SimpleBar autoHide={true} style={{ height: "calc(100vh - 152px)" }}> */}
            <div className="container py-3">
              <ol className="list-group list-group-numbered">
                {revisions.map((revision: any, key: number) =>
                  <li key={key} className="list-group-item d-flex justify-content-between align-items-start border mb-2">
                    <span className="badge text-bg-primary rounded-pill">{revision.version}</span>
                  </li>
                )}
              </ol>
            </div>
            {/* </SimpleBar> */}
          </div>
          : ""}
    </div>
  );
}
