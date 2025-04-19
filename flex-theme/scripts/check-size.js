#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Configuration
const MAX_SIZE_KB = 10; // 10KB limit
const BUNDLE_PATH = path.join(__dirname, '../dist/bundle.js');

// Check if file exists
if (!fs.existsSync(BUNDLE_PATH)) {
  console.error(`Error: Bundle file not found at ${BUNDLE_PATH}`);
  process.exit(1);
}

// Read the file
const fileContent = fs.readFileSync(BUNDLE_PATH);
console.log(`Original size: ${(fileContent.length / 1024).toFixed(2)} KB`);

// Gzip the content
const gzipped = zlib.gzipSync(fileContent);
const gzippedSize = gzipped.length / 1024;
console.log(`Gzipped size: ${gzippedSize.toFixed(2)} KB`);

// Check if size is within limit
if (gzippedSize > MAX_SIZE_KB) {
  console.error(`Error: Bundle size (${gzippedSize.toFixed(2)} KB) exceeds limit (${MAX_SIZE_KB} KB)`);
  process.exit(1);
} else {
  console.log(`Success: Bundle size (${gzippedSize.toFixed(2)} KB) is within limit (${MAX_SIZE_KB} KB)`);
  process.exit(0);
} 