// Clinic set dressing. Sizes and anchor points match the original inspection zones.
import { P } from './palette.js';
import * as D from './draw.js';
import { slab as S, label, rivets } from './scenery.js';
export { box, shadow, stairsDown, ladder, hatchClosed, mopBucket, wheelchair, ivStand, scale, tubeRack } from './props.js';
const R=D.rect, L=D.line;
const shade=(g,x,y,w)=>{R(g,x+3,y-2,w,5,P.ash);R(g,x+7,y+3,w-5,1,P.gray);};
function grip(g,x,y,w=12){R(g,x,y,w,4,P.ink2);R(g,x+1,y+1,w-2,1,P.gray2);R(g,x+2,y+3,w-4,1,P.ash2);}
function legs(g,x,y,w,h) {for(const j of [x+4,x+w-9]){R(g,j,y-h,5,h,P.ink3);R(g,j+1,y-h,1,h-2,P.gray);}}
function grain(g,x,y,w,h,c){for(let j=0;j<7;j++){const a=x+4+j*13%(w-8), b=y+4+j*17%(h-7);R(g,a,b,Math.min(w+x-a-3,3+j%5),1,c);}}
export function counter(g,x,y,w,h){
  shade(g,x,y+h,w);S(g,x+4,y+6,w-8,h-6,P.ash2,P.gray2,P.ash);
  for(let j=0;j<4;j++){const a=x+10+j*46;S(g,a,y+15,42,h-26,P.gray,P.gray3,P.ash2);
    for(let k=4;k<40;k+=3)R(g,a+k,y+20,1,h-34,k%2?P.ash2:P.gray2);}
  R(g,x+4,y+h-8,w-8,5,P.ink3);
  S(g,x-2,y,w+4,11,P.milk,P.milk3,P.ash); label(g,x+77,y+27,50,'03:33',true);
}
export function desk(g,x,y,w){
  shade(g,x,y,w);legs(g,x,y,w,49);
  S(g,x+w-39,y-51,34,49,P.ash2,P.gray,P.ash);
  for(let i=0;i<3;i++){S(g,x+w-36,y-48+i*14,27,13,P.gray,P.gray3,P.ash2);grip(g,x+w-29,y-45+i*14);}
  S(g,x-2,y-57,w+4,12,P.gray2,P.milk3,P.ash);grain(g,x+7,y-55,w-14,7+1,P.gray);
}
export function monitor(g,x,y){
  S(g,x,y-42,55,33,P.ash2,P.gray3,P.ink2);
  S(g,x+4,y-38,46,25,P.ink2,P.ash,P.ink);
  R(g,x+44,y-12,2,1,P.rose);R(g,x+25,y-9,6,7,P.ash);S(g,x+15,y-4,28,5,P.gray,P.milk,P.ash);
  for(let i=0;i<3;i++)R(g,x+5+i*3,y-13,2,1,P.gray);
}
export function mug(g,x,y){
  D.ring(g,x+13,y+1,4,P.ink3,2);D.ring(g,x+13,y+1,3,P.gray,1);
  S(g,x,y-5,13,14,P.milk3,P.milk,P.gray); D.cross(g,x+6,y+2,1,P.red);
  R(g,x+2,y-5,9,2,P.ash);R(g,x+3,y-5,6,1,P.red3);
}
export function officeChair(g,x,y){
  shade(g,x-10,y,32);R(g,x+4,y-18,3,15,P.ink3);R(g,x-5,y-4,22,3,P.ash);R(g,x-5,y-2,3,2,P.ink);R(g,x+14,y-2,3,2,P.ink);
  S(g,x-11,y-27,31,10,P.ash,P.gray,P.ink);
  S(g,x-9,y-55,27,31,P.red3,P.rose,P.ink2);
  for(let i=0;i<4;i++)R(g,x-5,y-49+i*5,18,1,P.red2);
}
export function bench(g,x,y,w=56){
  shade(g,x,y,w);legs(g,x,y,w,19);S(g,x,y-29,w,14,P.ash2,P.gray3,P.ash);S(g,x-1,y-18,w+2,8,P.gray,P.milk3,P.ash);
  for(let i=7;i<w-5;i+=9){R(g,x+i,y-26,1,6,P.gray);R(g,x+i,y-16,1,3,P.gray3);}
}
export function plant(g,x,y){
  shade(g,x-12,y,26);S(g,x-10,y-17,20,17,P.rose2,P.milk3,P.red3);R(g,x-12,y-19,24,4,P.ink3);R(g,x-11,y-19,22,2,P.rose);
  for(let i=0;i<7;i++){
    const a=x+(i%2?-1:1)*(6+i%3*4), b=y-53+(i*11%29);
    L(g,x,y-18,a,b,P.ink3);
    D.circle(g,a,b,4+i%3,P.ash);D.circle(g,a+(i%2?-1:1),b-2,3+i%3,P.ash2);
    L(g,a-2,b+1,a+2,b-2,P.gray);
  }
}
function book(g,x,y,w,h,i){S(g,x,y-h,w,h,i%4===0?P.red2:i%3===0?P.milk:P.gray2,P.milk3,P.ash);R(g,x+2,y-h+4,w-4,2,i%4===0?P.rose:P.ash2);R(g,x+2,y-5,w-4,1,P.ink3);}
function cabinet(g,x,y,w,h,rows,variant=0){
  shade(g,x,y,w);S(g,x,y-h,w,h,P.ash2,P.gray3,P.ash);R(g,x+6,y-h+8,w-13,h-16,P.ink3);
  const space=(h-14)/rows;
  for(let j=0;j<rows;j++){
    const y1=y-h+8+(j+1)*space-4;
    for(let k=0;k<Math.floor((w-15)/7);k++){
      const bw=5+(k+j)%2, bx=x+7+k*7, ht=9+(k*13+j*11+variant)%Math.round(space-10);
      book(g,bx,y1,bw,ht,k+j+variant);
    }
    R(g,x+5,y1,w-10,4,P.ash);R(g,x+6,y1,w-12,1,P.gray2);
  }
  rivets(g,x,y-h,w,h);
}
export function bookshelf(g,x,y,w,h){cabinet(g,x,y,w,h,4,1);}
export function medShelf(g,x,y,w,h,seed){cabinet(g,x,y,w,h,4,seed);label(g,x+22,y-h-3,w-44,'RX / '+(seed?2:1));}
export function medFridge(g,x,y,w,h){
  shade(g,x,y,w);S(g,x,y-h,w,h,P.milk,P.milk3,P.ash);
  S(g,x+5,y-h+13,w-11,84,P.ash2,P.gray2,P.ash);
  R(g,x+8,y-h+18,w-17,73,P.ink3);
  for(let j=0;j<3;j++){
    const b=y-h+39+j*23;R(g,x+9,b,w-18,2,P.ash2);
    for(let i=0;i<4;i++){const a=x+10+i*8;R(g,a+1,b-14,4,3,P.gray);R(g,a,b-11,6,10,i%3===0?P.rose:P.milk2);R(g,a+1,b-8,4,2,P.gray);}
  }
  L(g,x+10,y-h+64,x+40,y-h+30,P.gray);L(g,x+11,y-h+76,x+34,y-h+48,P.ash2);
  S(g,x+5,y-29,w-11,22,P.gray2,P.milk3,P.ash2);grip(g,x+17,y-25,w-35);
}
export function labBench(g,x,y,w){
  shade(g,x,y,w);legs(g,x,y,w,48);S(g,x-2,y-54,w+4,10,P.ash2,P.milk3,P.ink2);
  S(g,x+5,y-42,w-10,16,P.gray3,P.milk3,P.ash2);grip(g,x+10,y-37);grip(g,x+w-24,y-37);
  R(g,x+8,y-11,w-16,3,P.ash);R(g,x+8,y-11,w-16,1,P.gray);
}
export function hospitalBed(g,x,y,w=56){
  shade(g,x-4,y+23,w+8);legs(g,x-4,y+23,w+8,30);
  S(g,x-4,y-12,w+8,28,P.ash2,P.gray3,P.ink2);
  S(g,x,y-8,w,18,P.milk3,P.milk3,P.gray);
  R(g,x+3,y-1,w-6,3,P.rose2);R(g,x+3,y-1,w-6,1,P.rose);
  for(let j=4;j<w;j+=7)R(g,x+j,y+5,4,1,P.gray2);
  R(g,x-2,y-24,3,34,P.ink3); R(g,x+w-1,y-10,3,25,P.ink3);
  R(g,x-1,y-23,1,31,P.gray3);R(g,x+w,y-9,1,20,P.gray2);
}
export function curtain(g,x,y,w,h){
  R(g,x-2,y-2,w+4,4,P.ink3);R(g,x-2,y-1,w+4,1,P.gray);
  for(let i=0;i<w;i++){
    const j=i%13;const cut=1+Math.abs(j-6)%3;
    R(g,x+i,y+5,1,h-5-cut,j<2?P.red3:j<5?P.red2:j<9?P.rose:P.red);
    if(j===3)R(g,x+i,y+10,1,h-21,P.rose2);
    if(j===6){R(g,x+i,y+1,1,6,P.milk);R(g,x+i,y+h-9,1,3,P.red3);}
  }
}
export function coffeeTable(g,x,y,w){
  shade(g,x,y,w);legs(g,x,y,w,35);S(g,x-2,y-34,w+4,10,P.ash2,P.milk3,P.ink3);
  R(g,x+7,y-12,w-14,3,P.ash);R(g,x+7,y-12,w-14,1,P.gray);
}
export function sofa(g,x,y,w){
  shade(g,x,y,w);legs(g,x,y,w,9);
  S(g,x+5,y-51,w-10,43,P.red3,P.rose,P.ink2);
  for(let i=0;i<3;i++){const a=x+8+i*(w-16)/3;S(g,a,y-46,(w-17)/3,28,P.red2,P.rose,P.red3);
    grain(g,a+4,y-40,(w-40)/3,18,P.red3);}
  S(g,x+9,y-22,w-18,17,P.red,P.rose,P.red3);
  for(const k of [x,x+w-13])S(g,k,y-32,13,24,P.red2,P.rose,P.ink3);
}
export function cushion(g,x,y){S(g,x,y-10,24,19,P.gray3,P.milk3,P.ash2);for(let i=0;i<3;i++)L(g,x+4+i*5,y+4,x+11+i*5,y-6,P.gray);}
export function calendar(g,x,y){
  S(g,x,y,35,39,P.milk2,P.milk3,P.gray);ribs(g,x+2,y,31);
  for(let j=0;j<4;j++)for(let i=0;i<5;i++)R(g,x+5+i*5,y+13+j*5,2,2,i===1&&j===2?P.red:P.ash2);
  D.stroke(g,x+8,y+20,6,6,P.red);
}
function ribs(g,x,y,w){R(g,x,y+2,w,7,P.red2);for(let j=5;j<w;j+=8)R(g,x+j,y-2,2,6,P.ink);}
export function vending(g,x,y,w,h){
  shade(g,x,y,w);S(g,x,y-h,w,h,P.red2,P.rose,P.red3);
  label(g,x+7,y-h+6,w-14,'NIGHT / RX',true);
  S(g,x+5,y-h+20,w-16,71,P.ink2,P.rose2,P.red3);
  for(let j=0;j<4;j++){const b=y-h+36+j*15;
    for(let i=0;i<4;i++){const a=x+9+i*9;S(g,a,b-9,8,9,i%2?P.rose2:P.milk2,P.milk3,P.gray);R(g,a+2,b-7,4,2,j%2?P.red:P.gray);}
    R(g,x+8,b,w-22,2,P.ash2);}
  S(g,x+w-11,y-h+30,8,42,P.ash2,P.milk3,P.ink);R(g,x+w-9,y-h+35,3,2,P.rose);
  S(g,x+9,y-31,w-18,16,P.ink2,P.rose,P.ink);R(g,x+12,y-26,w-24,1,P.ash);
}
export function arcade(g,x,y,w,h){
  shade(g,x,y,w);S(g,x,y-h,w,h,P.ash,P.gray,P.ink);
  label(g,x+4,y-h+4,w-8,'ARCADE',true);S(g,x+4,y-h+16,w-8,37,P.ink,P.rose2,P.ink);
  S(g,x+2,y-69,w-4,15,P.red2,P.rose,P.ink3);
  D.circle(g,x+11,y-62,3,P.milk);D.circle(g,x+31,y-62,2,P.red);D.circle(g,x+38,y-62,2,P.rose2);
  for(let i=0;i<5;i++)R(g,x+8+i*7,y-45,3,30,i%2?P.ink3:P.ash2);
  label(g,x+12,y-20,w-24,'01',true);
}
export function cardboard(g,x,y,w,h,tape=true){
  S(g,x,y-h,w,h,P.gray2,P.milk,P.ash2);grain(g,x+3,y-h+3,w-6,h-6,P.gray);
  R(g,x+2,y-h+4,w-4,2,P.ash2);if(tape){R(g,x+w/2-3,y-h+1,6,9,P.milk);R(g,x+w/2-3,y-h+8,6,1,P.gray);}
  R(g,x+4,y-10,Math.max(8,w/3),5,P.milk2);R(g,x+6,y-8,Math.max(4,w/3-4),1,P.ash2);
}
export function lostFound(g,x,y){
  shade(g,x,y,47);S(g,x,y-39,47,39,P.ash2,P.gray3,P.ink3);
  S(g,x-2,y-46,51,12,P.ash,P.gray,P.ink);grip(g,x+16,y-44,15);label(g,x+5,y-27,37,'LOST');
  rivets(g,x,y-37,47,35,P.ink3);
}
export function metalShelf(g,x,y,w,h){
  for(const a of [x,x+w-5]){S(g,a,y-h-19,5,h+19,P.ash2,P.gray3,P.ink3);}
  for(let j=0;j<4;j++)S(g,x,y-j*30-4,w,5,P.ash2,P.gray3,P.ink3);
}
export function fileCabinet(g,x,y,w,h){
  shade(g,x,y,w);S(g,x,y-h,w,h,P.ash2,P.gray3,P.ink3);
  for(let j=0;j<5;j++){
    const b=y-h+5+j*26;S(g,x+5,b,w-10,23,P.gray,P.gray3,P.ash2);
    label(g,x+w/2-10,b+3,20,'0'+(j+1));grip(g,x+w/2-9,b+15,18);
    R(g,x+12,b+11,2,2,P.ash);R(g,x+w-13,b+11,2,2,P.ash);
  }
}
export function blackDoor(g,x,y){
  S(g,x-3,y-91,46,91,P.ink3,P.ash2,P.ink);
  S(g,x,y-87,40,85,P.ink2,P.ash,P.ink);
  for(const j of [0,1]){
    S(g,x+4,y-82+j*38,31,j?39:33,P.ink3,P.ash,P.ink);
    for(let k=0;k<5;k++)R(g,x+8+k*4,y-77+j*38,1,24,P.ink2);
  }
  S(g,x+28,y-56,8,15,P.ash,P.gray,P.ink2);
  D.circle(g,x+31,y-50,2,P.ink);R(g,x+31,y-48,1,4,P.ink);
  R(g,x-1,y-1,42,1,P.red3);label(g,x+6,y-104,28,'—',true);
}
export function waterCooler(g,x,y){
  shade(g,x,y,20);S(g,x,y-43,22,43,P.milk2,P.milk3,P.ash2);
  S(g,x+3,y-39,16,15,P.ash,P.gray,P.ink3);R(g,x+6,y-35,3,4,P.red);R(g,x+13,y-35,3,4,P.gray3);
  for(let i=0;i<6;i++) R(g,x+4+i*2,y-11,1,7,P.gray);
  S(g,x+2,y-66,18,24,P.gray2,P.milk3,P.ash);
  for(let i=0;i<4;i++){R(g,x+4,y-60+i*4,13,2,P.gray3);R(g,x+5,y-60+i*4,2,2,P.milk3);}
}
export function guestbook(g,x,y){
  S(g,x-2,y,30,9,P.red2,P.rose,P.ink2);
  R(g,x,y-2,13,8,P.milk3);R(g,x+14,y-2,12,8,P.milk2);R(g,x+13,y-1,1,7,P.ash);
  for(let j=0;j<3;j++){R(g,x+2,y+j*2,8-j,1,P.gray);R(g,x+16,y+j*2,8+j%2,1,P.gray);}
  L(g,x+21,y+4,x+29,y-4,P.ash);R(g,x+28,y-4,2,1,P.red);
}
export function deskBell(g,x,y){
  D.circle(g,x+8,y+6,6,P.ash);D.circle(g,x+8,y+6,5,P.gray);R(g,x+5,y+2,5,2,P.milk3);
  R(g,x+7,y-1,3,2,P.red2);S(g,x,y+6,17,5,P.ash2,P.milk3,P.ink);
}
export function glassDoor(g,x,y,w,h){
  S(g,x,y-h,w,h,P.ash,P.gray2,P.ink3);R(g,x+3,y-h+5,w-7,h-11,P.ink3);
  for(let i=0;i<4;i++)L(g,x+4,y-h+19+i*5,x+w-4,y-h+9+i*5,P.ash2);
  R(g,x+3,y-31,w-7,3,P.rose2);R(g,x+w-6,y-38,2,13,P.milk3);
}
export function frame(g,x,y,w,h){
  S(g,x-2,y-2,w+4,h+4,P.ash2,P.milk3,P.ink3);S(g,x+2,y+2,w-4,h-4,P.milk2,P.milk3,P.gray);
  R(g,x+8,y+7,w-16,2,P.red2); for(let j=0;j<4;j++)R(g,x+8,y+12+j*2,w-18-j*2,1,P.gray);
  D.circle(g,x+w-9,y+h-8,3,P.red);D.circle(g,x+w-9,y+h-8,1,P.rose2);
}
export function bedsideTable(g,x,y){
  shade(g,x,y,20); S(g,x,y-32,22,31,P.gray2,P.milk3,P.ash);
  S(g,x+2,y-26,18,10,P.milk2,P.milk3,P.gray);grip(g,x+7,y-23,8);
  S(g,x+2,y-15,18,13,P.gray3,P.milk3,P.gray);grip(g,x+7,y-12,8);
}
export function wallTV(g,x,y,w=40,h=28){
  S(g,x-3,y-3,w+6,h+9,P.ash2,P.gray3,P.ink);R(g,x+1,y+1,w-2,h-1,P.ink);
  D.stroke(g,x,y,w,h,P.ink2);R(g,x+w-5,y+h+2,2,1,P.red);
  for(let i=0;i<6;i++)R(g,x+5+i*3,y+h+2,2,1,P.gray2);
}
export const tvStand=wallTV;
export function pillBottle(g,x,y){
  S(g,x,y-24,26,24,P.milk,P.milk3,P.gray);R(g,x+2,y-24,22,4,P.ash2);
  for(let j=0;j<8;j++)R(g,x+2+j*3,y-24,1,3,P.gray2);
  S(g,x+3,y-18,20,14,P.milk3,P.milk3,P.gray);D.cross(g,x+11,y-12,2,P.red);
  R(g,x+16,y-13,4,1,P.gray);R(g,x+16,y-10,4,1,P.gray);
}
export function pillCap(g,x,y){S(g,x,y,14,6,P.red,P.rose,P.red3);for(let j=3;j<12;j+=2)R(g,x+j,y+2,1,3,P.red2);}
export function fileStack(g,x,y,n=6){
  for(let i=0;i<n;i++){const a=x+(i*7)%4;R(g,a,y-i*3-3,24,3,P.ink3);R(g,a+1,y-i*3-3,23,1,i%2?P.rose2:P.milk3);R(g,a+1,y-i*3-2,19,1,P.gray2);}
}
export function deskLamp(g,x,y){
  S(g,x-7,y-4,21,4,P.ash,P.gray,P.ink);L(g,x+1,y-4,x-7,y-20,P.ink);L(g,x-6,y-20,x+6,y-32,P.gray);
  S(g,x+1,y-39,17,8,P.red2,P.rose,P.ink3);R(g,x+4,y-32,11,2,P.milk3);
}
export function waterTank(g,x,y){
  legs(g,x,y,49,18); shade(g,x,y,48);S(g,x,y-57,49,44,P.ash2,P.gray2,P.ink3);
  for(let i=0;i<6;i++){R(g,x+3+i*7,y-53,1,35,P.ash);R(g,x+4+i*7,y-51,1,32,P.gray);}
  label(g,x+12,y-41,25,'02',true);S(g,x+14,y-61,19,6,P.ash,P.gray2,P.ink);
}
export function roofDoor(g,x,y){
  S(g,x,y-97,45,97,P.ash,P.gray2,P.ink);S(g,x+5,y-83,35,82,P.ink3,P.ash2,P.ink);
  S(g,x+10,y-75,24,17,P.ash,P.gray,P.ink);L(g,x+13,y-63,x+27,y-72,P.gray2);
  R(g,x+31,y-42,3,11,P.ash2);grip(g,x+24,y-39,11);label(g,x+8,y-95,28,'RF',true);
}
