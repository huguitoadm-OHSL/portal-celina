import test from 'node:test';
import assert from 'node:assert/strict';
import { isAuthorizedClaims } from '../src/services/authorization.js';
test('solo claims booleanas verificadas permiten acceso',()=>{
  for (const claims of [undefined,{}, {portalAccess:'true'},{admin:1},{role:'admin'}]) assert.equal(isAuthorizedClaims(claims),false);
  assert.equal(isAuthorizedClaims({portalAccess:true}),true);
  assert.equal(isAuthorizedClaims({admin:true}),true);
});
