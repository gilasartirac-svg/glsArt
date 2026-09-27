import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readdirSync} from 'node:fs';
import {resolve} from 'node:path';

const dir=resolve('frontend/src/admin/pages');
const files=readdirSync(dir).filter(x=>x.endsWith('.js')).sort();

test('all admin page modules compile without syntax errors',()=>{
  assert.ok(files.length>=10,'admin page set is unexpectedly small');
  for(const file of files){
    let src=readFileSync(resolve(dir,file),'utf8');
    src=src.replace(/^import[^;]+;\s*/gm,'');
    src=src.replace(/^export default /m,'');
    assert.doesNotThrow(()=>new Function(src),file);
  }
});

test('admin grids provide Persian date formatting, sorting and filtering',()=>{
  const table=readFileSync(resolve('frontend/src/admin/components/Table.js'),'utf8');
  assert.match(table,/fa-IR-u-ca-persian/);
  assert.match(table,/Asia\/Tehran/);
  assert.match(table,/setupDataGrid/);
  assert.match(table,/data-grid-search/);
  assert.match(table,/sortDir/);
  assert.match(table,/tagName==='TBODY'/,'data grids must resolve tbody ids to their parent table');
  for(const file of files.filter(x=>!['Dashboard.js','Settings.js','SmsSettings.js','PaymentSettings.js'].includes(x))){
    const src=readFileSync(resolve(dir,file),'utf8');
    assert.match(src,/setupDataGrid\('/,file+' must initialize a data grid');
  }
});
