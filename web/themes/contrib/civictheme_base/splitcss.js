import fs from 'fs';
import { globSync } from 'glob';
import {compileString} from 'sass';

// Args - allow subtheme generation from this file.
const isSubtheme = process.argv?.[2] === '--subtheme';

// Variables.
const componentDir = './components/';
const fullComponentDir = isSubtheme ? './components_combined/' : componentDir;
const baseOutDir = './dist/components';
const cssHeader = '/**\n * This file was automatically generated. Please run `npm run dist` to update.\n */\n\n';
const cssFooter = '\nimg \{\n  display: block;\n  max-width: 100%;\n  height: auto;\n\}\n\n';

// Get Mixin file paths.
const mixins = globSync(`00-base/mixins/**/*.scss`, { cwd: fullComponentDir });

// Get Base style file paths (ignore mixins, reset, variables, and stories).
const base = globSync(`00-base/!(mixins)/!(*.stories|variables|_variables.*|reset).scss`, { cwd: fullComponentDir });

// Generate the base.css file.
const baseData = `
  @import '00-base/variables';
  ${
    [...mixins, ...base].map(path => `@import '${path}';`).join('\n')
  }
  @import 'style.css_variables';
`;
const baseResult = compileString(baseData, { loadPaths: [fullComponentDir] });
fs.writeFileSync(`${baseOutDir}/base.css`, cssHeader + baseResult.css);

// Get component file paths.
const atoms = globSync(`01-atoms/**/*.scss`, { cwd: componentDir });
const molecules = globSync(`02-molecules/**/*.scss`, { cwd: componentDir });
const organisms = globSync(`03-organisms/**/*.scss`, { cwd: componentDir });
const templates = globSync(`04-templates/**/*.scss`, { cwd: componentDir });

const fileList = [
  ...atoms,
  ...molecules,
  ...organisms,
  ...templates,
];

fileList.forEach(filePath => {
  const separator = filePath.lastIndexOf('/') + 1;
  const styleDir = filePath.substring(0, separator);
  const styleName = filePath.substring(separator, filePath.lastIndexOf('.'));

  // Create a sass header to import base mixins.
  const styleData = `
    @import '00-base/variables';
    ${
      mixins.map(path => `@import '${path}';`).join('\n')
    }
    @import '${filePath}';
  `;

  // Compile SCSS.
  const result = compileString(styleData, { loadPaths: [fullComponentDir] });

  // Write to directory.
  console.log(`Writing css file: ${baseOutDir}${styleDir}${styleName}.css`);
  fs.mkdirSync(`${baseOutDir}${styleDir}`, { recursive: true });
  fs.writeFileSync(`${baseOutDir}${styleDir}${styleName}.css`, cssHeader + result.css);
});
