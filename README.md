# ldes-to-linkedpipes

A docker-compose project that run a ldes client and pushes received data to a linked pipes pipeline. The pipeline should have a [pipeline input component](https://etl.linkedpipes.com/components/e-pipelineinput) at the start of its chain.

## configuration
The following environment variables are available
 
 * `LDES_ENDPOINT`: the linked data event stream endpoint to query, defaults to "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten"
 * `LINKED_PIPES_ENDPOINT`: the linked pipes endpoint to connect to, defaults to "http://localhost:9080/"
 * `LINKED_PIPES_PIPELINE`: the linked pipes pipeline to run, defaults to "http://srvlodlppoc01.gentgrp.gent.be:8080/resources/pipelines/1621340292743"
 * `DIRECT_PUSH`: if set to "true" push all received data directly to linkedpipes, else save to OUTPUT_FOLDER. 
 * `OUTPUT_FOLDER`: where to write the output if DIRECT_PUSH is false
 
