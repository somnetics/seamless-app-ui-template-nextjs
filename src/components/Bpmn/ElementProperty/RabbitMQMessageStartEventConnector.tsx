import { ChangeEventHandler } from "react";
import { randomKey, uuid } from "@/libs/functions";
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
        Authentication
      </p>
      <div className="col-12 mb-3">
        <label htmlFor="authType" className="form-label">
          Connection Type
        </label>
        <select className="form-control" id="authType" name="authType" value={property.authType}>
          <option value="uri">URI</option>
          <option value="">Username / Password</option>
        </select>
      </div>
      <div className="col-12 mb-3">
        <label htmlFor="url" className="form-label">
          Uri
        </label>
        {/* <AutoComplete
          endpoint="/api/service/registry/endpoints"
          searchField="name"
          descriptionField="uri"
          name="url"
          id="url"
          value={property.url ?? ""}
          placeholder="Enter Url"
          required={false}
          readOnly={readonly}
          maxHeight="316px"
          onSelected={(item: any) => {
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
          render={(item: any, highlighted: any, query) => {
            return (
              <div className="d-flex align-items-center pe-none">
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
        /> */}
      </div>
      {/* <div className="col-12 mb-3">
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
      </div> */}
      {/* {property.method.trim() !== "" && property.method !== "GET" && property.method !== "DELETE" ? <div className="col-12">
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
        : ""} */}
      {/* <div className="col-12">
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
      </div> */}
      {/* <div className="col-12">
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
      </div> */}
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
            placeholder='{"message": message}'
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
    // console.log(businessObject.extensionElements)
    // set zeebe io mapping default values
    // const zeebeIoMappingValues: any = {
    //   url: "",
    //   method: "GET",
    //   queryParameters: "",
    //   headers: "",
    // };

    // // set zeebe task headers default values
    // const zeebeTaskHeaderValues: any = {
    //   resultVariable: "",
    //   resultExpression: `{"body": body}`,
    // };

    // // if extension elements exists
    // if (typeof businessObject.extensionElements !== "undefined") {
    //   // get zeebe io mapping
    //   const zeebeIoMapping = businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:iomapping");

    //   // let zeebe inputs
    //   let zeebeInputs = [];

    //   // check for inputParameters / children
    //   if (typeof zeebeIoMapping[0].inputParameters !== "undefined") {
    //     // get zeebe inputs
    //     zeebeInputs = zeebeIoMapping[0].inputParameters.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:input");
    //   } else if (typeof zeebeIoMapping[0].$children !== "undefined") {
    //     // get zeebe inputs
    //     zeebeInputs = zeebeIoMapping[0].$children.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:input");
    //   }

    //   // loop zeebe inputs
    //   zeebeInputs.forEach((zeebeInput: any) => {
    //     // get input value
    //     zeebeIoMappingValues[zeebeInput.target] = zeebeInput.target == "queryParameters" || zeebeInput.target == "headers" || zeebeInput.target == "body" ? zeebeInput.source.substring(1) : zeebeInput.source;
    //   });

    //   // get zeebe task headers
    //   const zeebeTaskHeaders = businessObject.extensionElements.values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:taskheaders");

    //   // let zeebe headers
    //   let zeebeHeaders = [];

    //   // // check for inputParameters / children
    //   if (typeof zeebeTaskHeaders[0].values !== "undefined") {
    //     // get zeebe headers
    //     zeebeHeaders = zeebeTaskHeaders[0].values.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:header");
    //   } else if (typeof zeebeTaskHeaders[0].$children !== "undefined") {
    //     // get zeebe headers
    //     zeebeHeaders = zeebeTaskHeaders[0].$children.filter((zeebeProps: any) => zeebeProps.$type.toLowerCase() === "zeebe:header");
    //   }

    //   // loop zeebe headers
    //   zeebeHeaders.forEach((zeebeHeader: any) => {
    //     // get header value
    //     zeebeTaskHeaderValues[zeebeHeader.key] = zeebeHeader.key == "resultExpression" ? zeebeHeader.value.substring(1) : zeebeHeader.value;
    //   });
    // }

    // // update property
    // properties = {
    //   ...elementProp,
    //   ...zeebeIoMappingValues,
    //   ...zeebeTaskHeaderValues,
    // };
  }

  // return element properties
  return properties;
}

