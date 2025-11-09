# Seamless v4 Service Discovery

Seamless Service Discovery NPM package using NodeJS.

## Installation

```sh
npm i seamless4-service-discovery
```

## Importing the module in your application

Add the below code snippet in your Typescript application

```javascript
// import seamless service discovery
import { Service, SrvRequest, SrvResponse } from "seamless4-service-discovery";

// get service instance
const service = Service({
  srvRegHost: "127.0.0.1", // Service Registry Host (required)
  srvRegPort: 1883, // Service Registry Port (default 1883)
  srvRegSSL: false, // Service Registry SSL (default false)
  srvRegUser: "user", // Service Registry User (optional)
  srvRegPass: "serect", // Service Registry Pass (optional)
  srvAppName: "Service Name", // Service Application Name (required)
  srvAppId: "unique-app-id", // Service Application ID (required)
  srvAppUrl: "http://127.0.0.1:3000", // Service Application URL (optional)
});

// define rest endpoint
service.app.get("/", async (req: SrvRequest, res: SrvResponse) => {
  res.send("response from service router...");
});

// define rest endpoint
service.app.get("/other", async (req: SrvRequest, res: SrvResponse) => {
  res.send("response from service router other...");
});

// run service
service.run();
```

Add the below code snippet in your Javascript application

```javascript
// import seamless service discovery
const { Service } = require("seamless4-service-discovery");

// get service instance
const service = Service({
  srvRegHost: "127.0.0.1", // Service Registry Host (required)
  srvRegPort: 1883, // Service Registry Port (default 1883)
  srvRegSSL: false, // Service Registry SSL (default false)
  srvRegUser: "user", // Service Registry User (optional)
  srvRegPass: "serect", // Service Registry Pass (optional)
  srvAppName: "Service Name", // Service Application Name (required)
  srvAppId: "unique-app-id", // Service Application ID (required)
  srvAppUrl: "http://127.0.0.1:3000", // Service Application URL (optional)
});

// define rest endpoint
service.app.get("/", async (req, res) => {
  res.send("response from service router...");
});

// define rest endpoint
service.app.get("/other", async (req, res) => {
  res.send("response from service router other...");
});

// run service
service.run();
```