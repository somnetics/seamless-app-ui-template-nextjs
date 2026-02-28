import { ChangeEventHandler } from "react";
// import AutoComplete from "@/components/AutoComplete";
import Image from "next/image";

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
  onChange: ChangeEventHandler<HTMLInputElement>,
  setOnClick: Function,
  setDirty: Function,
  readonly: boolean
}) => {
  return (
    <>
      <p className="fw-bold py-2 mb-3 bg-body bg-light-subtle border-top border-bottom">
        Service Endpoint
      </p>
      <div className="col-12 mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        {/* <AutoComplete */}
        endpoint="/api/service/registry/endpoints"
        searchField="name"
        descriptionField="url"
        name="url"
        id="url"
        value={property.url ?? ""}
        placeholder="Enter Url"
        required={false}
        readOnly={readonly}
        maxHeight="316px"
        onSelected={(item: any) => {
          console.log(item);
          // set dirty
          setDirty(true);

          // set on click
          setOnClick(false);

          // set property
          setProperty((prevState: any) => ({
            ...prevState,
            name: item.name,
            url: item.url.replace(/^\/|\/$/g, ""),
            method: item.method,
            serviceId: item.id,
          }));
        }}
        onChange={() => {
          // set dirty
          setDirty(true);

          // set on click
          setOnClick(false);

          // set property
          setProperty((prevState: any) => ({
            ...prevState,
            method: "",
            serviceId: "",
          }));
        }}
        onClear={() => {
          // set dirty
          setDirty(true);

          // set on click
          setOnClick(false);

          // set property
          setProperty((prevState: any) => ({
            ...prevState,
            url: "",
            method: "",
            serviceId: "",
          }));
        }}
        render={(item: any, highlighted: any, query: any) => {
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
                  {highlighted(item.name, query)}
                </p>
                <small className="d-flex text-muted text-wrap align-items-center pe-none">
                  <span className={`rest-method ${item.method.toLowerCase()} me-1 pe-none`}>
                    {item.method}
                  </span>
                  {highlighted(item.url.replace(/^\/|\/$/g, ""), query)}
                </small>
              </div>
            </div>
          );
        }}
        {/* /> */}
      </div>
      <div className="col-12 mb-3">
        <label htmlFor="method" className="form-label">
          Method
        </label>
        <input
          type="text"
          className="form-control"
          id="method"
          name="method"
          value={property.method}
          readOnly={true}
        />
      </div>
      {property.method.trim() !== "" && property.method !== "GET" && property.method !== "DELETE" ? <div className="col-12">
        <label htmlFor="body" className="form-label">
          Payload
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
            id="body"
            name="body"
            value={property.body ?? ""}
            onChange={onChange}
            readOnly={readonly}
            required
            placeholder='{"key": value}'
          />
        </div>
      </div>
        : ""}
      <div className="col-12">
        <label htmlFor="queryParameters" className="form-label">
          Query Parameters
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
            id="queryParameters"
            name="queryParameters"
            value={property.queryParameters ?? ""}
            onChange={onChange}
            readOnly={readonly}
            required
            placeholder='{"key": value}'
          />
        </div>
      </div>
      <div className="col-12">
        <label htmlFor="headers" className="form-label">
          Headers
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
            id="headers"
            name="headers"
            value={property.headers ?? ""}
            onChange={onChange}
            readOnly={readonly}
            required
            placeholder='{"key": value}'
          />
        </div>
      </div>
      <p className="fw-bold py-2 mb-3 bg-body bg-light-subtle border-top border-bottom">
        Output Mapping
      </p>
      <div className="col-12 mb-3">
        <label htmlFor="resultVariable" className="form-label">
          Result Variable
        </label>
        <input
          type="text"
          className="form-control"
          id="resultVariable"
          name="resultVariable"
          value={property.resultVariable ?? ""}
          onChange={onChange}
          readOnly={readonly}
          required
          placeholder="Enter Result Variable"
        />
      </div>
      <div className="col-12">
        <label htmlFor="resultExpression" className="form-label">
          Result Expression
        </label>
        <div className="input-group">
          <span className="input-group-text px-2" tabIndex={-1}>
            <i className="material-symbols-rounded text-body-tertiary fs-6">
              equal
            </i>
          </span>
          <input
            type="text"
            className="form-control"
            id="resultExpression"
            name="resultExpression"
            value={property.resultExpression ?? ""}
            onChange={onChange}
            readOnly={readonly}
            required
            placeholder='{"body": body}'
          />
        </div>
      </div>
    </>
  )
}

