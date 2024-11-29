#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { generateAngularStructure } = require("./generators/angular-structure");
const { generateShared } = require("./generators/shared-resources");
const { updateRouting } = require("./generators/routing");
const { parseJSON, validateJSONStructure } = require("./utils/json-utils");

const jsonFile = process.argv[2];
if (!jsonFile) {
  console.error("Error: Please provide the path to the JSON file.");
  process.exit(1);
}

try {
  const jsonData = parseJSON(fs.readFileSync(path.resolve(jsonFile), "utf8"));
  // Validate JSON structure
  validateJSONStructure(jsonData);

  // Generate Angular structure
  generateAngularStructure(jsonData.structure);

  // Generate shared resources
  generateShared(jsonData.shared);

  // Update routing file
  updateRouting(jsonData.structure);

  console.log("Operation completed successfully.");
} catch (error) {
  console.error(`Error: ${error.message}`);
}
