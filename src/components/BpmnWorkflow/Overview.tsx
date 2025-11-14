import { SessionData } from "@/libs/session";
import Button from "../Button"
import Textbox from '@/components/Textbox';
import Tags, { TagsType } from '@/components/Tags';
import { Preview } from "@/components/Markdown/Preview";

const source = `
# Seamless v4 Service Discovery

Seamless Service Discovery NPM package using NodeJS.

## Installation

\`\`\`sh
npm i seamless4-service-discovery
\`\`\`

## Importing the module in your application

Add the below code snippet in your Typescript application

\`\`\`javascript
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
\`\`\`

Add the below code snippet in your Javascript application

\`\`\`javascript
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
\`\`\`
`;

export default function Overview({ session }: { session: SessionData }) {
  const tagOnClick = (item: TagsType) => {
    console.log(item)
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between 1max-w-9xl mx-auto p-4 mb-4">
        <div className="prose dark:prose-invert prose-h1:font-bold prose-h1:text-[28px] prose-a:text-blue-600 prose-p:text-justify prose-img:rounded-xl -prose-headings:underline">
          <Preview source={source} theme={session.theme} />
        </div>
        <div className="lg:w-1/4 mt-16 lg:mt-0 border-l border-black/10 dark:border-white/10 pl-6">
          <div className="sticky top-[130px] z-[999]">
            <Tags tags={[
              { label: "Apple", value: "apple" },
              { label: "Mango", value: "mango" },
            ]} value={["mango"]} size="xs" rounded="full" onSelect={tagOnClick} />
          </div>
        </div>
      </div>
    </>
  )
}