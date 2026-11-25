// Emrys Hale — hi-density pixel sprite (36x60 art pixels, drawn at half scale so callers keep their 18x30 box).
// Refined to match his illustration: shaggy milk hair with ink strands, nurse cap, forehead stitch mark,
// open lab coat with red armbands, high black collar, silver cross, clip badge, belt straps, black gloves and boots.
import { P } from './palette.js';
const C={O:P.ink,k:P.ink2,K:P.ink3,a:P.ash,A:P.ash2,g:P.gray,G:P.gray2,t:P.gray3,h:P.milk,w:P.milk2,s:P.milk3,r:P.red,R:P.red2,d:P.red3,p:P.rose,q:P.rose2};
const HEAD=[
  '..............OOOOOOOO..............',
  '............OOssssssssOOO...........',
  '...........OsssssssrrsssOO..........',
  '..........OssssssrrrrrrssO..........',
  '..........OtsssssssrrssstO..........',
  '.........OOkkkkkkkkkkkkkkkO.........',
  '........OOssssssssssssssttOO........',
  '......OOkOOOOOOOOOOOOOOOOOOhOO......',
  '.....OtkkhhhhhhhhhhhhhhhhhhhhhO.....',
  '...OhhkkhhhhshhhhhhhhhhhhshhhhhOO...',
  '..OthkkhhhhshhhhhhhhhhhhshhhhhthhO..',
  '.OthkkhhhhhhhhhhhhhhhhhhhhhhhhhthO..',
  '.OhhkhhhhhOhhhhhhOhhhhhhhOhhhhthtO..',
  'OthhhhhhhOsOhhhhOsOhhhhhOsOhhhhthtO.',
  'OtthhhhhOssOhhhOsssOhhhOsOkOhhhhttO.',
  '.OhthhhOssssOhOsssssOhOsssOOhhthhtO.',
  '.OttthhOsOOOOOsssssssOOOOOsOhhhthtO.',
  '.OththhOsOdRRkOsssssOdRRkOsOhhthhtO.',
  '.OhtthhOssOdkssssssssOdkssOhhhthGtO.',
  '.OththhOssAqAssssssssAqAssOhhhtGtO..',
  '.OttthhOsssssssssAsssssssOhhhtthGtO.',
  '.OhhtthOsssssssssssssssssOhhhtthGtO.',
  '.OtttthhOsssssssOOsssssssOhhhtthGtO.',
  '..OthtthOOsssssssssssssOOhhhtthGtO..',
  '..OhttthhhOOtssssssstOOhhhhttthGtO..'
];

