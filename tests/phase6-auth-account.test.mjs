import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const worker=await readFile(new URL('../worker/src/index.js',import.meta.url),'utf8');
const frontend=await readFile(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const schema=await readFile(new URL('../database/migrations/0001_initial.sql',import.meta.url),'utf8');

test('phase 6 authentication contract exposes OTP, session hydration and logout',()=>{
  assert.match(worker,/u\.pathname===['"]\/api\/auth\/request-otp['"]/);
  assert.match(worker,/u\.pathname===['"]\/api\/auth\/verify-otp['"]/);
  assert.match(worker,/u\.pathname===['"]\/api\/me['"]/);
  assert.match(worker,/u\.pathname===['"]\/api\/auth\/logout['"]/);
  assert.match(worker,/crypto\.getRandomValues/);
  assert.match(worker,/OTP_PEPPER/);
  assert.match(worker,/otp_challenges/);
  assert.match(worker,/__Host-gs_session/);
  assert.match(worker,/gs_csrf/);
});

test('phase 6 OTP policy is bounded, expiring and rate limited',()=>{
  assert.match(worker,/rate\(env,mobile,3,10,'mobile'\)/);
  assert.match(worker,/rate\(env,ip,12,10,'request_ip'\)/);
  assert.match(worker,/expiresAt/);
  assert.match(worker,/attempts>=5/);
  assert.match(worker,/used_at/);
});

test('phase 6 authenticated mutations enforce CSRF',()=>{
  assert.match(worker,/requireCsrf\(req\)/);
  assert.match(worker,/u\.pathname===['"]\/api\/auth\/logout['"]/);
  assert.match(worker,/u\.pathname===['"]\/api\/addresses['"]/);
  assert.match(worker,/u\.pathname===['"]\/api\/notifications\/read['"]/);
  assert.match(worker,/u\.pathname===['"]\/api\/favorites['"]/);
});

test('phase 6 account contract includes profile, orders, favorites, rewards, referral and notifications',()=>{
  for(const route of ['/api/me','/api/orders','/api/favorites','/api/rewards','/api/referrals/apply','/api/notifications']){
    assert.match(worker,new RegExp(route.replaceAll('/','\\/')));
  }
  assert.match(frontend,/state\.user/);
  assert.match(frontend,/\/api\/me/);
  assert.match(frontend,/\/api\/favorites/);
  assert.match(frontend,/\/api\/rewards/);
  assert.match(frontend,/\/api\/notifications/);
  assert.match(frontend,/accountLink\(\)/);
});

test('phase 6 session state does not store bearer session ids in localStorage',()=>{
  assert.doesNotMatch(frontend,/localStorage\.setItem\(['"][^'"]*(?:session|token|csrf)[^'"]*['"]/i);
  assert.match(frontend,/credentials:'include'/);
});

test('phase 6 database contains users, sessions and OTP challenges',()=>{
  assert.match(schema,/CREATE TABLE IF NOT EXISTS users/);
  assert.match(schema,/CREATE TABLE IF NOT EXISTS sessions/);
  assert.match(schema,/CREATE TABLE IF NOT EXISTS otp_challenges/);
});
