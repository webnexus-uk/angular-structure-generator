const { executeCommand } = require("../utils/exec-utils");

function generateShared(shared) {
  const { services, components, interfaces, pipes } = shared;

  if (services) {
    services.forEach((service) => {
      console.log(`Generating shared service: ${service}`);
      executeCommand(`ng generate service shared/services/${service}`);
    });
  }

  if (components) {
    components.forEach((component) => {
      console.log(`Generating shared component: ${component}`);
      executeCommand(`ng generate component shared/components/${component}`);
    });
  }

  if (interfaces) {
    interfaces.forEach((interfaceName) => {
      console.log(`Generating shared interface: ${interfaceName}`);
      executeCommand(
        `ng generate interface shared/interfaces/${interfaceName}`
      );
    });
  }

  if (pipes) {
    pipes.forEach((pipe) => {
      console.log(`Generating shared pipe: ${pipe}`);
      executeCommand(`ng generate pipe shared/pipes/${pipe}`);
    });
  }
}

module.exports = { generateShared };
