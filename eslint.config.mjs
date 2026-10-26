import next from "eslint-config-next";

export default [
  { ignores: [".next/**", "out/**", "vendor/**", "node_modules/**", "components/annnimate/**"] },
  ...next,
];