// set element properties
const SetProperties = (elementObj: any, flowObj: any, businessObject: any, property: any) => {
  // if sequence flow
  if (typeof businessObject !== "undefined") {
    // io mapping
    const Properties = flowObj?.createZeebeModdleElement("zeebe:Properties", {}, businessObject);

    // zeebe properties
    const inboundType = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "inbound.type", value: "io.camunda:connector-rabbitmq-inbound:1" }, Properties);
    const exchange = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "exchange", value: "seamless4" }, Properties);
    const routingKey = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "routingKey", value: "seamlessRoutekey" }, Properties);
    const queueName = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "queueName", value: "seamlessQueue" }, Properties);
    const authType = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "authentication.authType", value: "uri" }, Properties);
    const uri = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "authentication.uri", value: "amqp://rmquser:rmqpass@172.30.10.10:5672" }, Properties);
    const consumerTag = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "consumerTag", value: "" }, Properties);
    const exclusive = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "exclusive", value: "false" }, Properties);
    const correlationRequired = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "correlationRequired", value: "notRequired" }, Properties);
    const deduplicationMode = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "deduplicationMode", value: "AUTO" }, Properties);
    const resultVariable = flowObj?.createZeebeModdleElement("zeebe:Property", { name: "resultVariable", value: "" }, Properties);

    // input parameters
    const properties: any = [
      inboundType,
      exchange,
      routingKey,
      queueName,
      authType,
      uri,
      consumerTag,
      exclusive,
      correlationRequired,
      deduplicationMode,
      resultVariable
    ];

    // check for empty expression
    if (typeof property.resultExpression !== "undefined" && property.resultExpression.trim() !== "") {
      // set result expression
      const resultExpression = flowObj?.createZeebeModdleElement("zeebe:Property", { key: "resultExpression", value: `=${property.resultExpression}`, }, Properties);

      // push attributes
      properties.push(resultExpression);
    }

    // uodate io mapping
    flowObj?.modeling.updateModdleProperties(elementObj, Properties, { properties: properties });

    // extension elements
    const extensionElements = flowObj?.createModdleElement("bpmn:ExtensionElements", { values: [Properties] }, businessObject);

    // get bpmn definitions
    const definition = flowObj?.canvas.getRootElement().businessObject.$parent;

    // message reference 
    const Message = flowObj?.createModdleElement("bpmn:Message", { id: `Message_${randomKey()}`, name: uuid(), "zeebe:modelerTemplate": "io.camunda.connectors.inbound.RabbitMQ.MessageStart.v1" }, definition);

    // event definations
    const eventDefinitions = flowObj?.createModdleElement("bpmn:MessageEventDefinition", { id: `MessageEventDefinition_${randomKey()}`, messageRef: Message }, businessObject);

    // update extension elements
    flowObj?.modeling.updateModdleProperties(elementObj, businessObject, { extensionElements });

    // element properties
    const data = {
      "zeebe:modelerTemplate": "io.camunda.connectors.inbound.RabbitMQ.MessageStart.v1",
      "zeebe:modelerTemplateVersion": "7",
      "zeebe:modelerTemplateIcon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxOCcgaGVpZ2h0PScxOCcgdmlld0JveD0nLTcuNSAwIDI3MSAyNzEnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaWRZTWlkJz4KICAgIDxwYXRoIGQ9J00yNDUuNDQgMTA4LjMwOGgtODUuMDlhNy43MzggNy43MzggMCAwIDEtNy43MzUtNy43MzR2LTg4LjY4QzE1Mi42MTUgNS4zMjcgMTQ3LjI5IDAgMTQwLjcyNiAwaC0zMC4zNzVjLTYuNTY4IDAtMTEuODkgNS4zMjctMTEuODkgMTEuODk0djg4LjE0M2MwIDQuNTczLTMuNjk3IDguMjktOC4yNyA4LjMxbC0yNy44ODUuMTMzYy00LjYxMi4wMjUtOC4zNTktMy43MTctOC4zNS04LjMyNWwuMTczLTg4LjI0MUM1NC4xNDQgNS4zMzcgNDguODE3IDAgNDIuMjQgMEgxMS44OUM1LjMyMSAwIDAgNS4zMjcgMCAxMS44OTRWMjYwLjIxYzAgNS44MzQgNC43MjYgMTAuNTYgMTAuNTU1IDEwLjU2SDI0NS40NGM1LjgzNCAwIDEwLjU2LTQuNzI2IDEwLjU2LTEwLjU2VjExOC44NjhjMC01LjgzNC00LjcyNi0xMC41Ni0xMC41Ni0xMC41NnptLTM5LjkwMiA5My4yMzNjMCA3LjY0NS02LjE5OCAxMy44NDQtMTMuODQzIDEzLjg0NEgxNjcuNjljLTcuNjQ2IDAtMTMuODQ0LTYuMTk5LTEzLjg0NC0xMy44NDR2LTI0LjAwNWMwLTcuNjQ2IDYuMTk4LTEzLjg0NCAxMy44NDQtMTMuODQ0aDI0LjAwNWM3LjY0NSAwIDEzLjg0MyA2LjE5OCAxMy44NDMgMTMuODQ0djI0LjAwNXonCiAgICAgICAgICBmaWxsPScjRjYwJy8+Cjwvc3ZnPg==",
      eventDefinitions: [eventDefinitions]
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