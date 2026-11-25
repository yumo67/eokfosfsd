// Pixel stage dressing shared by the clinic activities; no hit boxes or rules.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { slab, label, rivets } from '../core/scenery.js';
const r=D.rect;
const cache={};
const spec={
  diagnosis:['A1',P.milk2,'tile'],disinfect:['A2',P.gray3,'ceramic'],sort:['A3',P.gray3,'rail'],
  monitor:['B1',P.ink2,'grid'],lab:['B2',P.ink2,'rail'],cpr:['B3',P.ash,'tile'],
  suture:['C1',P.ink2,'grid'],delivery:['C2',P.ink2,'rail'],memory:['C3',P.ink2,'grain'],
  emergency:['D1',P.red3,'grid'],stethoscope:['D2',P.gray3,'tile'],empty:['D2',P.ink2,'grid'],
};
export function station(g,id,t=0){
  if(!cache[id]){
    const cv=document.createElement('canvas');cv.width=480;cv.height=270;
    const a=cv.getContext('2d'),[serial,base,style]=spec[id];
    const light=[P.milk2,P.gray3].includes(base);
    const thin=light?P.gray2:base===P.red3?P.red2:P.ash, glow=light?P.milk3:P.ash2;
    r(a,0,0,480,270,base);
    if(style==='tile'||style==='ceramic'){
      const w=style==='ceramic'?32:44, h=style==='ceramic'?21:34;
      for(let y=22;y<270;y+=h)for(let x=0;x<480;x+=w){
        r(a,x,y,w,1,thin);r(a,x,y+1,1,h-1,thin);r(a,x+2,y+2,w-4,1,glow);
        for(let i=0;i<4;i++)r(a,x+4+(i*13+y)%Math.max(3,w-8),y+4+i*3,1,1,thin);
      }
    }else if(style==='rail'){
      for(let y=30;y<270;y+=43){r(a,0,y,480,2,thin);r(a,0,y+3,480,1,glow);for(let x=8;x<480;x+=33)r(a,x,y+7,3,1,thin);}
    }else if(style==='grid'){
      for(let y=23;y<270;y+=8)for(let x=0;x<480;x+=8){r(a,x,y,1,1,thin);if(x%40===0&&y%3===0)r(a,x,y,3,1,glow);}
    }else{
      for(let i=0;i<230;i++){const x=i*197%480,y=24+i*151%246;r(a,x,y,3+i%12,1,i%5?thin:glow);}
    }
    r(a,0,22,480,2,light?P.ash2:P.ink);r(a,0,23,480,1,light?P.milk:P.red2);
    label(a,445,25,30,serial,!light);
    cache[id]=cv;
  }
  g.drawImage(cache[id],0,0);
  if(Math.floor(t*2)%4!==3)r(g,449,29,2,2,P.rose);
}
export function bezel(g,x,y,w,h,{invert=false}={}){
  slab(g,x,y,w,h,invert?P.ash:P.gray2,invert?P.ash2:P.milk3,P.ink3);
  rivets(g,x,y,w,h);
}
function cutMask(g,w,h,contains,main){
  const a=g.createImageData(w,h), colors=Object.fromEntries(Object.entries(P).map(([k,v])=>[k,v.match(/[\da-f]{2}/gi).map(n=>parseInt(n,16))]));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(!contains(x,y))continue;
    let c=main(x,y);
    if(!contains(x-1,y)||!contains(x+1,y)||!contains(x,y-1)||!contains(x,y+1))c='ink3';
    else if(!contains(x+3,y)||!contains(x,y+3))c='rose';
    else if(!contains(x-2,y)||!contains(x,y-2))c='milk3';
    const j=(x+y*w)*4;a.data.set(colors[c],j);a.data[j+3]=255;
  }
  g.putImageData(a,0,0);
}
function roundRectHit(x,y,a,b,w,h,rx,ry=rx){
  if(x<a||x>=a+w||y<b||y>=b+h)return false;
  const dx=Math.max(a+rx-x,0,x-(a+w-rx-1)),dy=Math.max(b+ry-y,0,y-(b+h-ry-1));
  return dx*dx/(rx*rx)+dy*dy/(ry*ry)<=1;
}
function kneaded(g,stage){
  const hand=(x,y)=>roundRectHit(x,y,148,65,202,156,34,26)||roundRectHit(x,y,109,95,80,47,17,16)
    ||roundRectHit(x,y,150,40,34,68,13)||roundRectHit(x,y,192,30,34,73,13)
    ||roundRectHit(x,y,234,34,34,71,13)||roundRectHit(x,y,276,46,34,67,12)
    ||roundRectHit(x,y,191,187,122,62,12);
  const knee=(x,y)=>roundRectHit(x,y,21,82,257,98,20)||roundRectHit(x,y,175,54,143,144,43,42)||roundRectHit(x,y,266,91,198,88,22);
  const arm=(x,y)=>roundRectHit(x,y,26,88,426,104,30,22)||roundRectHit(x,y,376,68,86,135,28,23);
  const hit=[hand,knee,arm][stage];
  cutMask(g,480,270,hit,(x,y)=>{
    if(stage===0){
      if(y>213&&x<315&&x>186)return y>229?'ash2':'gray2';
      if(y>167||(x>313&&y>93))return (x+2*y)%13===0?'rose':'rose2';
      if(y>135)return (x+y)%17===0?'rose2':'milk';
      return (x+3*y)%29===1?'rose2':'milk2';
    }
    if(stage===1){const d=Math.hypot((x-245)*.72,y-121);return d<30?'milk3':d<62?'milk2':y>142?'rose2':'milk';}
    return y>153||x>426?'rose2':y>126?'milk':'milk2';
  });
  if(stage===0){
    for(const [x,y,b] of [[157,46,67],[199,36,57],[241,40,61],[283,52,73]]){
      D.panel(g,x,y,20,16,{fill:P.rose2,line:P.rose,shadow:null,r:4});
      r(g,x+4,y+3,12,2,P.milk3);r(g,x+6,y+13,11,1,P.milk);
      r(g,x+3,b+9,14,1,P.rose);r(g,x+5,b+11,10,1,P.milk3);
    }
    D.panel(g,116,104,20,17,{fill:P.rose2,line:P.rose,shadow:null,r:4});r(g,119,106,10,2,P.milk3);
    const pts=[[148,122],[171,123],[187,128],[199,140],[204,151],[203,168],[196,177],[187,186]];
    for(let i=1;i<pts.length;i++)D.line(g,...pts[i-1],...pts[i],P.rose);
    for(const [x,y] of [[176,112],[209,112],[247,115],[289,118]]){r(g,x-7,y,15,1,P.rose2);r(g,x-4,y+2,9,1,P.milk3);}
    D.line(g,217,157,249,170,P.rose);D.line(g,249,170,282,171,P.rose);D.line(g,254,146,292,151,P.rose2);
    for(let j=0;j<7;j++)r(g,204+j*15,226,1,13,P.ash);
    r(g,194,220,115,2,P.milk);r(g,198,235,110,2,P.gray);
    D.cross(g,253,232,2,P.red);
  }else if(stage===1){
    D.line(g,206,122,217,103,P.rose2);D.line(g,217,103,235,96,P.milk3);D.line(g,262,149,283,134,P.rose);
    D.line(g,195,151,234,164,P.rose);D.line(g,234,164,266,160,P.rose);D.line(g,269,158,289,149,P.rose);
    for(let i=0;i<12;i++)r(g,218+i*19%74,104+i*23%42,2,1,P.rose2);
  }else{
    D.line(g,55,115,193,102,P.milk3);D.line(g,217,105,312,110,P.milk3);
    D.line(g,294,158,335,144,P.rose);D.line(g,335,144,357,111,P.rose2);
    D.line(g,375,116,381,145,P.rose);D.line(g,381,145,400,162,P.rose);
    for(let i=0;i<20;i++)r(g,83+i*17%282,120+i*19%45,1,1,P.rose2);
  }
}
const limbs=[];
export function washStation(g,stage,t){
  station(g,'disinfect',t);
  bezel(g,18,41,444,199,{invert:true});
  slab(g,23,46,434,188,P.gray2,P.milk3,P.ash);
  // Basin sides and trim: keep clear of the scrub targets.
  for(let x=30;x<450;x+=4){r(g,x,49,2,1,P.milk2);r(g,x,230,2,1,P.gray3);}
  for(let i=0;i<12;i++){
    const x=32+i*37%407,y=57+i*25%163+(Math.floor(t*7+i)%8);
    D.ring(g,x,y,2+(i%3),P.milk3);r(g,x,y-1,1,1,P.milk3);
  }
  if(stage==null)return;
  if(!limbs[stage]){
    const cv=document.createElement('canvas');cv.width=480;cv.height=270;kneaded(cv.getContext('2d'),stage);limbs[stage]=cv;
  }
  g.drawImage(limbs[stage],0,0);
}
