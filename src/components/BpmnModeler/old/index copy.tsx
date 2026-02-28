import React, { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';

import EventBus from "diagram-js/lib/core/EventBus";
import zoomScroll from "diagram-js/lib/core";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

// import seamlessModdle from '@/components/BpmnModeler/Moddle/seamless-moddle.json';
// import seamlessPropsProvider from './old/properties-provider/SeamlessPropsProvider';
// import propertiesProviderModule from './old/properties-provider/CustomPropertiesProvider';

import customModdleDescriptor from './moddle/custom.json'; // Your moddle JSON
import customPropertiesProviderModule from './custom'; // Your custom provider

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
    <startEvent id="startEvent1" flowable:formFieldValidation="true"></startEvent>
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
    <sequenceFlow id="sid-E70A3A6E-2715-43E2-AB64-F4F3F117973B" sourceRef="startEvent1" targetRef="demo-task-1"></sequenceFlow>
    <userTask id="demo-user-task-1" name="demo user task" flowable:async="true" flowable:assignee="manager" flowable:dueDate="2026-02-05T18:30:00" flowable:formKey="demo-user-form" flowable:formFieldValidation="true" flowable:priority="high" flowable:skipExpression="false" flowable:taskIdVariableName="userID">
      <documentation>demo user task for exploration</documentation>
      <extensionElements>
        <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[false]]></modeler:initiator-can-complete>
      </extensionElements>
    </userTask>
    <sequenceFlow id="sid-9FFD9ED2-4FE7-4C8B-BFB6-5F67087DF77D" sourceRef="demo-task-1" targetRef="demo-user-task-1"></sequenceFlow>
    <endEvent id="sid-7E9EFF8E-7AE2-49F6-8651-CA41D29C769D"></endEvent>
    <sequenceFlow id="sid-DD2C34A4-3217-4887-A368-9EFE359C140D" sourceRef="demo-user-task-1" targetRef="sid-7E9EFF8E-7AE2-49F6-8651-CA41D29C769D"></sequenceFlow>
    <boundaryEvent id="demo-boundary-event-1" name="demo boundary event" attachedToRef="demo-task-1">
      <documentation>demo boundary event for demonstration</documentation>
      <errorEventDefinition errorRef="demoTaskError" flowable:errorVariableName="errorCode" flowable:errorVariableLocalScope="true" flowable:errorVariableTransient="true"></errorEventDefinition>
    </boundaryEvent>
    <endEvent id="sid-E3BCF52B-02AF-4945-B9E1-FCB184BADAB5"></endEvent>
    <sequenceFlow id="sid-08C854A1-FC8F-44FF-80DA-666E2FAE85B9" sourceRef="demo-boundary-event-1" targetRef="sid-E3BCF52B-02AF-4945-B9E1-FCB184BADAB5"></sequenceFlow>
    <boundaryEvent id="demo-timer-event-1" name="demo timer event" attachedToRef="demo-user-task-1" cancelActivity="true">
      <documentation>demo timer event for exploration</documentation>
      <timerEventDefinition>
        <timeDate>2026-02-05T18:30:00</timeDate>
      </timerEventDefinition>
    </boundaryEvent>
    <endEvent id="sid-D3CF759E-8386-4532-8461-1ACB77A8A164"></endEvent>
    <sequenceFlow id="sid-BDBDBD7B-2E36-4E7D-B84A-40D4E2373441" sourceRef="demo-timer-event-1" targetRef="sid-D3CF759E-8386-4532-8461-1ACB77A8A164"></sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_demo">
    <bpmndi:BPMNPlane bpmnElement="demo" id="BPMNPlane_demo">
      <bpmndi:BPMNShape bpmnElement="startEvent1" id="BPMNShape_startEvent1">
        <omgdc:Bounds height="30.0" width="30.0" x="100.0" y="163.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-task-1" id="BPMNShape_demo-task-1">
        <omgdc:Bounds height="80.0" width="99.99999999999997" x="180.0000067055228" y="138.0000051409008"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-user-task-1" id="BPMNShape_demo-user-task-1">
        <omgdc:Bounds height="80.0" width="100.0" x="325.00000670552276" y="138.0000051409008"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-7E9EFF8E-7AE2-49F6-8651-CA41D29C769D" id="BPMNShape_sid-7E9EFF8E-7AE2-49F6-8651-CA41D29C769D">
        <omgdc:Bounds height="28.0" width="28.0" x="470.00000670552276" y="164.0000051409008"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-boundary-event-1" id="BPMNShape_demo-boundary-event-1">
        <omgdc:Bounds height="30.0" width="30.0" x="249.98622699526368" y="203.3687448859931"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-E3BCF52B-02AF-4945-B9E1-FCB184BADAB5" id="BPMNShape_sid-E3BCF52B-02AF-4945-B9E1-FCB184BADAB5">
        <omgdc:Bounds height="27.99999999999997" width="28.0" x="300.0000111758713" y="255.00001899898157"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="demo-timer-event-1" id="BPMNShape_demo-timer-event-1">
        <omgdc:Bounds height="31.0" width="31.0" x="395.1970207083614" y="202.95664209282782"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-D3CF759E-8386-4532-8461-1ACB77A8A164" id="BPMNShape_sid-D3CF759E-8386-4532-8461-1ACB77A8A164">
        <omgdc:Bounds height="28.0" width="28.0" x="471.1970207083614" y="204.45664209282782"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="sid-BDBDBD7B-2E36-4E7D-B84A-40D4E2373441" id="BPMNEdge_sid-BDBDBD7B-2E36-4E7D-B84A-40D4E2373441">
        <omgdi:waypoint x="427.1466642196377" y="218.84853640097722"></omgdi:waypoint>
        <omgdi:waypoint x="471.19733115251586" y="218.55089683510408"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-E70A3A6E-2715-43E2-AB64-F4F3F117973B" id="BPMNEdge_sid-E70A3A6E-2715-43E2-AB64-F4F3F117973B">
        <omgdi:waypoint x="129.94999861807142" y="178.00000066831706"></omgdi:waypoint>
        <omgdi:waypoint x="180.00000636085238" y="178.00000290572666"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-DD2C34A4-3217-4887-A368-9EFE359C140D" id="BPMNEdge_sid-DD2C34A4-3217-4887-A368-9EFE359C140D">
        <omgdi:waypoint x="424.9500067055188" y="178.0000051409008"></omgdi:waypoint>
        <omgdi:waypoint x="470.00000670552276" y="178.0000051409008"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-08C854A1-FC8F-44FF-80DA-666E2FAE85B9" id="BPMNEdge_sid-08C854A1-FC8F-44FF-80DA-666E2FAE85B9">
        <omgdi:waypoint x="264.9862269952637" y="233.3187377661465"></omgdi:waypoint>
        <omgdi:waypoint x="264.9862269952637" y="269.00001899898155"></omgdi:waypoint>
        <omgdi:waypoint x="300.0000111758713" y="269.00001899898155"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-9FFD9ED2-4FE7-4C8B-BFB6-5F67087DF77D" id="BPMNEdge_sid-9FFD9ED2-4FE7-4C8B-BFB6-5F67087DF77D">
        <omgdi:waypoint x="279.950006705431" y="178.0000051409008"></omgdi:waypoint>
        <omgdi:waypoint x="325.00000670550344" y="178.0000051409008"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

