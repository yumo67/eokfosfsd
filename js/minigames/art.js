// Detailed pixel actors and props for the mini-games. Visual only: no hit boxes or rules live here.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
const r=D.rect;
const cache=new Map();
// Draw fn into an offscreen buffer once, then stamp it with a 1px ink outline.
export function outlined(g,key,w,h,fn,x,y,{line=P.ink,scale=1}={}){
  let cv=cache.get(key);
  if(!cv){
    const src=document.createElement('canvas');src.width=w;src.height=h;fn(src.getContext('2d'));
    cv=document.createElement('canvas');cv.width=w+2;cv.height=h+2;const a=cv.getContext('2d');
    a.drawImage(src,0,1);a.drawImage(src,2,1);a.drawImage(src,1,0);a.drawImage(src,1,2);
    a.globalCompositeOperation='source-in';a.fillStyle=line;a.fillRect(0,0,w+2,h+2);
    a.globalCompositeOperation='source-over';a.drawImage(src,1,1);cache.set(key,cv);
  }
  g.drawImage(cv,Math.round(x-1),Math.round(y-1),(w+2)*scale,(h+2)*scale);
}
// Pixel ellipse with optional outline; maxY clips rows (absolute y) for hair caps.
export function blob(g,cx,cy,rx,ry,fill,line=P.ink,maxY=1e9,minY=-1e9){
  const row=(rx,ry,c)=>{for(let dy=-ry;dy<=ry;dy++){const y=cy+dy;if(y>maxY||y<minY)continue;const hw=Math.floor(rx*Math.sqrt(Math.max(0,1-(dy/(ry+.5))**2))+.5);r(g,cx-hw,y,hw*2+1,1,c);}};
  if(line)row(rx+1,ry+1,line);row(rx,ry,fill);
}
const HAIR=[[P.ink2,P.ash],[P.ash,P.gray],[P.red3,P.red2]];
// Seated outpatient, front view. (x,y): head centre reference used by the diagnosis room (seat at y+56).
export function seatedPatient(g,x,y,{t=0,hair=0,look=0,syms=[]}={}){
  x=Math.round(x);y=Math.round(y);
  const q=(a,b,w,h,c)=>r(g,x+a,y+b,w,h,c);
  const box=(a,b,w,h,c)=>{q(a,b,w,h,P.ink);q(a+1,b+1,w-2,h-2,c);};
  const br=Math.floor(t*1.4)%2, has=s=>syms.includes(s);
  const [hc,hs]=HAIR[hair%3];
  const pale=has('pale'), skin=pale?P.gray3:P.milk3, skinS=pale?P.gray2:P.milk;
  // chair back + frame
  box(-27,4,54,34,P.ash);q(-25,6,50,2,P.ash2);for(let i=0;i<5;i++)q(-22+i*11,10,1,26,P.ink3);
  q(-29,2,4,60,P.ink);q(-28,3,2,58,P.gray);q(25,2,4,60,P.ink);q(26,3,2,58,P.gray);
  // legs (shins + slippers)
  box(-14,60,11,27,P.gray2);box(3,60,11,27,P.gray2);q(-12,62,2,23,P.gray3);q(5,62,2,23,P.gray3);
  q(-13,72,9,1,P.gray);q(4,72,9,1,P.gray);
  if(has('swell')){box(-16,68,15,12,P.rose2);q(-13,71,8,1,P.rose);q(-12,74,6,2,P.milk3);}
  if(has('bruise')){q(5,66,6,5,P.red3);q(6,67,4,3,P.red2);q(7,68,1,1,P.rose);}
  box(-17,85,14,6,P.milk2);q(-16,86,12,1,P.rose2);box(3,85,14,6,P.milk2);q(4,86,12,1,P.rose2);
  // chair seat
  box(-34,54,68,8,P.ash2);q(-33,55,66,1,P.gray);q(-32,62,4,30,P.ink);q(28,62,4,30,P.ink);q(-30,80,60,2,P.ink3);
  // gown torso (breathes)
  const ty=16-br;
  blob(g,x-10,y+52,10,6,P.milk);blob(g,x+10,y+52,10,6,P.milk);q(-18,48,14,1,P.milk3);q(4,48,14,1,P.milk3);
  blob(g,x,y+ty+22,20,24,P.milk2,P.ink,y+57,y+ty);
  q(-21,ty,42,1,P.ink);
  for(let yy=ty+5;yy<54;yy+=6)for(let xx=-16+((yy/6|0)%2)*3;xx<17;xx+=6)q(xx,yy,2,1,P.gray3);
  q(-17,ty+4,3,40,P.gray3);q(14,ty+4,3,40,P.gray3);q(0,ty+8,1,40,P.gray3);
  for(let i=0;i<7;i++){q(-7+i,ty+i,1,1,P.ink);q(6-i,ty+i,1,1,P.ink);}q(-6,ty,12,1,skinS);q(-5,ty+1,10,1,skin);q(-4,ty+2,8,2,skin);q(-2,ty+4,4,2,skin);
  q(8,ty+8,1,5,P.gray);q(9,ty+12,2,1,P.gray);
  box(-15,ty+9,8,7,P.milk3);q(-13,ty+7,1,5,P.red);q(-12,ty+7,1,1,P.ink);
  // sleeves + forearms resting toward the lap
  blob(g,x-21,y+ty+12,5,11,P.milk2);blob(g,x+21,y+ty+12,5,11,P.milk2);q(-23,ty+4,2,16,P.gray3);q(22,ty+4,2,16,P.gray3);
  for(let i=0;i<14;i++){const ax=-21+i,ay=ty+22+(i>>1);q(ax,ay,1,7,P.ink);q(ax,ay+1,1,5,i<4?P.milk2:skin);q(-ax-1,ay,1,7,P.ink);q(-ax-1,ay+1,1,5,i<4?P.milk2:skin);}
  q(-17,ty+22,1,7,P.ink);q(16,ty+22,1,7,P.ink);
  blob(g,x-3,y+ty+31,4,3,skin);blob(g,x+3,y+ty+31,4,3,skin);
  q(-5,ty+31,1,2,skinS);q(-3,ty+31,1,2,skinS);q(3,ty+31,1,2,skinS);q(5,ty+31,1,2,skinS);
  if(has('stomach')){q(-6,ty+24,12,4,P.ink);q(-5,ty+25,10,2,skin);}
  if(has('chest')){q(3,ty+8,8,8,P.ink);q(4,ty+9,6,6,skin);q(-1,ty+6,4,4,P.rose);}
  if(has('itch')){const k=Math.floor(t*8)%2;q(19+k,ty+10,6,3,skin);q(20+k,ty+10,4,1,P.rose);}
  // neck + head
  box(-6,8,12,10,skin);q(-5,14,10,2,skinS);
  const hy=-24;
  blob(g,x-16,y+hy+20,3,5,skin);blob(g,x+16,y+hy+20,3,5,skin);q(-17,hy+19,1,3,skinS);q(16,hy+19,1,3,skinS);
  blob(g,x,y+hy+18,15,17,skin);
  for(let i=0;i<15;i++)q(8+(i>10?1:0),hy+12+i,1,1,i%3?skinS:skin);q(-9,hy+33,18,1,skinS);
  // hair styles
  if(hair%3===0){
    blob(g,x,y+hy+11,17,13,hc,P.ink,y+hy+15);
    for(let i=0;i<6;i++){const bx=-14+i*6,len=4+((i*7)%3)*2;for(let k=0;k<len;k++){q(bx+(k>>1),hy+14+k,4-(k>>1),1,hc);q(bx+(k>>1)+3-(k>>1),hy+14+k,1,1,P.ink);}}
    q(-17,hy+12,4,12,P.ink);q(-16,hy+12,3,11,hc);q(14,hy+12,4,10,P.ink);q(14,hy+12,3,9,hc);
    for(let i=0;i<4;i++)q(-10+i*7,hy+3+(i%2),4,1,hs);q(-2,hy-4,3,3,P.ink);q(-1,hy-3,1,2,hc);q(4,hy-3,3,3,P.ink);q(5,hy-2,1,2,hc);
  }else if(hair%3===1){
    q(-19,hy+10,7,30,P.ink);q(-18,hy+10,5,29,hc);q(12,hy+10,7,30,P.ink);q(13,hy+10,5,29,hc);q(-17,hy+22,1,14,hs);q(16,hy+22,1,14,hs);
    blob(g,x,y+hy+11,18,13,hc,P.ink,y+hy+14);
    for(let k=0;k<8;k++){q(-2+k,hy+13+(k>>1),16-k*2>0?16-k*2:1,1,hc);}q(-16,hy+13,5,6,hc);q(-12,hy+14,1,5,P.ink);
    q(-2,hy+1,1,12,P.ink3);for(let i=0;i<6;i++)q(-14+i*5,hy+4,2,1,hs);
  }else{
    q(-20,hy+12,7,20,P.ink);q(-19,hy+12,5,19,hc);q(13,hy+12,7,20,P.ink);q(14,hy+12,5,19,hc);q(-20,hy+31,8,2,P.ink);q(12,hy+31,8,2,P.ink);
    blob(g,x,y+hy+11,18,13,hc,P.ink,y+hy+16);
    q(-15,hy+15,30,2,hc);q(-15,hy+17,30,1,P.ink);for(let i=0;i<7;i++)q(-14+i*4,hy+16,1,2,P.ink3);
    for(let i=0;i<7;i++)q(-15+i*5,hy+3,2,1,hs);q(8,hy+4,6,5,P.ink);q(9,hy+5,4,3,P.milk2);q(10,hy+6,2,1,P.rose);
  }
  // face
  const blink=(t%3.2)<.12, ey=hy+20;
  q(-11,ey-6,6,1,P.ink3);q(5,ey-6,6,1,P.ink3);
  if(has('tired')||blink){q(-11,ey+1,6,1,P.ink);q(5,ey+1,6,1,P.ink);if(has('tired')){q(-11,ey+3,6,1,P.gray2);q(5,ey+3,6,1,P.gray2);q(-11,ey,6,1,P.ash2);q(5,ey,6,1,P.ash2);}}
  else if(has('dizzy')){for(const ex of [-8,8]){const a=t*6;q(ex-3,ey-2,6,6,P.ink);q(ex-2,ey-1,4,4,skin);q(ex+Math.round(Math.cos(a)),ey+Math.round(Math.sin(a)),1,1,P.ink);}}
  else{for(const ex of [-8,7]){q(ex-3,ey-3,7,1,P.ink);q(ex-3,ey-2,7,6,P.ink);q(ex-2,ey-2,5,5,P.milk3);q(ex-1,ey-2,4,5,P.ink2);q(ex,ey-1,2,3,look===2?P.red3:P.ash);q(ex-1,ey-2,1,1,P.milk3);q(ex+1,ey-1,1,1,P.milk3);}}
  q(-1,ey+5,2,2,skinS);
  const my=ey+10;
  if(has('cough')&&Math.floor(t*2)%3===0){q(-3,my-1,6,4,P.ink);q(-2,my,4,2,P.red3);}
  else if(has('stomach')||has('chest')||has('head')){q(-4,my,2,1,P.ash);q(-2,my+1,4,1,P.ash);q(2,my,2,1,P.ash);}
  else q(-3,my,6,1,pale?P.gray:P.ash);
  if(has('fever')){q(-14,ey+5,6,3,P.rose);q(8,ey+5,6,3,P.rose);q(-13,ey+5,2,1,P.rose2);q(9,ey+5,2,1,P.rose2);
    q(2,my-1,1,1,P.ink);q(3,my,10,2,P.ink);q(4,my,8,1,P.milk3);q(10,my,2,1,P.red);}
  else if(!pale){q(-13,ey+6,4,1,P.rose2);q(9,ey+6,4,1,P.rose2);}
  if(has('rash')||has('measles')){for(const [a,b] of [[-11,8],[-7,12],[10,10],[6,14],[-9,16],[12,-4],[-14,-2]])q(a,hy+b+14,2,2,P.red);}
  if(has('sneeze')){q(-1,ey+4,2,3,P.rose);if(Math.floor(t*1.5)%3===0){for(let i=0;i<6;i++)q(14+i*3,my-4+(i%3)*2,1,1,P.gray);}}
  if(has('head')){q(-17,hy+6,34,4,P.ink);q(-16,hy+7,32,2,P.milk3);q(-2,hy+6,4,4,P.red);}
  if(has('sweat')){const d=(t*14)%12|0;q(-17,hy+12+d,2,3,P.gray);q(-17,hy+12+d,1,1,P.milk3);q(15,hy+6+((d+5)%12),2,3,P.gray);}
  if(has('moon')){const z=Math.floor(t*2)%3;D.text(g,'Z',x+18+z*2,y+hy-6-z*5,{size:8,color:P.ash});}
  if(has('dizzy')){for(let i=0;i<3;i++){const a=t*3+i*2.1;q(Math.round(Math.cos(a)*16)-1,hy-6+Math.round(Math.sin(a)*3),3,3,i%2?P.red:P.ink);}}
  if(has('swell')&&!has('bruise')){}
}

