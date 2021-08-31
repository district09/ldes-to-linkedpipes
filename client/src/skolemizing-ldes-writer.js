import { Writer as WriterN3 } from 'n3';
import factory from '@rdfjs/dataset';
import { Readable } from 'stream';
import { writeFileSync } from 'fs';
import { v4 as uuid } from 'uuid';
import ParserJsonld from '@rdfjs/parser-jsonld';

export default function skolemizeAndWriteData(data, filename) {
  const parser = new ParserJsonld();
  const writer = new WriterN3();
  const dataset = factory.dataset();
  const blankToUriMap = new Map();
  const input =  new Readable({
    read: () => {
      input.push(data);
      input.push(null);
    }
  });

  const output = parser.import(input);

  output.on('data', (quad) => {
    if (quad) {
      if (quad.subject.termType == "BlankNode") {
        quad.subject = getUriForBlank(blankToUriMap, quad.subject);
      }
      if (quad.object.termType == "BlankNode") {
        quad.object = getUriForBlank(blankToUriMap, quad.object);
      }
      writer.addQuad(quad);
    }
  });
  output.on('error', (error) => console.error(error));
  output.on('end', () => {
    console.log(`writing to ${filename}`);
    writer.end((error, result) => writeFileSync(filename, result, { encoding: 'utf-8'}));
  });
}

function getUriForBlank(map, blankNode) {
  // note using blankNode.value atm
  let uri = map.get(blankNode.value);
  if (!uri) {
    uri = factory.namedNode(`https://stad.gent/id/.well-known/skolem/{uuid()}`);
    map.set(blankNode.value, uri);
  }
  return uri;
}

