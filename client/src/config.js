export const LDES_ENDPOINT = process.env.LDES_ENDPOINT || "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten";
export const LINKED_PIPES_PIPELINE= process.env.LINKED_PIPES_PIPELINE || "http://srvlodlppoc01.gentgrp.gent.be:8080/resources/pipelines/1621340292743";
export const LINKED_PIPES_ENDPOINT = process.env.LINKED_PIPES_ENDPOINT || "http://localhost:9080/";
export const DIRECT_PUSH = process.env.DIRECT_PUSH === "true";
export const OUTPUT_FOLDER = process.env.OUTPUT_FOLDER || './';
export const GRAPH_STORE_ENDPOINT = process.env.GRAPH_STORE_ENDPOINT;
export const GRAPH_STORE_USER = process.env.GRAPH_STORE_USER;
export const GRAPH_STORE_PASSWORD = process.env.GRAPH_STORE_PASSWORD;
export const GRAPH_STORE_GRAPH = process.env.GRAPH_STORE_GRAPH;

