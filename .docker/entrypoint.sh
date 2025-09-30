#!/bin/bash

# For development, dependencies are already installed in the image
# npm install  # Commented out since node_modules is mounted

npm run build
npm run migration:run
npm run start:dev