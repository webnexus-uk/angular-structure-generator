function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Invalid JSON format.");
  }
}

function validateJSONStructure(jsonData) {
  console.log("validating json structure");
  if (jsonData.structure) {
    if (!Array.isArray(jsonData.structure)) {
      throw new Error(
        "Invalid JSON structure: 'structure' field is not an array."
      );
    }
    jsonData.structure.forEach((item) => {
      if (!("name" in item) || !("location" in item)) {
        throw new Error(
          "Invalid JSON structure: each element in 'structure' must have 'name' and 'location' fields."
        );
      }
    });
  }

  if (jsonData.shared) {
    if (typeof jsonData.shared !== "object") {
      throw new Error(
        "Invalid JSON structure: 'shared' field is not an object."
      );
    }
    Object.keys(jsonData.shared).forEach((key) => {
      if (!Array.isArray(jsonData.shared[key])) {
        throw new Error(
          `Invalid JSON structure: 'shared.${key}' field is not an array.`
        );
      }
    });
  }
}

module.exports = { parseJSON, validateJSONStructure };
