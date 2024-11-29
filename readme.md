# Angular Structure Generator

**Streamline Angular Development with Automation**

The Angular Structure Generator simplifies the creation of Angular applications by automating the generation of modules, components, and services based on a JSON configuration. This tool is perfect for developers looking to save time and maintain a consistent project structure.

## Key Features

- **Effortless Scaffolding**: Generate Angular modules, components, and services in seconds.
- **Dynamic Routing Integration**: Automatically update the `app-routing.module.ts` file with generated routes.
- **Shared Resources**: Create shared services, components, interfaces, and pipes from a single configuration.
- **Flexible Configuration**: Control the structure of your Angular application with an intuitive JSON schema.

With Angular Structure Generator, you can focus on building your app's core functionality while we take care of the repetitive scaffolding tasks. Jumpstart your next Angular project with ease and precision!

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)

## Installation

To install globally using npm:

```bash
npm install -g  @codingnexus/angular-structure-generator
```

Or use it directly via `npx`:

```bash
npx angular-structure-generator <path-to-json-file>
```

## Usage

To generate Angular modules, components, and services, run the following command:

```bash
npx angular-structure-generator ./structure.json
```

### Example:

1. Save the following JSON structure to `structure.json`:

   ```json
   {
     "structure": [
       {
         "name": "Home",
         "location": ""
       },
       {
         "name": "About",
         "location": "about"
       },
       {
         "name": "Products",
         "location": "products",
         "children": [
           {
             "name": "Product",
             "location": ":id",
             "children": []
           }
         ]
       }
     ],
     "shared": {
       "services": ["api", "auth"],
       "components": ["menu", "footer"],
       "interfaces": ["user", "product"],
       "pipes": ["capitalize", "time", "date"]
     }
   }
   ```

2. Run the command:

   ```bash
   npx angular-structure-generator ./structure.json
   ```

3. Generated Output:
   - Angular modules (e.g., `home.module.ts`, `about.module.ts`, `products.module.ts`, `product.module.ts`)
   - Components (e.g., `home.component.ts`, `about.component.ts`, `products.component.ts`, `product.component.ts`)
   - Shared services (`api.service.ts`, `auth.service.ts`)
   - Shared components (`menu.component.ts`, `footer.component.ts`)
   - Shared interfaces (`user.ts`, `product.ts`)
   - Shared pipes (`capitalize.pipe.ts`, `time.pipe.ts`, `date.pipe.ts`)
   - Updated `app-routing.module.ts` with routes.

## Features

- Generates Angular modules, components, and services based on the provided JSON structure.
- Updates the Angular routing module with the generated structure.
- Supports shared services, components, interfaces, and pipes.

## License

This project is licensed under the ISC License.
