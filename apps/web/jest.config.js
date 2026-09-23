const nextJest = require("next/jest");
const path = require("path");

const createJestConfig = nextJest({
  dir: "./",
});

const lucideCjsPath = path.resolve(__dirname, "../../node_modules/lucide-react/dist/cjs/lucide-react.js");

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^lucide-react$": lucideCjsPath,
  },
};

module.exports = createJestConfig(customJestConfig);
