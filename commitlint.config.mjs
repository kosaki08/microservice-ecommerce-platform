export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "test", "chore", "revert", "perf", "build", "ci"]],
    "subject-case": [0],
  },
};
