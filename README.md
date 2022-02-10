# ldes-to-linkedpipes

This app can run in two modes `DIRECT_PUSH` pushes directly to a virtuoso endpoint. Or it can work in batched mode, collecting all data in a directory and starting an LDES pipeline to process the data when it's finished.

## configuration
The following environment variables are available

 * `LDES_ENDPOINT`: the linked data event stream endpoint to query, defaults to "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten"
 * `DIRECT_PUSH`: if set to "true" push all received data directly to virtuoso, else save to OUTPUT_FOLDER and execute linked pipes pipeline when finished. 

For direct push mode:
* `GRAPH_STORE_ENDPOINT`: endpoint supporting the [graph store protocol](https://www.w3.org/TR/sparql11-http-rdf-update/)
* `GRAPH_STORE_USER`: (optional) username to authenticate with
* `GRAPH_STORE_PASSWORD`: (optional) password to authenticate with

For batch mode:
 * `LINKED_PIPES_ENDPOINT`: the linked pipes endpoint to connect to, defaults to "http://localhost:9080/"
 * `LINKED_PIPES_PIPELINE`: the linked pipes pipeline to run, defaults to "http://srvlodlppoc01.gentgrp.gent.be:8080/resources/pipelines/1621340292743"
 * `OUTPUT_FOLDER`: where to write the output if DIRECT_PUSH is false
 
