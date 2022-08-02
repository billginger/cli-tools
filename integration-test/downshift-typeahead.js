const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);

let main = '';
let footer = '';

const generateCode = (key, name) => {
  main += `
const ${key}Fixtures: StaticTypeaheadFixture = {
  filterName: '${name}',
  setValue: ['abc'],
  logicLabel: EqualLabel.NOT_EQUAL_TO,
  apiState: {${key}: ['abc'], ${key}LogicType: LogicType.NOT},
};
`;
  footer += `  ${key}Fixtures,\n`;
}

files.forEach(filename => {
  const filedir = path.join(__dirname, filename);
  const stats = fs.statSync(filedir);
  if (stats.isFile()) {
    const data = fs.readFileSync(filedir);
    const str = data.toString();
    if (str.indexOf(`DownshiftTypeaheadFilter`) >= 0) {
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

const draft = `import {LogicType} from '@uc/thrift2npme/dist/common/utils';

import {GeneralStringListFixture, toFixtureTable} from 'integration-tests/fixtures/common';

enum EqualLabel {
  EQUALS = 'Equals',
  NOT_EQUAL_TO = 'Not Equal To',
}

type StaticTypeaheadFixture = GeneralStringListFixture & {
  logicLabel?: EqualLabel;
};
${main}
export const staticTypeaheadTests = toFixtureTable<StaticTypeaheadFixture>([
${footer}]);
`;

fs.writeFileSync('draft.txt', draft);

console.log('draft.txt');
