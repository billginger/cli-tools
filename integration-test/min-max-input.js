const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);

let main = '';
let footer = '';

const generateCode = (key, name) => {
  main += `
const ${key}Fixtures: GeneralMinMaxNumberFixture[] = [
  {
    filterName: '${name}',
    setValue: {min: 1, max: 9},
    apiState: {
      ${key}: {
        min: 1,
        max: 9,
      },
    },
  },
  {
    filterName: '${name}',
    setValue: {min: 1},
    apiState: {
      ${key}: {
        min: 1,
        max: undefined,
      },
    },
  },
  {
    filterName: '${name}',
    setValue: {max: 9},
    apiState: {
      ${key}: {
        min: undefined,
        max: 9,
      },
    },
  },
];
`;
  footer += `  ${key}Fixtures,\n`;
}

files.forEach(filename => {
  const filedir = path.join(__dirname, filename);
  const stats = fs.statSync(filedir);
  if (stats.isFile()) {
    const data = fs.readFileSync(filedir);
    const str = data.toString();
    if (str.indexOf(`MinMaxInputFilter`) >= 0) {
      const keyArray = str.match(/store\.query\.(\S*);/);
      const nameArray = str.match(/export const (\S*):/);
      if (keyArray && nameArray) {
        const key = keyArray[1];
        const name = nameArray[1];
        generateCode(key, name);
      }
    }
  }
});

const draft = `import {GeneralMinMaxNumberFixture, toFixtureTable} from 'integration-tests/fixtures/common';
${main}
export const minMaxInputTests = toFixtureTable([
${footer}]);
`;

fs.writeFileSync('draft.txt', draft);

console.log('draft.txt');
