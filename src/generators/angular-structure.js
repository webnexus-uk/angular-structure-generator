const path = require("path");
const { executeCommand } = require("../utils/exec-utils");

function generateAngularStructure(nodes, parentPath = "") {
  nodes.forEach((node) => {
    const { name, location, children } = node;
    const modulePath = path.join(
      parentPath,
      location.includes(":")
        ? name.toLowerCase()
        : location || name.toLowerCase()
    );

    try {
      console.log(`Generating module: ${name}`);
      executeCommand(`ng generate module ${modulePath}`);
      executeCommand(`ng generate component ${modulePath}/${name}`);
    } catch (error) {
      console.error(`Error generating module/component: ${error.message}`);
    }

    if (children && children.length > 0) {
      generateAngularStructure(children, modulePath);
    }
  });
}

module.exports = { generateAngularStructure };
