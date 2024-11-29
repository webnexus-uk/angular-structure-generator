function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Invalid JSON format.");
  }
}

module.exports = { parseJSON };
