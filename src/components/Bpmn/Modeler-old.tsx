import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
// import { useHotkeys } from "react-hotkeys-hook";
// import SimpleBar from "simplebar-react";
import StoreContext from "@/context/StoreContext";
import { debounce } from "@/libs/functions";
import Button from "@/components/Button";
import mqtt from "mqtt";
import moment from "moment";
import Link from "next/link";
import style from "@/styles/flow.module.css";
import { SessionData } from "@/libs/session";

// import bpmn styles
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

// import bpmn flow libraries
import Flow, { ElementProperty, Options } from "@/libs/flow";
import { parseString } from "xml2js";

// import bpmn element property panel
import BpmnPropertyPanel, { GetProperties, SetProperties } from "@/components/Bpmn/PropertyPanel";

export default function BpmnModeler({ session, processInfo, setProcessInfo }: { session: SessionData; processInfo: any | undefined; setProcessInfo: Function }) {
  const storeContext = useContext(StoreContext);
  const router = useRouter();

  const [flowObj, setFlowObj] = useState<Flow>();
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

  const [client, setClient] = useState<any>();
  const mqttConnect = (host: any, mqttOption: any) => {
    setClient(mqtt.connect(host, mqttOption));
  };

  // update property
  const updateProperty = useCallback(
    debounce(async (property: any, callback: Function) => {
      // callback with results
      if (typeof callback === "function") callback(property);
    }, 500), []
  );

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

  // save data
  async function saveData(flowObj: Flow | undefined) {
    // get result
    const result = await flowObj?.modeler.saveXML({ format: true });

    // set data
    setFlowData((prevState: any) => ({
      ...prevState,
      xml: result.xml,
    }));

    // update save status
    setUpdateStatus({
      show: true,
      timestamp: moment().format("DD-MM-YYYY HH:mm:ss"),
    });

    setTimeout(() => {
      // update save status
      setUpdateStatus((prevState: any) => ({
        ...prevState,
        show: false,
      }));
    }, 5000);
  }

  // save flow
  async function updateFlow() {
    // save xml
    try {
      // get result
      const result = await flowObj?.modeler.saveXML({ format: true });

      // set data
      setFlowData((prevState: any) => ({
        ...prevState,
        xml: result.xml
      }));

      // activate page progress
      storeContext.setPageProgress(true);

      // set updating status
      setUpdating(true);

      // call api
      const response = await fetch(`/api/flow/${flowData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          process_id: processId,
          name: processInfo.name,
          xml: result.xml,
          userid: session.userid
        })
      });

      // get response data
      const data = await response.json();

      setTimeout(() => {
        // activate page progress
        storeContext.setPageProgress(false);

        // let response
        let response = {};

        // on error
        if (data.status == "error") {
          // set response
          response = {
            color: "danger",
            message: data.message
          };
        } else {
          // set response
          response = {
            color: data.status,
            message: data.message
          };

          // set dirty
          setDirty(false);

          // set status
          setStatus("Modified");

          // set initail flow xml
          setInitialData(result);
        }

        // set updating status
        setUpdating(false);

        // show message
        storeContext.openToast(response);
      }, 500);
    } catch (err: any) {
      // on error
      console.error("could not save BPMN 2.0 diagram", err);
    }
  }

  // on deploy
  async function deployFlow() {
    // deploy flow
    try {
      // activate page progress
      storeContext.setPageProgress(true);

      // set deploying status
      setDeploying(true);

      // call api
      const seamlessResponse = await fetch(`/api/seamless/workflow/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wf_bpmn_file_name: `${flowData.id}.bpmn`,
          wf_bpmn_definition_content: flowData.xml,
          wf_submitted_by: session.fullname
        })
      });

      // get response data
      const seamlessData = await seamlessResponse.json();

      // get result
      let response = seamlessData.result[0];

      // let data
      let data: any = {};

      // on success
      if (typeof seamlessData.error === "undefined") {
        // call api
        const cockPitResponse = await fetch(`/api/flow/deploy/${flowData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: response.wf_version,
            deployment_id: response.wf_deployment_id,
            userid: session.userid
          })
        });

        // get response data
        data = await cockPitResponse.json();
      } else {
        // on error
        data = {
          status: "error",
          message: seamlessData.error.message
        };
      }

      setTimeout(() => {
        // activate page progress
        storeContext.setPageProgress(false);

        // on error
        if (data.status == "error") {
          // set response
          response = {
            color: "danger",
            message: data.message
          };
        } else {
          // set response
          response = {
            color: data.status,
            message: data.message
          };

          // set dirty
          setDirty(false);

          // set status
          setStatus("Deployed");
        }

        // set deploying status
        setDeploying(false);

        // show message
        storeContext.openToast(response);

        // on success
        if (data.status !== "error") {
          setTimeout(() => {
            // reload to current version
            router.push(`/modeler/flow/${processId}`);
          }, 500);
        }
      }, 500);
    } catch (err: any) {
      // on error
      console.error("could not deploy BPMN 2.0 diagram", err);
    }
  }

  // on start
  async function startFlow() {
    // start flow
    try {
      // activate page progress
      storeContext.setPageProgress(true);

      // set executing status
      setExecuting(true);

      // call api
      const response = await fetch(`/api/seamless/workflow/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wf_deployment_id: flowData.deployment_id,
          wf_initiated_by: session.fullname
        })
      });

      // get response data
      const data = await response.json();

      setTimeout(() => {
        // activate page progress
        storeContext.setPageProgress(false);

        // let response
        let response = {};

        // on error
        if (typeof data.error === "undefined") {
          // set response
          response = {
            color: "success",
            message: "Flow started successfully"
          };
        } else {
          // set response
          response = {
            color: "danger",
            message: data.error.message
          };
        }

        // set executing status
        setExecuting(false);

        // show message
        storeContext.openToast(response);
      }, 500);
    } catch (err: any) {
      // on error
      console.error("could not start BPMN 2.0 process", err);
    }
  }

  // on revisions
  async function loadRevisions() {
    // save xml
    try {
      // call api
      const response = await fetch(`/api/flow/revisions/${router.query.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      // get response data
      const data = await response.json();

      // on error
      if (data.status !== "error") {
        // set revisions
        setRevisions(data.results);
      }
    } catch (err: any) {
      // on error
      console.error("could not load flow revisions", err);
    }
  }

  // on import to current
  async function importToCurrent(e: any) {
    // get result
    const result = await flowObj?.modeler.saveXML({ format: true });

    // set xml data
    setImportXML(result.xml);

    // set dirty
    setDirty(true);

    // reload to current version
    router.push(`/modeler/flow/${processId}`);
  }

  // on import
  function importFlow(e: any) {
    // get file
    const file = e.target.files[0]; // Get the selected file

    // if file
    if (file) {
      // init file reader
      const reader = new FileReader();

      // Define the onload callback to read the file
      reader.onload = (e: any) => {
        // parse bpmn xml to object
        parseString(e.target.result, (err: any, result: any) => {
          // check if process is same
          if (result["bpmn:definitions"]["bpmn:process"][0].$.id == router.query.id) {
            // Set the file content to state
            setFlowData((prevState: any) => ({
              ...prevState,
              xml: e.target.result,
            }));

            // set dirty
            setDirty(true);

            // set default panel
            setCurrentPanel(undefined);

            // show success
            storeContext.openToast({ color: "success", message: "Process definition imported successfully." });
          } else {
            // show error
            storeContext.openToast({ color: "danger", message: `Error importing process definition. Process id does not match.` });
          }
        });
      };

      // reader on error
      reader.onerror = (err: any) => {
        // log error
        console.error("File reading failed:", e.message);

        // show error
        storeContext.openToast({ color: "danger", message: err.message });
      };

      // Read the file as text
      reader.readAsText(file);
    }
  }

  // on browse
  function browseFlow(e: any) {
    // if browse file is defined
    if (typeof browseFile !== "undefined") {
      // simulate click event
      browseFile.click();
    }
  }

  // on export flow
  async function exportFlow(e: any) {
    e.preventDefault();

    // modeler save to xml
    try {
      // get result
      const result = await flowObj?.modeler.saveXML({ format: true });

      // Create a Blob object
      const blob = new Blob([result.xml], { type: "application/bpmn20-xml" });

      // Generate a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${processInfo.name}.bpmn`;

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up the ObjectURL
      URL.revokeObjectURL(url);
    } catch (err) {
      // return error
      console.error("could not save BPMN 2.0 diagram", err);
    }
  }

  // on export svg
  async function exportSVG(e: any) {
    e.preventDefault();

    // modeler save to svg
    try {
      // get result
      const result = await flowObj?.modeler.saveSVG({ format: true });

      // Create a Blob object
      const blob = new Blob([result.svg], { type: "application/image/svg" });

      // Generate a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${processInfo.name}.svg`;

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up the ObjectURL
      URL.revokeObjectURL(url);
    } catch (err) {
      // return error
      console.error("could not save BPMN 2.0 diagram", err);
    }
  }

  // hide template replacer
  function hideTemplateReplacer() {
    // get replacer element
    const replacer = document.querySelector(".djs-popup.bpmn-element-list") as HTMLElement;

    // remove replacer element
    if (replacer) replacer.remove();
  }

  // on load
  async function onLoad(options: Options) {
    // init flow
    const flow: Flow = new Flow(options);

    // ser flow object
    setFlowObj(flow);

    try {
      // import xml
      const { warnings } = await flow.modeler.importXML(importXML || flowData.xml);

      // on context pad open
      flow.eventBus.on('contextPad.open', (e: any) => {
        // get element
        const element = e.current.target;

        // get business object
        const businessObject: any = flow.getElementType(element.businessObject);

        // get available templates
        const availableTemplates = [
          ...flow.getElementTemplates("default").filter((template: any) => template.enable).map((template: any) => template.id),
          ...flow.getElementTemplates("connectors").filter((template: any) => template.enable).map((template: any) => template.id)
        ];

        // check for element type
        if (availableTemplates.includes(businessObject.template)) {
          // get orginal replace icon 
          const replaceIcon = e.current.html.querySelector('[data-group="edit"] [data-action="replace"]') as HTMLElement;

          // remove the icon
          if (replaceIcon) replaceIcon.remove();

          // get edit group container
          const modelGrp = e.current.html.querySelector('[data-group="edit"]') as HTMLElement;

          // create new choose element container 
          const chooseElement = document.createElement("div");

          // set choose element properties
          chooseElement.className = "entry bpmn-icon-screw-wrench";
          chooseElement.setAttribute("draggable", "false");
          chooseElement.setAttribute("title", "Change element");

          // on choose element
          chooseElement.addEventListener("click", (event: any) => {
            // create replacer element
            const replacer = document.createElement("div") as HTMLElement;

            // set replacer properties
            replacer.className = "djs-popup bpmn-element-list";
            replacer.style.transform = "scale(1)";
            replacer.style.width = "300px";
            replacer.style.transformOrigin = "left top";
            replacer.style.left = `${e.current.html.offsetLeft}px`;
            replacer.style.top = `${e.current.html.offsetTop + e.current.html.clientHeight + 92}px`;

            // replacer window
            replacer.innerHTML = `
              <div class="djs-popup-header">
                <h3 class="djs-popup-title" title="Change element">Change element</h3>              
              </div>
              <div class="djs-popup-body">
                <div class="djs-popup-search">
                  <svg class="djs-popup-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.0325 8.5H9.625L13.3675 12.25L12.25 13.3675L8.5 9.625V9.0325L8.2975 8.8225C7.4425 9.5575 6.3325 10 5.125 10C2.4325 10 0.25 7.8175 0.25 5.125C0.25 2.4325 2.4325 0.25 5.125 0.25C7.8175 0.25 10 2.4325 10 5.125C10 6.3325 9.5575 7.4425 8.8225 8.2975L9.0325 8.5ZM1.75 5.125C1.75 6.9925 3.2575 8.5 5.125 8.5C6.9925 8.5 8.5 6.9925 8.5 5.125C8.5 3.2575 6.9925 1.75 5.125 1.75C3.2575 1.75 1.75 3.2575 1.75 5.125Z" fill="#22242A"></path></svg>
                  <input type="text" spellcheck="false" aria-label="Change element" autocomplete="off">
                </div>
                <div class="djs-popup-results">
                  <ul class="djs-popup-group" data-group="default"></ul>
                  <div class="entry-header" title="Connectors">Connectors</div>
                  <ul class="djs-popup-group" data-group="connectors"></ul>
                </div>
              </div>`;

            // get replacer parent
            const djsContainer = document.querySelector(".djs-container") as HTMLElement;

            // append replacer window to parent
            djsContainer.appendChild(replacer);

            // get search element
            const searchElement = replacer.querySelector('.djs-popup-search > [type="text"]') as HTMLInputElement;

            // set focus to search element
            searchElement.focus();

            // get element list container
            const elementElementList = replacer.querySelector('.djs-popup-group[data-group="default"]') as HTMLElement;

            // load element template
            const loadElementTemplates = (searchText: string) => {
              // loop element templates
              flow.getElementTemplates("default").filter((template: any) => template.applies_to.includes(businessObject.template) && (searchText.trim() == "" || template.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) && template.enable).forEach((template: any) => {
                // create temmplate item
                const templateItem = document.createElement("li") as HTMLElement;

                // set template item properties
                templateItem.className = "entry";
                templateItem.dataset.id = template.id;
                templateItem.title = template.name;
                templateItem.tabIndex = 0;

                // on item click
                templateItem.onclick = (item: any) => {
                  // change element
                  const updatedElement = flow.bpmnReplace.replaceElement(element, { type: template.id });

                  // // get element property
                  let elementProp: ElementProperty = {
                    id: element.businessObject.id,
                    type: template.name,
                    template: template.id,
                    description: template.description,
                    icon: flow.getElementIcon(updatedElement.businessObject),
                    name: element.businessObject.name || "",
                  };

                  // delete extension elements
                  if (typeof element.businessObject.extensionElements !== "undefined") delete element.businessObject.extensionElements;

                  // delete event definitions
                  // if (typeof element.businessObject.eventDefinitions !== "undefined") delete element.businessObject.eventDefinitions;

                  // // get sequence flow properties        
                  elementProp = GetProperties(elementProp, element.businessObject);

                  // // set element property
                  setProperty(elementProp);

                  // get replacer element
                  const replacerElement = document.querySelector(".djs-popup.bpmn-element-list") as HTMLElement;

                  // remove replacer element
                  if (replacerElement) replacerElement.remove();

                  // set dirty
                  setDirty(true);

                  // set on click
                  setOnClick(false);
                }

                // template list item
                templateItem.innerHTML = `
                  <div class="djs-popup-entry-content" style="pointer-events: none">
                    <span class="djs-popup-entry-name ${template.icon}">
                      <span class="djs-popup-label">${template.name}</span>
                    </span>
                  </div>`;

                // append item to container
                elementElementList.appendChild(templateItem);
              });
            }

            // get connector template container
            const elementConnectorsList = replacer.querySelector('.djs-popup-group[data-group="connectors"]') as HTMLElement;

            // get connector entry header
            const entryHeader = replacer.querySelector('.entry-header') as HTMLElement;

            // load connector template
            const loadConnectorTemplates = (searchText: string) => {
              // loop element templates
              flow.getElementTemplates("connectors").filter((template: any) => template.applies_to.includes(businessObject.template) && (searchText.trim() == "" || template.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) && template.enable).forEach((template: any) => {
                // create temmplate item
                const templateItem = document.createElement("li") as HTMLElement;

                // set template item properties
                templateItem.className = "entry";
                templateItem.dataset.id = template.id;
                templateItem.title = template.name;
                templateItem.tabIndex = 0;

                // on item click
                templateItem.onclick = (item: any) => {
                  // update template icon
                  element.di.bpmnElement.$attrs["zeebe:modelerTemplateIcon"] = template.icon;

                  // get element property
                  let elementProp: ElementProperty = {
                    id: element.businessObject.id,
                    type: template.name,
                    template: template.id,
                    description: template.description,
                    icon: flow.getElementIcon(element.businessObject),
                    name: element.businessObject.name || "",
                  };

                  // delete extension elements
                  if (typeof element.businessObject.extensionElements !== "undefined") delete element.businessObject.extensionElements;

                  // delete event definitions
                  // if (typeof element.businessObject.eventDefinitions !== "undefined") delete element.businessObject.eventDefinitions;

                  // get sequence flow properties        
                  elementProp = GetProperties(elementProp, element.businessObject);

                  // set element property
                  setProperty(elementProp);

                  // get replacer element
                  const replacerElement = document.querySelector(".djs-popup.bpmn-element-list") as HTMLElement;

                  // remove replacer element
                  if (replacerElement) replacerElement.remove();

                  // set dirty
                  setDirty(true);

                  // set on click
                  setOnClick(false);
                }

                // template list item
                templateItem.innerHTML = `
                  <div class="djs-popup-entry-content" style="pointer-events: none">
                    <span class="djs-popup-entry-name">
                      <img class="djs-popup-entry-icon" src="${template.icon}" alt="${template.name}">
                      <span class="djs-popup-label">${template.name}</span>
                    </span>
                    <span class="djs-popup-entry-description" title="${template.description}">${template.description}</span>
                  </div>
                  <div class="djs-popup-entry-docs">
                    <a href="${template.documentation}" title="Open element documentation" target="_blank" rel="noopener">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.6368 10.6375V5.91761H11.9995V10.6382C11.9995 10.9973 11.8623 11.3141 11.5878 11.5885C11.3134 11.863 10.9966 12.0002 10.6375 12.0002H1.36266C0.982345 12.0002 0.660159 11.8681 0.396102 11.6041C0.132044 11.34 1.52588e-05 11.0178 1.52588e-05 10.6375V1.36267C1.52588e-05 0.98236 0.132044 0.660173 0.396102 0.396116C0.660159 0.132058 0.982345 2.95639e-05 1.36266 2.95639e-05H5.91624V1.36267H1.36266V10.6375H10.6368ZM12 0H7.2794L7.27873 1.36197H9.68701L3.06507 7.98391L4.01541 8.93425L10.6373 2.31231V4.72059H12V0Z" fill="#818798"></path></svg>
                    </a>
                  </div>`;

                // append item to container
                elementConnectorsList.appendChild(templateItem);
              });

              // if connector exists
              if (elementConnectorsList.innerHTML !== "") {
                // show header
                entryHeader.style.display = "block";
              } else {
                // hide header
                entryHeader.style.display = "none";
              }
            }

            // on search element
            searchElement.addEventListener("keyup", (e: any) => {
              // clear all element
              elementElementList.innerHTML = "";

              // load elements
              loadElementTemplates(e.target.value);

              // clear all element
              elementConnectorsList.innerHTML = "";

              // load templates
              loadConnectorTemplates(e.target.value);
            });

            // load elements
            loadElementTemplates("");

            // load template
            loadConnectorTemplates("");
          });

          // append choose element to edit group
          modelGrp.prepend(chooseElement);
        }
      });

      // element on  click
      flow.eventBus.on("element.click", (e: any) => {
        // set on click
        setOnClick(true);

        // hide template replacer
        hideTemplateReplacer();

        // console.log(e.element.businessObject);

        // get element type
        const elementType: any = flow.getElementType(e.element.businessObject);

        // get element property
        let elementProp: ElementProperty = {
          id: e.element.businessObject.id,
          type: elementType.name,
          template: elementType.template,
          description: elementType.description,
          icon: flow.getElementIcon(e.element.businessObject),
          name: e.element.businessObject.name || "",
        };

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
      flow.eventBus.on("element.changed", async (e: any) => {
        // set dirty
        setDirty(true);

        // set on click
        setOnClick(false);

        // if service task
        if (e.element.businessObject.$type === "bpmn:ServiceTask") {
          // set service elements
          setServiceElements(flow.elementRegistry.filter((element: any) => element.type == "bpmn:Task" || element.type == "bpmn:ServiceTask"));
        }
      });

      // element on change
      // flow.eventBus.on("shape.removed", async (e: any) => {
      //   // eventDefinitions is defined
      //   if (typeof e.element.businessObject.eventDefinitions !== "undefined" && e.element.businessObject.eventDefinitions.length) {
      //     // console.log(e.element.businessObject.eventDefinitions[0]);

      //     // delete event definitions
      //     if (typeof e.element.businessObject.eventDefinitions[0] !== "undefined") {
      //       // const definitions = flowObj?.definitions

      //       // const updatedRootElements = flowObj?.definitions.rootElements.filter((el: any) => el.$type !== 'bpmn:Message');



      //       // console.log(updatedRootElements);


      //       const definitions1 = flowObj?.modeler.getDefinitions();
      //       const rootElement = flowObj?.canvas.getRootElement();

      //       const definitions2 = rootElement.businessObject.$parent;

      //       console.log(definitions1);
      //       console.log(definitions2);


      //       definitions1.rootElements

      //       var messages = definitions1.rootElements.filter(function (element: any) {
      //         return element.$type === 'bpmn:Message';
      //       });

      //       messages.forEach(function (m:any) {
      //         definitions1.rootElements.splice(definitions1.rootElements.indexOf(m), 1);
      //       });

      //       // const updatedRootElements = definitions.rootElements.filter((el: any) => el.$type !== 'bpmn:Message');
      //       // flowObj?.modeling.updateProperties(definitions1, { rootElements: definitions1.rootElements });


      //       // console.log(definitions);



      //       // flowObj?.modeling.updateModdleProperties(elementObj, businessObject, { conditionExpression: undefined });

      //       // delete e.element.businessObject.eventDefinitions[0].messageRef;
      //     }
      //   }

      //   // // set dirty
      //   // setDirty(true);

      //   // // set on click
      //   // setOnClick(false);

      //   // // if service task
      //   // if (e.element.businessObject.$type === "bpmn:ServiceTask") {
      //   //   // set service elements
      //   //   setServiceElements(flow.elementRegistry.filter((element: any) => element.type == "bpmn:Task" || element.type == "bpmn:ServiceTask"));
      //   // }
      // });

      flow.eventBus.on('shape.remove', (e: any) => {
        const modeling = flowObj?.modeler.get('modeling');
        const canvas = flowObj?.modeler.get('canvas');

        if (!modeling || !canvas) {
          console.error("Error: 'modeling' or 'canvas' is undefined");
          return;
        }

        const deletedElement = e.element;

        // Ensure it's a StartEvent with a Message Event Definition
        if (deletedElement.businessObject.$type === 'bpmn:StartEvent') {
          const eventDefinitions = deletedElement.businessObject.eventDefinitions || [];
          const messageEvent = eventDefinitions.find((ed: any) => ed.$type === 'bpmn:MessageEventDefinition');

          if (messageEvent && messageEvent.messageRef) {
            const messageId = messageEvent.messageRef.id;

            // Get Definitions
            const rootElement = canvas.getRootElement();
            const definitions = rootElement.businessObject.$parent;

            if (!definitions || !definitions.rootElements) {
              console.error("Error: BPMN Definitions are undefined");
              return;
            }

            // Remove <bpmn:Message> with matching ID
            const updatedRootElements = definitions.rootElements.filter((el: any) =>
              !(el.$type === 'bpmn:Message' && el.id === messageId)
            );

            // const aaa = flowObj?.elementRegistry.get(messageId);

            // console.log(definitions.id, aaa, messageId);

            // Apply the update
            modeling.updateProperties(definitions, { rootElements: updatedRootElements });

            console.log(`Removed <bpmn:Message> with ID: ${messageId}`);
          }
        }
      });

      // on element added
      flow.eventBus.on("shape.added", (e: any) => {
        // set dirty
        setDirty(true);

        // set on click
        setOnClick(false);

        // if service task
        if (e.element.businessObject.$type === "bpmn:ServiceTask") {
          // set service elements
          setServiceElements(flow.elementRegistry.filter((element: any) => element.type == "bpmn:Task" || element.type == "bpmn:ServiceTask"));
        }
      });

      // on mouse wheel scroll
      flow.canvas.getContainer().addEventListener("wheel", (e: any) => {
        // hide template replacer
        hideTemplateReplacer();
      });

      setTimeout(() => {
        // set service elements
        setServiceElements(flow.elementRegistry.filter((element: any) => element.type == "bpmn:Task" || element.type == "bpmn:ServiceTask"));

        // get process element
        const processObj = flow.elementRegistry.find((element: any) => element.type == "bpmn:Process");

        // set process id
        setProcessId(processObj.businessObject.id);

        // set process info
        setProcessInfo((prevState: any) => ({
          ...prevState,
          name: processObj.businessObject.name
        }));
      }, 0);

      // reset import xml
      setImportXML(undefined)
    } catch (err: any) {
      // log error
      console.log("error rendering", err);

      // show error
      storeContext.openToast({ color: "danger", message: err.message });
    }
  }

  // on load service
  async function loadServices() {
    // call api
    const response = await fetch(`/api/service/registry/search?health=Running`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // get response data
    const data = await response.json();

    // set summary data
    setServices(data.results);
  }

  // on fetch
  async function loadDesign() {
    // if fetchUrl is defined
    if (typeof router.query.id !== "undefined") {
      // call api
      let response = await fetch(typeof router.query.version !== "undefined" ? `/api/flow/${router.query.id}?version=${router.query.version}` : `/api/flow/${router.query.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      // get response data
      const data = await response.json();

      // set data
      setFlowData(data.result);

      // set process info
      setProcessInfo(data.result);

      // set status
      setStatus(data.result.status);

      // set initial flow data
      setInitialData(data.result);

      // activate on current version only
      if (typeof router.query.version === "undefined") {
        // get browse file element
        const browseFile = document.querySelector("#browseFile") as HTMLInputElement;

        // set browse file element
        setBrowseFile(browseFile);

        // on browse file change
        browseFile.addEventListener("change", importFlow);
      }
    }
  }

  // reset flow
  function resetFlow() {
    // confirm on reset
    storeContext.askConfirm({
      title: "Are you sure?",
      message: `Would you like to reset the flow design to initial state`,
      label: `Yes, reset it!`,
      color: "warning",
      callback: async (isConfirm: boolean) => {
        if (isConfirm) {
          // set data
          setFlowData((prevState: any) => ({
            ...prevState,
            xml: initialData.xml,
          }));

          // if modeler exists detach modeler
          if (typeof flowObj !== "undefined") {
            // detach modeler
            flowObj?.modeler.detach();
          }

          // on load
          onLoad({ theme: storeContext.theme, readonly: readonly });

          // set is dirty to false
          setDirty(false);

          // set default panel
          setCurrentPanel(undefined);
        }
      }
    });
  }

  // toogle theme
  async function toogleTheme() {
    // if flow data is defined
    if (typeof flowData !== "undefined") {
      // if modeler exists detach modeler
      if (typeof flowObj !== "undefined") {
        // get result
        const result = await flowObj?.modeler.saveXML({ format: true });

        // if modeler is loaded with xml
        if (typeof result !== "undefined") {
          // set data
          setFlowData((prevState: any) => ({
            ...prevState,
            xml: result.xml,
          }));
        }

        // detach modeler
        flowObj?.modeler.detach();
      }
    }
  }

  // on save hot key
  useHotkeys('ctrl+s', (e: any) => { e.preventDefault(); if (isDirty && !readonly) updateFlow(); });

  // on deploy hot key
  useHotkeys('ctrl+d', (e: any) => { e.preventDefault(); if (!isDirty && !readonly && (status == "Created" || status == "Modified")) deployFlow(); });

  // on zoom reset
  function zoomReset(e: any) {
    e.preventDefault();

    // hide template replacer
    hideTemplateReplacer();

    // zoom reset
    flowObj?.zoomScroll.reset();
  }

  // on zoom in
  function zoomIn(e: any) {
    e.preventDefault();

    // hide template replacer
    hideTemplateReplacer();

    // zoom in
    flowObj?.zoomScroll.stepZoom(1);
  }

  // on zoom out
  function zoomOut(e: any) {
    e.preventDefault();

    // hide template replacer
    hideTemplateReplacer();

    // zoom out
    flowObj?.zoomScroll.stepZoom(-1);
  }

  useEffect(() => {
    // if service elements are defined
    if (typeof serviceElements !== "undefined") {
      // clear all overlays
      flowObj?.overlays.clear();

      // loop service elements
      serviceElements.forEach((element: any) => {
        console.log(element.businessObject);
        // if extension elements exists
        if (typeof element.businessObject.extensionElements !== "undefined") {
          // get zeebe io mapping
          const zeebeIoMapping = element.businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:iomapping");

          // let zeebe inputs
          let zeebeInputs = [];

          // check for inputParameters / children
          if (typeof zeebeIoMapping[0].inputParameters !== "undefined") {
            // get zeebe inputs
            zeebeInputs = zeebeIoMapping[0].inputParameters.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:input");
          } else if (typeof zeebeIoMapping[0].$children !== "undefined") {
            // get zeebe inputs
            zeebeInputs = zeebeIoMapping[0].$children.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:input");
          }

          // get service id
          const serviceId: string = zeebeInputs.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:input" && zeebeProps.target === "serviceId").map((zeebeInput: any) => zeebeInput.source)[0];

          // get running service info
          const online = services.find((service: any) => service.id === serviceId);

          // add service status
          flowObj?.overlays.add(element.id, {
            html: `<span class="${typeof online !== "undefined" ? "service-online" : "service-offline"}"></span>`,
            position: {
              top: 6,
              right: 18,
            },
          });
        }
      });
    }
  }, [services, serviceElements]);

  useEffect(() => {
    // if property not undefined
    if (typeof property !== "undefined" && isDirty && !onClick) {
      // update property
      updateProperty(property, async (property: any) => {
        try {
          // get flow element
          const elementObj = flowObj?.elementRegistry.get(elementId);

          // get business object
          const businessObject = elementObj.businessObject;

          // update properties
          SetProperties(elementObj, flowObj, businessObject, property);

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
          flowObj?.modeling.updateProperties(elementObj, elementProp);

          // save flow date
          saveData(flowObj);
        } catch (e: any) {
          // on error
          console.log(e.message);
        }
      });
    }
  }, [property]);

  useEffect(() => {
    if (typeof flowData !== "undefined") {
      // detach modeler
      flowObj?.modeler.detach();

      // if theme
      onLoad({ theme: storeContext.theme, readonly: readonly });
    }
  }, [flowData]);

  useEffect(() => {
    // if theme
    if (typeof storeContext.theme !== "undefined") {
      // toogle theme
      toogleTheme();
    }
  }, [storeContext.theme]);

  useEffect(() => {
    // if client is initiated
    if (client) {
      // on mqtt clinet connect
      client.on("connect", () => {
        // subscribe to ready state
        client.subscribe(`${process.env.NEXT_PUBLIC_MQTT_TOPIC_REGISTER}/#`, (error: any) => {
          if (error) {
            console.log("Subscribe to topics error", error);
            return;
          }
        });

        // subscribe to ready state
        client.subscribe(`${process.env.NEXT_PUBLIC_MQTT_TOPIC_UNREGISTER}/#`, (error: any) => {
          if (error) {
            console.log("Subscribe to topics error", error);
            return;
          }
        });
      });

      // on connection error
      client.on("error", (err: any) => {
        console.error("Connection error: ", err);
        client.end();
      });

      // on reconnect
      client.on("reconnect", () => { });

      // on message
      client.on("message", (topic: any, message: { toString: () => any }) => {
        // get payload
        const payload = { topic, message: message.toString() };

        // load services
        loadServices();
      });
    }
  }, [client]);

  useEffect(() => {
    // set can deploy
    if (typeof processId !== "undefined") {
      // load revisions
      loadRevisions();
    }
  }, [processId]);

  useEffect(() => {
    // load design
    loadDesign();

    // load services
    loadServices();

    // set readonly state
    setReadonly(typeof router.query.version !== "undefined" ? true : false);
  }, [router.query]);

  useEffect(() => {
    // connect to mqtt server
    mqttConnect(`ws://${process.env.NEXT_PUBLIC_MQTT_HOST}:${process.env.NEXT_PUBLIC_MQTT_PORT}`, {
      username: process.env.NEXT_PUBLIC_MQTT_USER,
      password: process.env.NEXT_PUBLIC_MQTT_PASS,
    });
  }, []);

  return (
    <>
      <div className={"navbar navbar-expand-lg border-bottom " + style.actionToolbar}>
        <div className="container d-flex align-items-center justify-content-between">
          <p className={`text-body-emphasis d-flex align-items-center fade ${updateStatus.show ? "show" : ""}`}>
            <i className="text-success material-symbols-rounded me-1">
              done_all
            </i>
            Auto saved at {updateStatus.timestamp}
          </p>
          <div className="d-flex align-items-center justify-content-between">
            {!readonly ?
              <>
                <Button className={"btn btn-icon me-3" + (isDirty ? "" : " disabled")} onClick={resetFlow}>
                  <i className="material-symbols-rounded me-1">reset_image</i>Reset
                </Button>
                <Button className={"btn btn-icon me-3" + (isDirty ? "" : " disabled")} processing={updating} onClick={updateFlow}>
                  <i className="material-symbols-rounded me-1">save</i>Update
                </Button>
                <Button className={"btn btn-icon me-3" + (!isDirty && (status == "Created" || status == "Modified") ? "" : " disabled")} processing={deploying} onClick={deployFlow}>
                  <i className="material-symbols-rounded me-1">rocket_launch</i>
                  Deploy
                </Button>
              </>
              : ""}
            <Button className={"btn btn-icon" + (!isDirty && status == "Deployed" ? "" : " disabled")} processing={executing} onClick={startFlow}>
              <i className="material-symbols-rounded me-1">slideshow</i>
              Start
            </Button>
            <div className="vr text-body-secondary m-3"></div>
            {revisions.length && false ?
              <Button className={"btn btn-icon me-3"} onClick={(e: any) => { e.preventDefault(); setCurrentPanel("Revisions") }}>
                <i className="material-symbols-rounded me-1">search_activity</i>
                Revisions
              </Button>
              : ""}
            {revisions.length && readonly ?
              <Button className={"btn btn-icon me-3"} onClick={importToCurrent}>
                <i className="material-symbols-rounded me-1">article_shortcut</i>
                Import to Current
              </Button>
              :
              <>
                <input className="d-none" id="browseFile" type="file" accept=".bpmn" />
                <Button className="btn btn-icon me-3" onClick={browseFlow}>
                  <i className="material-symbols-rounded me-1">upload</i>Import
                </Button>
              </>}
            <div className="position-relative">
              <Link href="#" className="btn btn-icon" data-bs-toggle="dropdown" data-bs-placement="right">
                <i className="material-symbols-rounded me-1">download</i>
                Download
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="defaultDropdown">
                <li>
                  <Link href="#" className={`dropdown-item d-flex align-items-center`} onClick={exportFlow}>
                    BPMN Diagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`dropdown-item d-flex align-items-center`} onClick={exportSVG}>
                    SVG Image
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={style.container}>
        <div id="modeler" className={`${style.canvas} ${readonly ? "readonly" : ""}`}>
          <div className={style.ZoomTools + " border bg-body"}>
            <Link href="#" className="d-flex text-dark p-2" title="reset zoom" onClick={zoomReset}>
              <i className="material-symbols-rounded text-body-emphasis pe-none">center_focus_strong</i>
            </Link>
            <div className="hr text-body-secondary my-1"></div>
            <Link href="#" className="d-flex text-dark p-2" title="zoom in" onClick={zoomIn}>
              <i className="material-symbols-rounded text-body-emphasis pe-none">zoom_in</i>
            </Link>
            <div className="hr text-body-secondary my-1"></div>
            <Link href="#" className="d-flex text-dark p-2" title="zoom out" onClick={zoomOut}>
              <i className="material-symbols-rounded text-body-emphasis pe-none">zoom_out</i>
            </Link>
          </div>
        </div>
        {currentPanel == "Property" ?
          <div id="properties" className={style.properties + " border-start modal-content bg-body"}>
            {typeof property !== "undefined" ?
              <BpmnPropertyPanel
                property={property}
                setProperty={setProperty}
                onChange={onChange}
                setOnClick={setOnClick}
                setDirty={setDirty}
                readonly={readonly}
              />
              : ""}
          </div>
          : currentPanel == "Revisions" ?
            <div className={style.revisions + " border-start modal-content"}>
              <SimpleBar autoHide={true} style={{ height: "calc(100vh - 152px)" }}>
                <div className="container py-3">
                  <ol className="list-group list-group-numbered">
                    {revisions.map((revision: any, key: number) =>
                      <li key={key} className="list-group-item d-flex justify-content-between align-items-start border mb-2">
                        <span className="badge text-bg-primary rounded-pill">{revision.version}</span>
                      </li>
                    )}
                  </ol>
                </div>
              </SimpleBar>
            </div>
            : ""}
      </div>
    </>
  );
}