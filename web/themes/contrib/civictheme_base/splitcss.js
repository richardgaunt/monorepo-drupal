import fs from 'fs';
import { dirname } from 'path';
import { globSync } from 'glob';
import { compileString } from 'sass';

// Constants.
const cssHeader = '/**\n * This file was automatically generated. Please run `npm run dist` to update.\n */\n\n';

/**
 * Gets the component directory.
 *
 * @param {boolean} isBaseTheme - whether the theme is a base theme.
 *
 * @return {string} - directory path for components.
 */
export function getComponentDirectory(isBaseTheme) {
  return isBaseTheme ? './components/' : './components_combined/';
}

/**
 * Generates base CSS styles by combining mixins and base SCSS files into a single compiled CSS file.
 *
 * @param {boolean} isBaseTheme - Determines whether the base theme directory should be used.
 * @param {string} baseOutDir - The output directory where the generated base.css file will be saved.
 * @return {void}
 */
export function generateBaseStyles(isBaseTheme, baseOutDir) {
  const componentDirectory = getComponentDirectory(isBaseTheme);
  const mixins = globSync('00-base/mixins/**/*.scss', { cwd: componentDirectory });
  // Get Base style file paths (ignore mixins, reset, variables, and stories).
  const base = globSync('00-base/!(mixins)/!(*.stories|variables|_variables.*|reset).scss', { cwd: componentDirectory });

  // Generate the base.css file.
  const baseData = `
  @import '00-base/variables';
  ${
    [...mixins, ...base].map((path) => `@import '${path}';`).join('\n')
  }
  @import 'style.css_variables';
`;
  const baseResult = compileString(baseData, { loadPaths: [componentDirectory] });
  const baseStylesFile = `${baseOutDir}/base.css`;
  fs.writeFileSync(baseStylesFile, cssHeader + baseResult.css);
  console.log(`Updating base styles: ${baseStylesFile}`);
}

// Get component directories.
export function getSingleDirectoryComponents(baseComponentDirectory) {
  const atoms = globSync('01-atoms/**/*.component.yml', { cwd: baseComponentDirectory });
  const molecules = globSync('02-molecules/**/*.component.yml', { cwd: baseComponentDirectory });
  const organisms = globSync('03-organisms/**/*.component.yml', { cwd: baseComponentDirectory });
  const templates = globSync('04-templates/**/*.component.yml', { cwd: baseComponentDirectory });
  const componentFiles = [
    ...atoms,
    ...molecules,
    ...organisms,
    ...templates,
  ];
  return componentFiles.map((componentFile) => dirname(componentFile))
}

/**
 * Get component directory.
 *
 * @param {string} componentDirectory - file path to component directory.
 * @return {*}
 */
function getComponentName(componentDirectory) {
  return componentDirectory.split('/').pop();
}

/**
 * Gets the SASS file for a component.
 *
 * @param {string} componentDirectory - directory of the component.
 * @param {string} basePath - file path to components.
 * @return {string|null}
 *   SASS file path.
 */
function getComponentStylesFilePath(componentDirectory, basePath) {
  const componentName = getComponentName(componentDirectory);
  const fileName = `${componentDirectory}/${componentName}.scss`;
  if (fs.existsSync(basePath + fileName)) {
    return fileName;
  }
  return null;
}

// Create a sass header to import base mixins.
export function generateComponentCssFiles(isBaseTheme) {
  const componentBaseDirectory = getComponentDirectory(isBaseTheme);
  const mixins = globSync('00-base/mixins/**/*.scss', { cwd: componentBaseDirectory });
  const mixinsImport = mixins.map((path) => `@import '${path}';`).join('\n');
  const components = getSingleDirectoryComponents(componentBaseDirectory);
  components.forEach((componentDirectory) => {
    const componentName = getComponentName(componentDirectory);
    const styleFile = getComponentStylesFilePath(componentDirectory, componentBaseDirectory);
    if (styleFile === null) {
      console.log(`No SCSS file found for ${componentDirectory}`);
      return;
    }
    const styleData = `
    @import '00-base/variables';
    ${mixinsImport}
    @import '${styleFile}';
  `;
    // Compile SCSS.
    const result = compileString(styleData, { loadPaths: [componentBaseDirectory] });

    // Write to directory.
    const fileName = `${componentBaseDirectory}${componentDirectory}/${componentName}.css`;
    fs.writeFileSync(fileName, cssHeader + result.css);
    console.log(`Updating css file: ${fileName}`);
  });
}

/**
 * Removes sass imports of components.
 *
 * @param {string} stylecss - previously cocatenated styles.
 *
 * @param {string} componentBaseDirectory - path to base directory of components.
 *
 * @return {string} modified sass imports.
 */
export function removeComponentSassImports(stylecss, componentBaseDirectory) {
  const componentDirectories = getSingleDirectoryComponents(componentBaseDirectory);
  const lines = stylecss.split('\n');
  lines.filter((style) => {
    if (!style.startsWith('@import')) {
      return true;
    }
    const importPath = style.replace('@import', '').replace("'", '').replace('"','').trim()
    const stylePath = dirname(`${componentBaseDirectory}/${importPath}`).replace(`${componentBaseDirectory}/`, '');
    if (componentDirectories.includes(stylePath)) {
      console.log(`Found component directory in import ${stylePath}`);
      return false;
    }
    return true;
  })
  return lines.join('\n');
}
