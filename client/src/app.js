import "core-js/stable";
import "regenerator-runtime/runtime";

import { newEngine } from '@treecg/actor-init-ldes-client';
import {
  LINKED_PIPES_ENDPOINT,
  LINKED_PIPES_PIPELINE,
  GRAPH_STORE_ENDPOINT,
  GRAPH_STORE_USER,
  GRAPH_STORE_PASSWORD,
  GRAPH_STORE_GRAPH,
  LDES_ENDPOINT,
  DIRECT_PUSH,
  OUTPUT_FOLDER
}  from './config';
import SPARQLCrudClient from './sparql-crud-client';
import LinkedPipesClient from './linked-pipes-client';
import HTTPResponseError from './http-response-error';
import skolemizeAndWriteData, {skolemizeData} from './skolemizing-ldes-writer';
import path from 'path';

let virtClient;
let lpClient;
if (DIRECT_PUSH) {
  virtClient = new SPARQLCrudClient(GRAPH_STORE_ENDPOINT, GRAPH_STORE_USER,GRAPH_STORE_PASSWORD);
}
else {
  lpClient = new LinkedPipesClient(LINKED_PIPES_ENDPOINT);
}

main();

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
    options.pollingInterval = 60000;
    virtClient.delete(GRAPH_STORE_GRAPH);
  }
  console.log('starting ldes client with options', options);
  try {
    let LDESClient = new newEngine();
    let eventstreamSync = LDESClient.createReadStream(LDES_ENDPOINT, options);
    eventstreamSync.on('data', async (data) => {
      try {
        if (DIRECT_PUSH) {
          const triples = await skolemizeData(data);
          const result = await  virtClient.post(GRAPH_STORE_GRAPH, triples);
          console.log(await result.text());
          await timeout(1000);
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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