const BACK_L=[[3,9],[2,9],[2,9],[2,9],[1,9],[1,9],[1,8],[1,8],[1,8],[2,8],[2,8],[2,7],[3,7],[3,7],[4,6]];
const BACK_R=[[27,33],[27,34],[27,34],[27,34],[27,35],[27,35],[28,34],[28,34],[28,34],[28,33],[29,33],[29,33],[30,32]];
export function drawEmrys(g,x,y,{frame=0,blink=false,flip=false,bob=0,time=0,moving=false}={}){
  g.save();
  g.translate(x,y); if(flip) g.scale(-1,1); g.scale(.5,.5); g.translate(-18,-60);
  const q=(x,y,w,h,c)=>{g.fillStyle=C[c]||c;g.fillRect(x,y,w,h);};
  const box=(x,y,w,h,c)=>{q(x,y,w,h,'O');q(x+1,y+1,w-2,h-2,c);};
  const step=moving?[0,1,0,-1][frame%4]:0;
  const lift=moving&&frame%2===1?1:0;
  const breath=!moving&&Math.sin(time*2.1)>.55?1:0;
  const sway=moving?(frame%4<2?1:-1):Math.round(Math.sin(time*1.3)*.6);
  const by=lift+bob;
  // ground shadow
  g.fillStyle='rgba(18,16,18,.28)';g.fillRect(6,58,24,3);g.fillRect(9,61,18,1);
  // long hair behind the shoulders
  const back=(rows,y0,side)=>rows.forEach(([a,b],i)=>{const dx=i>8?sway*side:0;q(a+dx,y0+i+by,b-a+1,1,'O');if(b-a>1)q(a+1+dx,y0+i+by,b-a-1,1,'h');if(b-a>3)q(a+2+dx+(side<0?1:0),y0+i+by,1,1,'t');});
  back(BACK_L,22,1);back(BACK_R,22,-1);
  q(4+sway,37+by,2,3,'O');q(5+sway,37+by,1,2,'h');q(30-sway,35+by,2,3,'O');q(30-sway,35+by,1,2,'h');
  // legs + thigh strap
  const leg=(lx,dx,up)=>{
    const top=44+by, bot=56-up;
    box(lx+dx,top,6,bot-top+1,'k');q(lx+dx+1,top+1,1,bot-top-1,'K');
    q(lx+dx,51-up,6,2,'O');q(lx+dx+1,51-up,4,1,'a');q(lx+dx+2,51-up,2,1,'G');
    box(lx+dx-1,55-up,8,5,'k');q(lx+dx,56-up,5,1,'a');q(lx+dx+1,57-up,1,1,'A');q(lx+dx-1,59-up,8,1,'O');
  };
  leg(11,step,step>0?1:0); leg(19,-step,step<0?1:0);
  // thigh buckle on right leg
  q(11+step,47+by,6,2,'O');q(13+step,47+by,2,2,'G');
  // coat skirt: opens in an inverted V below the belt
  const ty=23+by+breath, belt=ty+14;
  for(let r=0;r<=13;r++){
    const yy=belt+2+r, open=Math.min(4,r>>1), sw=r>6?sway:0;
    const lx0=9-(r>9?1:0)+sw, lx1=17-open+sw, rx0=19+open+sw, rx1=27+(r>9?1:0)+sw;
    const last=r===13;
    q(lx0,yy,lx1-lx0+1,1,'O'); if(!last) q(lx0+1,yy,lx1-lx0-1,1,r>10?'t':'w');
    q(rx0,yy,rx1-rx0+1,1,'O'); if(!last) q(rx0+1,yy,rx1-rx0-1,1,r>10?'t':'w');
    if(!last){q(lx1-1,yy,1,1,'t');q(rx0+1,yy,1,1,'t');}
  }
  q(11,belt+5,4,1,'G');q(22,belt+5,4,1,'G');
  // dangling crimson straps with white crosses
  const strap=(sx,len,dx)=>{const y0=belt+2;q(sx+dx,y0,3,len,'O');q(sx+dx+1,y0,1,len-1,'R');q(sx+dx,y0+len-5,3,5,'O');q(sx+dx+1,y0+len-4,1,3,'s');q(sx+dx,y0+len-3,3,1,'s');q(sx+dx+1,y0+len-3,1,1,'r');};
  strap(9,16,-sway); strap(25,14,sway);
  // torso
  box(9,ty+1,19,15-breath,'w');
  q(10,ty+2,2,12,'t');q(25,ty+2,2,12,'t');
  box(14,ty,9,15,'K');q(15,ty+1,7,2,'k');q(16,ty+3,5,1,'O');q(15,ty+6,1,7,'k');
  for(let i=0;i<11;i++){q(13+(i>>2),ty+2+i,1,1,'O');q(23-(i>>2),ty+2+i,1,1,'O');}
  // lapel cross + buttons
  q(12,ty+3,1,1,'G');q(24,ty+3,1,1,'G');q(12,ty+6,1,1,'G');q(24,ty+6,1,1,'G');
  q(12,ty+9,1,3,'r');q(11,ty+10,3,1,'r');
  // silver necklace cross
  q(16,ty+4,1,1,'G');q(16,ty+5,1,1,'g');q(17,ty+6,1,1,'G');q(17,ty+7,1,5,'s');q(16,ty+8,3,1,'s');q(18,ty+9,1,3,'g');
  // clip ID badge
  q(21,ty+3,1,4,'G');box(20,ty+6,5,6,'s');q(22,ty+7,1,3,'r');q(21,ty+8,3,1,'r');q(21,ty+10,3,1,'t');
  // belt + buckle
  q(9,belt,19,3,'O');q(10,belt+1,17,1,'k');box(16,belt,5,3,'G');q(17,belt+1,3,1,'O');q(12,belt+1,1,1,'a');q(24,belt+1,1,1,'a');
  // arms: shoulder cross, red armband, cuff, black glove
  const swing=moving?(frame%4===1?1:frame%4===3?-1:0):0;
  const arm=(ax,dy,mir)=>{
    const ay=ty+1+dy;
    box(ax,ay,6,17,'w');q(ax+(mir?1:4),ay+1,1,15,'t');
    q(ax+2,ay+2,1,3,'r');q(ax+1,ay+3,3,1,'r');
    q(ax,ay+8,6,3,'O');q(ax+1,ay+8,4,1,'R');q(ax+1,ay+9,4,1,'d');q(ax+1,ay+10,4,1,'R');
    q(ax,ay+15,6,2,'O');q(ax+1,ay+15,4,1,'G');
    box(ax+(mir?0:1),ay+16,5,4,'k');q(ax+(mir?1:2),ay+17,2,1,'a');q(ax+(mir?1:2),ay+19,1,1,'O');q(ax+(mir?3:4),ay+19,1,1,'O');
  };
  arm(4,swing,false); arm(27,-swing,true);
  // head
  const hy=bob+(moving&&lift?1:0);
  HEAD.forEach((row,yy)=>{for(let xx=0;xx<row.length;xx++){const c=row[xx];if(c!=='.')q(xx,yy+hy,1,1,c);}});
  // forehead stitch mark on right brow
  q(21,15+hy,4,1,'k');q(22,14+hy,1,3,'k');q(24,14+hy,1,3,'k');
  // eyes: idle glint / blink
  if(blink){
    q(9,17+hy,5,3,'s');q(21,17+hy,5,3,'s');q(9,17+hy,5,1,'O');q(21,17+hy,5,1,'O');q(10,19+hy,3,1,'A');q(22,19+hy,3,1,'A');
  } else if(Math.sin(time*.9)>.2){ q(10,17+hy,1,1,'q');q(22,17+hy,1,1,'q'); }
  // swinging hair tips at the face sides
  q(0+(sway>0?1:0),14+hy,1,2,'O');q(34-(sway<0?1:0),13+hy,1,2,'O');
  g.restore();
}
