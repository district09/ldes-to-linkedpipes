import { newEngine } from '@treecg/actor-init-ldes-client';
import { LINKED_PIPES_ENDPOINT, LINKED_PIPES_PIPELINE, LDES_ENDPOINT }  from './config';
import LinkedPipesClient from './linked-pipes-client';
import HTTPResponseError from './http-response-error';

main();

const lpClient = new LinkedPipesClient(LINKED_PIPES_ENDPOINT);

function main() {
  try {
    let options = {
      "pollingInterval": 500, // millis
      "mimeType": "application/ld+json",
      "fromTime": new Date("2021-02-03T15:46:12.307Z"),
      "emitMemberOnce": true,
      "jsonLdContext": {
        "@context": [
          "https://data.vlaanderen.be/doc/applicatieprofiel/cultureel-erfgoed-object/kandidaatstandaard/2020-07-17/context/cultureel-erfgoed-object-ap.jsonld",
          "https://data.vlaanderen.be/context/persoon-basis.jsonld",
          "https://brechtvdv.github.io/demo-data/cultureel-erfgoed-event-ap.jsonld",
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
