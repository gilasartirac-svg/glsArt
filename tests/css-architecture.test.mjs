import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=process.cwd();
const read=p=>readFileSync(root+'/'+p,'utf8');

function topLevelRules(css){
  const out=[];
  let depth=0,quote='',comment=false,start=0;
  for(let i=0;i<css.length;i++){
    const ch=css[i], nx=css[i+1];
    if(comment){if(ch==='*'&&nx==='/'){comment=false;i++;}continue}
    if(quote){if(ch==='\\')i++;else if(ch===quote)quote='';continue}
    if(ch==='/'&&nx==='*'){comment=true;i++;continue}
    if(ch==='"'||ch==="'"){quote=ch;continue}
    if(ch==='{'){
      if(depth===0){let j=i-1;while(j>=0&&/\s/.test(css[j]))j--;let k=j;while(k>=0&&css[k]!=='}'&&css[k]!==';')k--;start=k+1;while(start<i&&/\s/.test(css[start]))start++}
      depth++;
    }else if(ch==='}'){
      depth--;
      if(depth===0)out.push(css.slice(start,i+1));
    }
  }
  return out;
}
function duplicateCount(css){
  const seen=new Set();let duplicates=0;
  for(const rule of topLevelRules(css)){if(seen.has(rule))duplicates++;else seen.add(rule)}
  return duplicates;
}

test('styles.css has no exact duplicate top-level rules',()=>{
  const css=read('frontend/src/styles.css');
  assert.equal(duplicateCount(css),0);
});
test('admin-ui.css has no exact duplicate top-level rules',()=>{
  const css=read('frontend/src/admin/admin-ui.css');
  assert.equal(duplicateCount(css),0);
});
test('legacy generic responsive block is removed from the shared stylesheet',()=>{
  const css=read('frontend/src/styles.css');
  assert.doesNotMatch(css,/\\@media\(max-width:900px\)\{\.grid\{grid-template-columns:repeat\(2,1fr\)\}/);
  assert.doesNotMatch(css,/\\@media\(max-width:520px\)\{\.grid\{grid-template-columns:1fr\}/);
});
test('canonical responsive contract owns the base viewport bands',()=>{
  const css=read('frontend/src/styles.css');
  for(const token of ['@media (min-width:1024px)','@media (min-width:768px) and (max-width:1023px)','@media (max-width:767px)','@media (max-width:359px)']){
    assert.match(css,new RegExp(token.replace(/[.*+?^$()|[\]\\]/g,'\\$&')));
  }
});
test('admin stylesheet keeps every component selector scoped to the control panel',()=>{
  const css=read('frontend/src/admin/admin-ui.css');
  for(const selector of ['.admin-product-modal-head','.admin-product-modal-foot','.products-admin-table-wrap','.faq-manager-body','.ticket-thread']){
    const re=new RegExp('(?:^|})\\s*'+selector.replace('.','\\.')+'\\b');
    assert.doesNotMatch(css,re,selector+' leaked without .admin-layout scope');
  }
});

test('public stylesheet keeps admin component selectors scoped',()=>{
  const css=read('frontend/src/styles.css');
  for(const selector of ['.admin-table','.admin-page','.admin-header','.admin-sidebar','.admin-nav-group']){
    const re=new RegExp('(?:^|})\\s*'+selector.replace('.','\\.')+'\\b');
    assert.doesNotMatch(css,re,selector+' leaked without .admin-layout scope');
  }
});
