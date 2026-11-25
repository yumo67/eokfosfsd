import { P } from './palette.js';
import * as D from './draw.js';
const r = D.rect;
const ln = D.line;
export function slab(g,x,y,w,h,base=P.gray2,hi=P.milk3,lo=P.ash) {
  if(w<=0||h<=0)return;
  D.panel(g,x,y,w,h,{fill:base,line:P.ink3,shadow:null,r:Math.min(2,Math.floor(Math.min(w,h)/3))});
  if(w>6&&h>5){r(g,x+3,y+2,w-6,1,hi);r(g,x+3,y+h-3,w-6,2,lo);}
  if(w>6&&h>8)r(g,x+w-3,y+4,2,h-8,lo);
}
export function rivets(g,x,y,w,h,c=P.ash2) {
  for(const a of [x+3,x+w-4]) for(const b of [y+4,y+h-5]) {r(g,a,b,1,1,c);r(g,a,b+1,1,1,P.milk2);}
}
export function label(g,x,y,w,id,dark=false) {
  slab(g,x,y,w,10,dark?P.ink3:P.milk2,dark?P.ash:P.milk3,dark?P.ink:P.gray2);
  r(g,x+3,y+3,3,4,P.red); D.text(g,id,x+w/2+2,y+2,{size:6,color:dark?P.milk3:P.ink3,align:'center',bold:true});
}
export function pane(g,x,y,w,h,corridor=false) {
  slab(g,x-5,y-5,w+10,h+10,P.ash2,P.milk3,P.ash);
  r(g,x,y,w,h,P.ink2);
  if(!corridor) {
    D.circle(g,x+w-19,y+18,9,P.gray3);D.circle(g,x+w-15,y+15,8,P.ink2);
    for(let i=0;i<26;i++) r(g,x+2+i*19%(w-4),y+2+i*13%(h-8),1,i%9?1:2,i%3?P.ash2:P.milk3);
    for(let i=0;i<w;i+=7) {
      const a=8+i*11%18; r(g,x+i,y+h-a,Math.min(7,w-i),a,P.ink);
      if(i%3) r(g,x+i+2,y+h-a+4,1,2,P.rose);
    }
  } else {
    r(g,x,y,w,h,P.ash); r(g,x+2,y+6,w-4,2,P.gray2);
    for(let i=0;i<8;i++) {const a=x+4+i*8; r(g,a,y+17,4,h-22,P.ink);r(g,a,y+26,2,1,P.red);}
  }
  for(const i of [w/3,2*w/3]){r(g,x+i-1,y,3,h,P.ash2);r(g,x+i-1,y,1,h,P.gray3);}
  r(g,x,y+h*.68,w,3,P.ash2);r(g,x,y+h*.68,w,1,P.gray2);
  r(g,x-8,y+h+3,w+16,4,P.milk);r(g,x-8,y+h+7,w+16,2,P.ash);
}
const plaque = {reception:'01',corridor:'00',office:'02',ward:'03',pharmacy:'04',lounge:'05',storage:'06',records:'B1'};
export function architecture(g,id,{wall,wains,floorA,floorB,stripe,dark}) {
  const dim=id==='storage'||id==='records';
  r(g,0,0,480,270,P.ink3);r(g,0,33,480,182,wall);
  r(g,0,33,480,7,dim?P.ash2:P.gray2);
  for(let x=0;x<490;x+=96){
    const c=dim?P.ash2:P.gray3;
    r(g,x,43,1,114,c);r(g,x+1,44,1,111,dim?P.gray:P.milk3);
    for(let y=49;y<157;y+=6)for(let q=3;q<94;q+=7) if((q+3*y)%14<5)r(g,x+q,y+(q%3),1,1,c);
    r(g,x+4,166,88,40,dim?P.ash:wains);
    r(g,x+5,169,86,35,dim?P.ash2:wains);
    r(g,x+6,170,84,1,dim?P.gray:P.milk2);
    for(let q=10;q<90;q+=5)r(g,x+q,172,1,31,dim?P.ash:P.gray2);
    r(g,x+3,207,90,1,dim?P.ink3:P.gray);
    ln(g,x,2,x-17,26,P.ash2); r(g,x+3,9,66,1,P.ash);
  }
  r(g,0,25,480,8,P.ink2);r(g,0,32,480,2,P.ash2);
  for(let x=0;x<480;x+=8)r(g,x,30,3,1,P.ash);
  r(g,0,158,480,2,dim?P.gray:P.milk3);r(g,0,160,480,3,stripe);
  r(g,0,163,480,2,dim?P.ink:P.ash2);
  r(g,0,210,480,5,P.ink3);r(g,0,211,480,1,P.gray);
  r(g,0,215,480,55,floorA);
  for(let y=215,i=0;y<270;i++){
    const h=5+i*3;
    for(let j=-12;j<13;j++){
      const x0=240+j*(26+i*5), x1=240+j*(31+i*5), dx=i%2?12:0;
      const a=x0+dx,b=x1+dx;
      for(let k=0;k<h;k++){const x=Math.round(a+(b-a)*k/h); r(g,x,y+k,Math.ceil(26+i*5+5*k/h),1,(i+j)%2?floorA:floorB);r(g,x,y+k,1,1,dim?P.ash:P.gray2);}
      r(g,a+4,y+2,3+(j*j%6),1,dim?P.gray:P.milk);
    }
    r(g,0,y,480,1,dim?P.ash:P.gray);y+=h;
  }
  r(g,0,254,480,1,dim?P.ash2:P.gray2);
  for(let x=5;x<480;x+=14)r(g,x,256,8,1,dim?P.ash2:P.red2);
  label(g,18,43,30,plaque[id]||'00',dim);
  if(dark) { g.globalAlpha=dark*.6; r(g,0,34,480,236,P.ink);g.globalAlpha=1; }
}
export function fixtures(g,id,t,xs,flick=0) {
  for(const [i,x] of xs.entries()){
    const on=!(flick && (Math.sin(t*13+i*7)>.985));
    r(g,x-22,21,44,9,P.ink);r(g,x-20,22,40,3,P.ash);
    r(g,x-18,25,36,3,on?P.milk3:P.ash2);
    r(g,x-16,28,32,1,on?P.rose2:P.ink3);
    if(on){
      const gl=g.createRadialGradient(x,29,4,x,29,119);
      gl.addColorStop(0,'rgba(251,248,242,.16)');gl.addColorStop(1,'rgba(251,248,242,0)');
      g.fillStyle=gl;g.fillRect(x-118,30,236,122);
      const xx=x-28+(i*17+Math.floor(t*2))%56, yy=43+(i*37+Math.floor(t*3))%87;
      r(g,xx,yy,1,1,P.milk3);
    }
  }
}
export function skyline(g,t=0,{wide=false}={}) {
  for(let y=0;y<270;y+=2) {
    const col=y<96?P.ink:y<140?P.ink2:y<176?P.ink3:y<213?P.red3:P.ink2;
    r(g,0,y,480,2,col);
  }
  for(let i=0;i<95;i++){
    const x=i*173%480,y=(i*i*11+i*13)%173;
    r(g,x,y,1,1,(i+Math.floor(t))%12===0?P.milk3:P.ash2);
  }
  const mx=wide?350:284,my=wide?83:72, mr=wide?42:27;
  D.circle(g,mx,my,mr,P.rose2); D.circle(g,mx+10,my-7,mr-5,P.ink2);
  for(let i=0;i<10;i++)r(g,mx-mr+4+i%3,my-mr/2+i*3,5+(i%5),1,P.rose);
  for(let layer=0;layer<3;layer++){
    const y=205+layer*18;
    for(let j=0;j<28;j++){
      const x=j*19-layer*8,w=9+(j*17+layer*3)%12,h=15+(j*37+layer*17)%61;
      r(g,x,y-h,w,h,layer===0?P.ash:layer===1?P.ink3:P.ink);
      r(g,x+2,y-h-2,w-4,2,layer===0?P.ash2:P.ink2);
      if(j%4===0){r(g,x+4,y-h-8,1,8,P.ash2);r(g,x+4,y-h-8,1,1,P.red);}
      for(let a=3;a<w-1;a+=5)for(let b=5;b<h-2;b+=7)
        if((j+a+b+layer)%5<2) r(g,x+a,y-h+b,2,2,(j+a+b)%8?P.ash2:P.rose);
    }
  }
}