// Patient lying on a rescue mat, seen from above, head to the left. Chest (sternum) at (cx,cy).
export function lyingPatient(g,cx,cy,{sq=0,recov=0,t=0}={}){
  const q=(x,y,w,h,c)=>r(g,x,y,w,h,c);
  const skin=recov>.6?P.milk3:P.gray3, skinS=recov>.6?P.milk:P.gray2;
  // mat
  q(42,94,266,116,P.ink);q(43,95,264,114,P.ash);q(46,98,258,108,P.ash2);
  for(let x=50;x<300;x+=6){q(x,97,3,1,P.gray);q(x,206,3,1,P.gray);}
  q(46,98,258,1,P.gray);
  // legs
  const legs=(y)=>{q(256,y,52,22,P.ink);q(257,y+1,51,20,P.ink3);q(258,y+3,49,2,P.ash);for(let x=270;x<306;x+=11)q(x,y+1,1,20,P.ink2);};
  legs(124);legs(154);
  // arms along the sides
  const arm=(y,dir)=>{
    q(104,y,124,20,P.ink);q(105,y+1,74,18,P.milk2);q(179,y+1,48,18,skin);q(179,y+1,48,dir<0?3:2,skinS);
    q(105,y+(dir<0?15:2),74,3,P.gray3);q(176,y+1,3,18,P.gray2);
    blob(g,236,y+10,9,8,skin);q(232,y+(dir<0?6:12),9,1,skinS);q(240,y+(dir<0?4:7),5,1,skinS);q(240,y+(dir<0?9:12),5,1,skinS);
  };
  arm(92,-1);arm(188,1);
  // torso: gown opened over the chest
  const ty=112+sq, th=76-sq*2;
  q(100,ty,162,th,P.ink);q(101,ty+1,160,th-2,P.milk2);
  for(let yy=ty+4;yy<ty+th-3;yy+=6)for(let xx=106+((yy/6|0)%2)*3;xx<258;xx+=7)q(xx,yy,2,1,P.gray3);
  q(101,ty+1,160,3,P.milk3);q(101,ty+th-5,160,4,P.gray3);
  // hips + belt
  q(cx+40,ty,53,th,P.ink);q(cx+41,ty+1,50,th-2,P.ink3);q(cx+41,ty+1,50,2,P.ash);q(cx+41,ty+1,4,th-2,P.ink);q(cx+46,cy-3,6,6,P.gray2);q(cx+47,cy-2,4,4,P.ink3);
  // opened gown: bare chest
  q(108,cy-25,98,50,P.ink);g.fillStyle=skin;D.roundFill(g,109,cy-24,96,48,6);
  q(109,cy-24,96,2,skinS);q(109,cy+22,96,2,skinS);
  for(let x=110;x<205;x+=8){q(x,cy-26,5,2,P.milk2);q(x,cy+24,5,2,P.milk2);}
  q(cx-1,cy-18,2,36,skinS);
  for(const side of [-1,1]){for(let k=0;k<26;k++){const yy=cy+side*(6+Math.round(Math.sin(k/26*Math.PI)*10));q(cx-34+k,yy,1,1,skinS);}}
  for(let k=0;k<3;k++){q(cx+10+k*8,cy-20,5,1,skinS);q(cx+10+k*8,cy+19,5,1,skinS);}
  q(116,cy-17,14,1,skinS);q(116,cy+16,14,1,skinS);
  // neck + head
  q(92,cy-9,12,18,P.ink);q(93,cy-8,11,16,skin);q(100,cy-8,2,16,skinS);
  blob(g,60,cy,22,27,P.ink2,P.ink);for(let i=0;i<7;i++)q(44+i*3,cy-22+((i*5)%9)*5,2,1,P.ash);
  for(let i=0;i<6;i++){q(40+i,cy+18+i*2,4,2,P.ink2);q(40+i,cy-20-i*2,4,2,P.ink2);}
  blob(g,79,cy,15,18,skin,P.ink);
  q(64,cy-16,6,32,P.ink2);
  for(let i=0;i<5;i++)q(69,cy-12+i*6,3+(i%2)*2,4,P.ink2);
  q(78,cy-11,2,6,P.ink);q(78,cy+5,2,6,P.ink);q(80,cy-11,1,1,P.ink);q(80,cy+10,1,1,P.ink);q(75,cy-11,1,6,P.ash2);q(75,cy+5,1,6,P.ash2);
  q(83,cy-12,3,1,P.gray2);q(83,cy+11,3,1,P.gray2);
  q(85,cy-1,3,3,skinS);
  const open=recov>.6?1:0;q(89,cy-3,1+open,6,recov>.6?P.red2:P.ash);
  if(recov>.6){q(82,cy-15,3,4,P.rose2);q(82,cy+11,3,4,P.rose2);}
  if(recov>.2&&Math.floor(t*2)%2){q(98,cy-4,2,2,P.gray2);q(101,cy-6,1,1,P.gray2);}
}
// Emrys's gloved, interlocked hands coming down from the top edge (CPR).
export function cprHands(g,cx,hy){
  const q=(x,y,w,h,c)=>r(g,x,y,w,h,c);
  for(const sx of [-14,2]){q(cx+sx-1,hy-36,14,32,P.ink);q(cx+sx,hy-36,12,31,P.milk2);q(cx+sx+(sx<0?1:9),hy-36,2,31,P.gray3);q(cx+sx,hy-16,12,3,P.red2);q(cx+sx,hy-15,12,1,P.red3);q(cx+sx,hy-7,12,2,P.gray2);}
  blob(g,cx,hy+8,16,11,P.ink2,P.ink);blob(g,cx+1,hy+5,11,7,P.ink3,null);
  for(let i=0;i<4;i++){q(cx-9+i*6,hy+12,4,5,P.ink);q(cx-8+i*6,hy+12,2,4,P.ink3);q(cx-8+i*6,hy+12,2,1,P.ash);}
  q(cx-8,hy+1,9,1,P.ash);q(cx+4,hy+3,6,1,P.ash);q(cx-14,hy+6,3,5,P.ink3);
}
