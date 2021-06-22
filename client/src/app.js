import { newEngine } from '@treecg/actor-init-ldes-client';
import { LINKED_PIPES_ENDPOINT, LINKED_PIPES_PIPELINE, LDES_ENDPOINT }  from './config';
import LinkedPipesClient from './linked-pipes-client';
import HTTPResponseError from './http-response-error';

main();

const lpClient = new LinkedPipesClient(LINKED_PIPES_ENDPOINT);

function main() {
  try {
    let options = {
      "disablePolling": true,
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
            "prov": "http://www.w3.org/ns/prov#"
          }
        ]
      }
    };
    let LDESClient = new newEngine();
    let eventstreamSync = LDESClient.createReadStream(LDES_ENDPOINT, options);
    eventstreamSync.on('data', async (data) => {
      console.log("received data");
      try {
        const result = await lpClient.postData(LINKED_PIPES_PIPELINE, data);
        console.log(await result.text());
      }
      catch(e) {
        console.error('something went wrong posting to linkedpipes',e);
        throw e;
      }
    });
    eventstreamSync.on('end', () => {
      console.log("No more data!");
    });
  } catch (e) {
    console.error(e);
  }
}
