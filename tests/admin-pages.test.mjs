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
