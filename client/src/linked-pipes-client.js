import FormData from 'form-data';
import fetch from 'node-fetch';
import HTTPResponseError from './http-response-error';

const JSON_MESSAGE = {
      configuration: {
        "@context": { "@vocab": "http://etl.linkedpipes.com/ontology/" },
        "@id": "http://localhost/base",
        "@type": "http://etl.linkedpipes.com/ontology/ExecutionOptions",
        deleteWorkingData: true,
        saveDebugData: false,
        logPolicy: { "@id":"http://linkedpipes.com/ontology/log/DeleteOnSuccess" }
      }
};

const MAX_TRIES = 5;
export default class LinkedPipesClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async runPipeline(pipeline, tries = 0) {
    const url = `${this.endpoint}/resources/executions?pipeline=${pipeline}`;
    try {
      const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(JSON_MESSAGE),
        contentType: "application/json"
      });
      if (!result.ok) {
        throw new HTTPResponseError(result);
      }
      return result;
    }
    catch(e) {
      if (tries < MAX_TRIES) {
        console.error(e);
        console.log(`retrying to run pipeline ${MAX_TRIES-tries} more times`);
        return this.runPipeline(pipeline, tries + 1);
      }
      else {
        console.error(e);
        throw e;
      }
    }
  }

  async postData(pipeline, data, tries = 0) {
    const form = new FormData();
    form.append('input', data);
    form.append('options', JSON.stringify(JSON_MESSAGE));
    form.append('pipeline', JSON.stringify({
      "@id": pipeline
    }));
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
