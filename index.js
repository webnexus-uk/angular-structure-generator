#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Read JSON file
const jsonFile = process.argv[2];
if (!jsonFile) {
  console.error("Error: Please provide the path to the JSON file.");
  process.exit(1);
}

const jsonData = JSON.parse(fs.readFileSync(path.resolve(jsonFile), "utf8"));

// Generate Angular Modules, Components, and Services
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
      execSync(`ng generate module ${modulePath}`);
      execSync(`ng generate component ${modulePath}/${name}`);
    } catch (error) {
      console.error(`Error generating module/component: ${error.message}`);
    }

    // Recursively process child nodes
    if (children && children.length > 0) {
      generateAngularStructure(children, modulePath);
    }
  });
}

// Update Routing File
function updateRouting(nodes, routes, parentPath = "") {
  nodes.forEach((node) => {
    const { name, location, children } = node;
    const fullPath = parentPath
      ? `${parentPath}/${location}`
      : location || name.toLowerCase();
    const importPath = parentPath
      ? `${parentPath}/${
          location.includes(":")
            ? name.toLowerCase()
            : location || name.toLowerCase()
        }`
      : location.includes(":")
      ? name.toLowerCase()
      : location || name.toLowerCase();
    const route = `{
      path: '${fullPath}',
      loadChildren: () => import('./${importPath}/${name.toLowerCase()}.module').then(m => m.${name}Module)
    }`;
    routes.push(route);

    // Recursively update routes for child nodes
    if (children && children.length > 0) {
      updateRouting(children, routes, fullPath);
    }
  });
}

// Create Shared Services and Components
function generateShared(shared) {
  const { services, components, interfaces, pipes } = shared;
  if (services && Array.isArray(services)) {
    services.forEach((service) => {
      try {
        console.log(`Generating shared service: ${service}`);
        execSync(`ng generate service shared/services/${service}/${service}`);
      } catch (error) {
        console.error(`Error generating service: ${error.message}`);
      }
    });
  }
  if (components && Array.isArray(components)) {
    components.forEach((component) => {
      try {
        console.log(`Generating shared component: ${component}`);
        execSync(`ng generate component shared/components/${component}`);
      } catch (error) {
        console.error(`Error generating component: ${error.message}`);
      }
    });
  }
  if (interfaces && Array.isArray(interfaces)) {
    interfaces.forEach((interfaceName) => {
      try {
        console.log(`Generating shared interface: ${interfaceName}`);
        execSync(
          `ng generate interface shared/interfaces/${interfaceName}/${interfaceName}`
        );
      } catch (error) {
        console.error(`Error generating interface: ${error.message}`);
      }
    });
  }
  if (pipes && Array.isArray(pipes)) {
    pipes.forEach((pipe) => {
      try {
        console.log(`Generating shared pipe: ${pipe}`);
        execSync(`ng generate pipe shared/pipes/${pipe}/${pipe}`);
      } catch (error) {
        console.error(`Error generating pipe: ${error.message}`);
      }
    });
  }
}

// Main Function
(function main() {
  try {
    // Generate Angular structure from JSON
    generateAngularStructure(jsonData.structure);

    // Generate shared services and components
    generateShared(jsonData.shared);

    // Update the routing module
    const routingFilePath = path.resolve(
      process.cwd(), // Ensure it points to the current working directory
      "src",
      "app",
      "app-routing.module.ts"
    );
    let routingFileContent = fs.readFileSync(routingFilePath, "utf8");

    // Extract existing routes and append new ones
    const existingRoutesMatch = routingFileContent.match(
      /const routes: Routes = \[(.*?)\]/s
    );
    const existingRoutes = existingRoutesMatch
      ? existingRoutesMatch[1].trim()
      : "";
    const routes = existingRoutes ? [existingRoutes] : [];
    updateRouting(jsonData.structure, routes);
    const routesString = routes.join(",");

    // Insert new routes into the routing file
    routingFileContent = routingFileContent.replace(
      /const routes: Routes = \[/,
      `const routes: Routes = [
${routesString},`
    );
    fs.writeFileSync(routingFilePath, routingFileContent);

    console.log("Routing file updated successfully.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
