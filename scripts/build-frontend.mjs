import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});await cp('frontend/src','dist',{recursive:true});await cp('frontend/public','dist',{recursive:true});await writeFile('dist/config.js',`window.GILASART_API=${JSON.stringify(process.env.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev')};\n`);console.log('frontend built');
