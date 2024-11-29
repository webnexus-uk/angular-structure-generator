const fs = require("fs");
const path = require("path");

function updateRouting(nodes, routes = new Map(), parentPath = "") {
  nodes.forEach((node) => {
    const { name, location, children } = node;

    // Generate the full path for the route
    const fullPath = parentPath
      ? `${parentPath}/${location}`
      : location || name.toLowerCase();

    // Generate the import path, handling cases where `location` includes ":"
    const importPath = parentPath
      ? `${parentPath}/${
          location && location.includes(":")
            ? name.toLowerCase()
            : location || name.toLowerCase()
        }`
      : location && location.includes(":")
      ? name.toLowerCase()
      : location || name.toLowerCase();

    // Define the route
    const route = `{
      path: '${fullPath}',
      loadChildren: () => import('./${importPath}/${name.toLowerCase()}.module').then((m) => m.${name}Module)
    }`;

    // Avoid duplicate routes by using a Map to store unique paths
    if (!routes.has(fullPath)) {
      routes.set(fullPath, route);
    }

    // Recursively update routes for child nodes
    if (children && children.length > 0) {
      updateRouting(children, routes, fullPath);
    }
  });

  // Update the routing file
  const routingFilePath = path.resolve("src", "app", "app-routing.module.ts");
  let routingFileContent = fs.readFileSync(routingFilePath, "utf8");

  // Extract existing routes from the routing file
  const existingRoutesMatch = routingFileContent.match(
    /const routes: Routes = \[(.*?)\]/s
  );
  const existingRoutes = existingRoutesMatch
    ? existingRoutesMatch[1].trim()
    : "";

  // Merge existing routes with new routes and ensure no duplicates
  const allRoutesSet = new Map(); // Using a map for uniqueness
  if (existingRoutes) {
    existingRoutes.split(/},\s*/).forEach((route) => {
      if (route.trim()) {
        const cleanedRoute = `${route.replace(/},*$/, "}")}`; // Cleanup trailing commas and extra brackets
        const pathMatch = cleanedRoute.match(/path:\s*'(.*?)'/);
        if (pathMatch) {
          const path = pathMatch[1];
          allRoutesSet.set(path, cleanedRoute);
        }
      }
    });
  }

  // Add new routes to the set
  routes.forEach((route, path) => {
    allRoutesSet.set(path, route); // Always set to ensure the latest route definition is used
  });

  // Prepare the final routes string
  const allRoutes = Array.from(allRoutesSet.values());
  const routesString = allRoutes.join(",\n  ");

  // Update the routing file content
  routingFileContent = routingFileContent.replace(
    /const routes: Routes = \[.*?\]/s,
    `const routes: Routes = [\n  ${routesString}\n];`
  );

  fs.writeFileSync(routingFilePath, routingFileContent);
  console.log("Routing file updated successfully.");

  // Clean up multiple semicolons
  cleanUpSemicolons(routingFilePath);
}

function cleanUpSemicolons(filePath) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  fileContent = fileContent.replace(/;{2,}/g, ";");
  fs.writeFileSync(filePath, fileContent);
  console.log("Cleaned up multiple semicolons in the routing file.");
}

module.exports = { updateRouting };
