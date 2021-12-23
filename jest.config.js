module.exports = {
  roots: ["<rootDir>/test/unit"],
  testMatch: ["**/*.test.ts"],
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["text-summary"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
},
};
