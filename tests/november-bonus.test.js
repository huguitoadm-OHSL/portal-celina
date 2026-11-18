import test from 'node:test';
import assert from 'node:assert/strict';
import { bonusForIncreasedInitial } from '../src/services/novemberInitialBonus.js';

test('Anexo III: todos los tramos por valor y aumento en puntos porcentuales', () => {
 const prices=[7500,10000,20000,27500,40000,50000];
 const expected=[
   [100,170,270,400,500,600],
   [150,250,400,600,750,900],
   [200,330,530,800,1000,1200],
 ];
 for(let i=0;i<3;i++) for(let j=0;j<6;j++)
   assert.equal(bonusForIncreasedInitial(prices[j],[3,6,8][i]).bonusUsd,expected[i][j]);
});
test('Sin aumento acreditado superior a tres puntos no hay bono, y rechaza importes inválidos',()=>{
 assert.equal(bonusForIncreasedInitial(10000,2.99).bonusUsd,0);
 assert.equal(bonusForIncreasedInitial(10000,5.99).bonusUsd,170);
 assert.equal(bonusForIncreasedInitial(10000,7.99).bonusUsd,250);
 assert.throws(()=>bonusForIncreasedInitial(-100,8));
 assert.throws(()=>bonusForIncreasedInitial(10000,-2));
});
