// // pages/api/sse.ts
// import type { NextApiRequest } from 'next';

// // define sse client
// type SSEClient = {
//   id: number;
//   res: any;
// };

// // define sse clients
// if (!globalThis.sseClients) {
//   globalThis.sseClients = [];
// }

// // let client
// let clients: SSEClient[] = globalThis.sseClients;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default function handler(req: NextApiRequest, res: any) {
//   // Setup SSE headers
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'X-Accel-Buffering': 'no',
//     'Connection': 'keep-alive',
//   });

//   // create client id
//   const clientId = Date.now();

//   // write data
//   res.write(`data: ${JSON.stringify({ event: "connected", clientId: clientId })}\n\n`);

//   // flush response
//   res.flush();

//   // create client
//   const newClient: SSEClient = { id: clientId, res: res };

//   // register new  client
//   clients.push(newClient);

//   // Cleanup when client disconnects
//   req.on('close', () => {
//     // update client
//     clients = clients.filter(c => c.id !== newClient.id);

//     // end connection
//     res.end();
//   });
// }

// // Export broadcast function for other API routes to use
// export function broadcast(data: any) {  
//   clients.forEach((client) => {
//     // write data
//     client.res.write(`data: ${JSON.stringify(data)}\n\n`);

//     // flush response
//     client.res.flush();
//   });
// }