export default function BpmnModelerComponent({ theme }: { theme: string | undefined }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler>(null);
  const [flowData, setFlowData] = useState<any>();

  const initModeler = async () => {
    if (!containerRef.current) return;

    const modeler = new BpmnModeler({
      container: containerRef.current,
      bpmnRenderer: { defaultFillColor: theme === "light" ? "#ffffff" : "#101828", defaultStrokeColor: theme === "light" ? "#525252" : "#c6c6c6" },
      // keyboard: { bindTo: window },
      // propertiesPanel: {
      //   parent: '#properties'
      // },
      // additionalModules: [
      //   BpmnPropertiesPanelModule,
      //   BpmnPropertiesProviderModule, 
      //   customPropertiesProviderModule    
      // ],     
      // moddleExtensions: {        
      //   custom: customModdleDescriptor
      // },
    });

    // get event bus
    const eventBus: EventBus = modeler.get("eventBus");

    // element on change
    eventBus.on("element.changed", async (event: any) => {
      console.log(event);
    });

    eventBus.on("keyboard.keydown", (event: any) => {
      console.log("Key pressed:", event);
    });

    // Initialize the modeler
    // modelerRef.current = new BpmnModeler({
    //   container: containerRef.current,
    //   bpmnRenderer: { defaultFillColor: theme === "light" ? "#ffffff" : "#101828", defaultStrokeColor: theme === "light" ? "#525252" : "#c6c6c6" },
    //   // propertiesPanel: {
    //   //   parent: '#properties'
    //   // },
    //   // additionalModules: [
    //   //   propertiesPanelModule,
    //   //   bpmnPropertiesProviderModule
    //   // ],
    //   // moddleExtensions: {
    //   //   camunda: camundaModdleDescriptor
    //   // }
    // });

    try {
      const { warnings } = await modeler.importXML(flowData.xml);

      // Initialize the modeler
      modelerRef.current = modeler;
    } catch (err) {
      console.error('Error importing XML', err);
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
      }
    } catch (err) {
      console.error('Error saving BPMN XML:', err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '90vh', outline: "none" }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* <button onClick={handleSave}>💾 Save XML</button> */}
        {/* <div id="properties" style={{ width: '300px', height: '90vh', overflow: 'auto' }} /> */}
      </div>
    </div>
  );
}
