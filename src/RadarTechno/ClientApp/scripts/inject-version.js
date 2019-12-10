const fs = require("fs");

const packageJson = require("../../../../package.json");
fs.writeFileSync(
  "./src/version.json",
  JSON.stringify({ version: packageJson.version })
);
