import globals from "globals";


export default [
  js.configs.recommended,
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: 
    { globals: {
        ...globals.node,
      },
      ecmaVersion: latest,
    }},
];