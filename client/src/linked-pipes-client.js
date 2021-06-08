import FormData from 'form-data';
import fetch from 'node-fetch';
import HTTPResponseError from './http-response-error';

const JSON_MESSAGE = {
  "@id": "http://localhost/base",
  "@type" : "http://etl.linkedpipes.com/ontology/ExecutionOptions",
  "http://linkedpipes.com/ontology/deleteWorkingData" : false,
  "http://linkedpipes.com/ontology/saveDebugData" : true,
  "http://linkedpipes.com/ontology/logPolicy" : {
    "@id" : "http://linkedpipes.com/ontology/log/Preserve"
  }
};
const MAX_TRIES = 5;
export default class LinkedPipesClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async postData(pipeline, data, tries = 0) {
    const form = new FormData();
    form.append('input', data);
    form.append('options', JSON.stringify(JSON_MESSAGE));
    const url = `${this.endpoint}/resources/executions?pipeline=${pipeline}`;
    try {
      console.log("posting to linkedpipes");
      const result = await fetch(url, { method: 'POST', body: form, headers: form.getHeaders() });
      console.log("linkedpipes result:", result.status);
      console.log(await result.text());
      if (!result.ok) {
        throw new HTTPResponseError(result);
      }
      return result;
    }
    catch(e) {
      if (tries < MAX_TRIES) {
        console.error(e);
        console.log(`retrying post to linkedpipes ${MAX_TRIES-tries} more times`);
        return this.postData(pipeline, data, tries + 1);
      }
      else {
        console.error(e);
        throw e;
      }
    }
  }
}
