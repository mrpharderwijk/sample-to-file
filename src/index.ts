#!/usr/bin/env node
import * as minimist from 'minimist';
import { sampleToFile } from './sample-to-file';

const argv = minimist(process.argv.slice(2));
const stf = sampleToFile(argv);

// initialize
if (stf) {
  stf.init();
}