// get element properties
const GetProperties = (elementProp: any, businessObject: any) => {
  // get element properties
  let properties = elementProp;

  // if businessObject
  if (typeof businessObject !== "undefined") {
    // set zeebe io mapping default values
    const zeebeIoMappingValues: any = {
      url: "",
      method: "GET",
      queryParameters: "",
      headers: "",
    };

    // set zeebe task headers default values
    const zeebeTaskHeaderValues: any = {
      resultVariable: "",
      resultExpression: `{"body": body}`,
    };

    // if extension elements exists
    if (typeof businessObject.extensionElements !== "undefined") {
      // get zeebe io mapping
      const zeebeIoMapping = businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:iomapping");

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

      // loop zeebe inputs
      zeebeInputs.forEach((zeebeInput: any) => {
        // get input value
        zeebeIoMappingValues[zeebeInput.target] = zeebeInput.target == "queryParameters" || zeebeInput.target == "headers" || zeebeInput.target == "body" ? zeebeInput.source.substring(1) : zeebeInput.source;
      });

      // get zeebe task headers
      const zeebeTaskHeaders = businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:taskheaders");

      // let zeebe headers
      let zeebeHeaders = [];

      // // check for inputParameters / children
      if (typeof zeebeTaskHeaders[0].values !== "undefined") {
        // get zeebe headers
        zeebeHeaders = zeebeTaskHeaders[0].values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:header");
      } else if (typeof zeebeTaskHeaders[0].$children !== "undefined") {
        // get zeebe headers
        zeebeHeaders = zeebeTaskHeaders[0].$children.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:header");
      }

      // loop zeebe headers
      zeebeHeaders.forEach((zeebeHeader: any) => {
        // get header value
        if (typeof zeebeHeader.value !== "undefined") zeebeTaskHeaderValues[zeebeHeader.key] = zeebeHeader.key == "resultExpression" ? zeebeHeader.value.substring(1) : zeebeHeader.value;
      });
    }

    // update property
    properties = {
      ...elementProp,
      ...zeebeIoMappingValues,
      ...zeebeTaskHeaderValues,
    };
  }

  // return element properties
  return properties;
}

