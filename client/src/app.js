import "core-js/stable";
import "regenerator-runtime/runtime";

import { newEngine } from '@treecg/actor-init-ldes-client';
import {
  LINKED_PIPES_ENDPOINT,
  LINKED_PIPES_PIPELINE,
  LDES_ENDPOINT,
  DIRECT_PUSH,
  OUTPUT_FOLDER
}  from './config';
import LinkedPipesClient from './linked-pipes-client';
import HTTPResponseError from './http-response-error';
import skolemizeAndWriteData from './skolemizing-ldes-writer';
import path from 'path';


main();

const lpClient = new LinkedPipesClient(LINKED_PIPES_ENDPOINT);

function main() {
  let options = {
    "disablePolling": ! DIRECT_PUSH,
    "mimeType": "application/ld+json",
    "fromTime": new Date("2021-02-03T15:46:12.307Z"),
    "emitMemberOnce": true,
    "jsonLdContext": {
      "@context": [
        "https://raw.githubusercontent.com/StadGent/node_service_eventstream-api/master/src/public/context/persoon-basis.jsonld",
        "https://raw.githubusercontent.com/StadGent/node_service_eventstream-api/master/src/public/context/cultureel-erfgoed-event-ap.jsonld",
        "https://raw.githubusercontent.com/StadGent/node_service_eventstream-api/master/src/public/context/cultureel-erfgoed-object-ap.jsonld",
        {
          "dcterms:isVersionOf": {
            "@type": "@id"
          },
          "prov": "http://www.w3.org/ns/prov#",
        }
      ]
    }
  };
  if (DIRECT_PUSH) {
    options.pollingInterval = 500;
  }
  console.log('starting ldes client with options', options);
  try {
    let LDESClient = new newEngine();
    let eventstreamSync = LDESClient.createReadStream(LDES_ENDPOINT, options);
    eventstreamSync.on('data', async (data) => {
      try {
        if (DIRECT_PUSH) {
          const result = await lpClient.postData(LINKED_PIPES_PIPELINE, data);
          console.log(await result.text());
        }
        else {
          const now = new Date();
          const filename = path.join(OUTPUT_FOLDER, `${now.getTime()}.nt`);
          skolemizeAndWriteData(data, filename);
        }
      }
      catch(e) {
        console.error('something went wrong posting to linkedpipes',e);
        throw e;
      }
    });
    eventstreamSync.on('end', () => {
      console.log("No more data!");
      if (! DIRECT_PUSH) {
        lpClient.runPipeline(LINKED_PIPES_PIPELINE);
      }
    });
  } catch (e) {
    console.error(e);
  }
}
