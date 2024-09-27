/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import {  vars } from "~~/frog-ui/ui";
import { saveBufferToMinio } from '~~/apa/minio';
import {generateImageModal} from '~~/apa/gaianet'

import { parseString } from "~~/lib/parseString";
const app = new Frog({
  // imageAspectRatio: '1:1',
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      //@ts-ignore
      headers: {
        "x-airstack-hubs": process.env.AIRSTACK_API_KEY,
      },
    },
  },
  ui: { vars },
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "SUPER FRAME",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
app.composerAction(
  "/farcastles",
  async c => {
    const data = c.actionData;

   
    return c.res({
      title: "farcastles attack reason",
      //@ts-ignore
      url: `${process.env.NEXT_PUBLIC_URL}/composer-farcastles`,
    });
  },
  {
   "name":"Farcastles",
   "icon":"book",
   "description":"Farcastles reason",
   "imageUrl":"https://paragraph.xyz/branding/logo_no_text.png"
  },
);
app.frame("/attacking", async c => {
 
  // return c.json(data)
  return c.res({
    image:  <div style={{ color: 'black', display: 'flex', fontSize: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%' }}>
    Select your fruit!
  </div>,
    intents: [
      (
        <Button.Link
          href={`https://warpcast.com/~/composer-actions?url=${encodeURIComponent(
             `${process.env.NEXT_PUBLIC_URL}/api/farcastles`,
          )}`}
        >
          try now
        </Button.Link>
      ) as any,
    ],
  });
});


app.hono.post("/imagine", async c => {
  const data = await c.req.json();
  const randomNumber = Math.floor(Math.random() * 1000000); // Generate a random integer between 0 and 999999
  const abuffer=await generateImageModal(encodeURIComponent(data.prompt))
  const buffer = Buffer.from(abuffer);
const papa=await saveBufferToMinio("image", "file-"+randomNumber, buffer);
  return c.json({ url: `https://minio.koisose.lol/image/${papa}` });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
