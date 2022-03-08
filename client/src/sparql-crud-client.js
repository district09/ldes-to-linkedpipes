import FormData from 'form-data';
import fetch from 'node-fetch';
import HTTPResponseError from './http-response-error';
import DigestFetch from 'digest-fetch';

export default class GraphStoreClient {
  constructor(endpoint, username, password) {
    this.endpoint = endpoint.endsWith('?') ? endpoint : `${endpoint}?`;
    if (username || password)
      this.client = new DigestFetch(username, password);
  }

  async post(graph, body) {
    const url = `${this.endpoint}graph-uri=${encodeURIComponent(graph)}`;
    return await this.client.fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/turtle"
      },
      body
    });
  }

  async delete(graph) {
    const url = `${this.endpoint}graph-uri=${encodeURIComponent(graph)}`;
    return await this.client.fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ${this.auth}'
      }
    });
  }
  async put(graph, body) {
    await this.delete(graph);
    return await this.put(graph,triples);
  }
}