// set element properties
const SetProperties = (elementObj: any, flowObj: any, businessObject: any, property: any) => {
  // if sequence flow
  if (typeof businessObject !== "undefined") {
    // task definition
    const taskDefinition = flowObj?.createZeebeModdleElement("zeebe:TaskDefinition", { type: "io.camunda:http-json:1", retries: "3" }, businessObject);

    // io mapping
    const ioMapping = flowObj?.createZeebeModdleElement("zeebe:IoMapping", {}, businessObject);

    // zeebe inputs
    const authenticationType = flowObj?.createZeebeModdleElement("zeebe:Input", { source: "noAuth", target: "authentication.type" }, ioMapping);
    const method = flowObj?.createZeebeModdleElement("zeebe:Input", { source: property.method, target: "method" }, ioMapping);
    const url = flowObj?.createZeebeModdleElement("zeebe:Input", { source: property.url, target: "url" }, ioMapping);
    const connectionTimeoutInSeconds = flowObj?.createZeebeModdleElement("zeebe:Input", { source: "20", target: "connectionTimeoutInSeconds" }, ioMapping);
    const readTimeoutInSeconds = flowObj?.createZeebeModdleElement("zeebe:Input", { source: "20", target: "readTimeoutInSeconds" }, ioMapping);

    // input parameters
    const inputParameters: any = [
      authenticationType,
      method,
      url,
      connectionTimeoutInSeconds,
      readTimeoutInSeconds
    ];

    // check for empty expression
    if (typeof property.queryParameters !== "undefined" && property.queryParameters.trim() !== "") {
      // set query parameters
      const queryParameters = flowObj?.createZeebeModdleElement("zeebe:Input", { source: `=${property.queryParameters}`, target: "queryParameters", }, ioMapping);

      // push attributes
      inputParameters.push(queryParameters);
    }

    // check for empty expression
    if (typeof property.body !== "undefined" && property.body.trim() !== "") {
      // set body
      const body = flowObj?.createZeebeModdleElement("zeebe:Input", { source: `=${property.body}`, target: "body" }, ioMapping);

      // push attributes
      inputParameters.push(body);
    }

    // check for empty expression
    if (typeof property.headers !== "undefined" && property.headers.trim() !== "") {
      // set headers
      const headers = flowObj?.createZeebeModdleElement("zeebe:Input", { source: `=${property.headers}`, target: "headers" }, ioMapping);

      // push attributes
      inputParameters.push(headers);
    }

    // check for empty serviceId
    if (typeof property.serviceId !== "undefined" && property.serviceId.trim() !== "") {
      // set serviceId
      const serviceId = flowObj?.createZeebeModdleElement("zeebe:Input", { source: property.serviceId, target: "serviceId", }, ioMapping);

      // push attributes
      inputParameters.push(serviceId);
    }

    // uodate io mapping
    flowObj?.modeling.updateModdleProperties(elementObj, ioMapping, { inputParameters: inputParameters, });

    // task headers
    const taskHeaders = flowObj?.createZeebeModdleElement("zeebe:TaskHeaders", {}, businessObject);

    // zeebe headers
    const resultVariable = flowObj?.createZeebeModdleElement("zeebe:Header", { key: "resultVariable", value: property.resultVariable }, taskHeaders);
    const retryBackoff = flowObj?.createZeebeModdleElement("zeebe:Header", { key: "retryBackoff", value: "PT0S" }, taskHeaders);

    // headers value
    const value: any = [resultVariable, retryBackoff];

    // check for empty expression
    if (typeof property.resultExpression !== "undefined" && property.resultExpression.trim() !== "") {
      // set result expression
      const resultExpression = flowObj?.createZeebeModdleElement("zeebe:Header", { key: "resultExpression", value: `=${property.resultExpression}`, }, taskHeaders);

      // push attributes
      value.push(resultExpression);
    }

    // uodate io task header
    flowObj?.modeling.updateModdleProperties(elementObj, taskHeaders, { values: value, });

    // extension elements
    const extensionElements = flowObj?.createModdleElement("bpmn:ExtensionElements", { values: [taskDefinition, ioMapping, taskHeaders] }, businessObject);

    // update extension elements
    flowObj?.modeling.updateModdleProperties(elementObj, businessObject, { extensionElements });

    // element properties
    const data = {
      "zeebe:modelerTemplate": "io.camunda.connectors.HttpJson.v2",
      "zeebe:modelerTemplateVersion": "8",
      "zeebe:modelerTemplateIcon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjAzMzUgOC45OTk5N0MxNy4wMzM1IDEzLjQ0NzUgMTMuNDI4MSAxNy4wNTI5IDguOTgwNjUgMTcuMDUyOUM0LjUzMzE2IDE3LjA1MjkgMC45Mjc3NjUgMTMuNDQ3NSAwLjkyNzc2NSA4Ljk5OTk3QzAuOTI3NzY1IDQuNTUyNDggNC41MzMxNiAwLjk0NzA4MyA4Ljk4MDY1IDAuOTQ3MDgzQzEzLjQyODEgMC45NDcwODMgMTcuMDMzNSA0LjU1MjQ4IDE3LjAzMzUgOC45OTk5N1oiIGZpbGw9IiM1MDU1NjIiLz4KPHBhdGggZD0iTTQuOTMxMjYgMTQuMTU3MUw2Ljc4MTA2IDMuNzE0NzFIMTAuMTM3NUMxMS4xOTE3IDMuNzE0NzEgMTEuOTgyNCAzLjk4MzIzIDEyLjUwOTUgNC41MjAyN0MxMy4wNDY1IDUuMDQ3MzYgMTMuMzE1IDUuNzMzNTggMTMuMzE1IDYuNTc4OTJDMTMuMzE1IDcuNDQ0MTQgMTMuMDcxNCA4LjE1NTIyIDEyLjU4NDEgOC43MTIxNUMxMi4xMDY3IDkuMjU5MTMgMTEuNDU1MyA5LjYzNzA1IDEwLjYyOTggOS44NDU5TDEyLjA2MTkgMTQuMTU3MUgxMC4zMzE1TDkuMDMzNjQgMTAuMDI0OUg3LjI0MzUxTDYuNTEyNTQgMTQuMTU3MUg0LjkzMTI2Wk03LjQ5NzExIDguNTkyODFIOS4yNDI0OEM5Ljk5ODMyIDguNTkyODEgMTAuNTkwMSA4LjQyMzc0IDExLjAxNzcgOC4wODU2MUMxMS40NTUzIDcuNzM3NTMgMTEuNjc0MSA3LjI2NTEzIDExLjY3NDEgNi42Njg0MkMxMS42NzQxIDYuMTkxMDYgMTEuNTI0OSA1LjgxODExIDExLjIyNjUgNS41NDk1OUMxMC45MjgyIDUuMjcxMTMgMTAuNDU1OCA1LjEzMTkgOS44MDkzNiA1LjEzMTlIOC4xMDg3NEw3LjQ5NzExIDguNTkyODFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
    };

    // update element properties
    flowObj?.modeling.updateProperties(elementObj, data);
  }
}

// export components
export default {
  PropertyPanel: PropertyPanel,
  GetProperties: GetProperties,
  SetProperties: SetProperties
}