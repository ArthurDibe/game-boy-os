import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const CR = {
            n:"CATRAP", st:'START', lv:0, fr:"", fT:0, rT:0, m:[], p:{x:0,y:0}, bs:[], es:[], hs:[],
            ls:[ 
                [ "WWWWWWWWWW", "WWP   B  W", "WWLWWWW  W", "WWL    E W", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW" ],
                [ "WWWWWWWWWW", "WW B P B W", "WW WWWWW W", "WWE     EW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW" ],
                [ "WWWWWWWWWW", "W P L B  W", "WWW L W  W", "W B L  E W", "W W L WW W", "WE  L    W", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW" ],
                [ "WWWWWWWWWW", "W P L B  W", "WWWWLWW  W", "W B L  E W", "W WWLWWWWW", "WE  L    W", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW" ],
                [ "WWWWWWWWWW", "W P  B W W", "WWW L DW W", "W   L E  W", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW", "WWWWWWWWWW" ]
            ],
            ini(){ this.st='START'; this.lv=0; },
            ld(i){ if(i>=this.ls.length){ this.st='GAMEOVER'; this.fr="ALL CLEARED!"; return; } this.lv=i; let l=this.ls[i]; this.m=[]; this.bs=[]; this.es=[]; this.hs=[]; for(let y=0;y<10;y++){ let r=[]; for(let x=0;x<10;x++){ let c=l[y][x]; if(c==='P'){this.p={x,y};r.push(' ');}else if(c==='B'){this.bs.push({x,y});r.push(' ');}else if(c==='E'){this.es.push({x,y});r.push(' ');}else r.push(c); } this.m.push(r); } this.st='PLAYING'; },
            sv(){ this.hs.push({p:{...this.p}, b:this.bs.map(b=>({...b})), e:this.es.map(e=>({...e})), m:this.m.map(r=>[...r])}); if(this.hs.length>200)this.hs.shift(); },
            rw(){ if(!this.hs.length)return; let s=this.hs.pop(); this.p={...s.p}; this.bs=s.b.map(b=>({...b})); this.es=s.e.map(e=>({...e})); this.m=s.m.map(r=>[...r]); this.st='PLAYING'; },
            cF(m){ let x=m.x, y=m.y; if(this.m[y][x]==='L'||y+1>=10)return 0; let b=this.m[y+1][x]; if(b==='W'||b==='D'||b==='L')return 0; for(let bd of this.bs)if(bd.x===x&&bd.y===y+1)return 0; return 1; },
            iF(){ for(let m of [this.p,...this.bs,...this.es])if(this.cF(m))return 1; return 0; },
            upd(dt){
                if(this.st!=='PLAYING'&&this.st!=='GAMEOVER')return;
                if(state.k.A){ this.rT+=dt; if(this.rT>80){this.rT=0;this.rw();} return; } else this.rT=0;
                if(this.st!=='PLAYING')return;
                this.fT+=dt; if(this.fT>100){ this.fT=0; let wf=0, ms=[this.p,...this.bs,...this.es]; for(let m of ms)if(this.cF(m))wf=1;
                if(wf){ this.sv(); ms.sort((a,b)=>b.y-a.y); for(let m of ms){ if(this.cF(m)){ m.y++; if(m===this.p){ let i=this.es.findIndex(e=>e.x===m.x&&e.y===m.y); if(i!==-1){this.fr="TOUCHED GHOST!";this.st='GAMEOVER';} }else if(this.bs.includes(m)){ let i=this.es.findIndex(e=>e.x===m.x&&e.y===m.y); if(i!==-1)this.es.splice(i,1); if(this.p.x===m.x&&this.p.y===m.y){this.fr="CRUSHED!";this.st='GAMEOVER';} }else if(this.es.includes(m)){ if(this.p.x===m.x&&this.p.y===m.y){this.fr="TOUCHED GHOST!";this.st='GAMEOVER';} } } } if(!this.es.length)this.st='TRANS'; } }
            },
            inp(b){
                if(this.st==='START'){if(b==='ST'||b==='A')this.ld(0);return;} if(this.st==='TRANS'){if(b==='ST'||b==='A')this.ld(this.lv+1);return;} if(this.st==='GAMEOVER'||b==='B'){if(b==='B')this.ld(this.lv);return;}
                if(b==='U'||b==='D'||b==='L'||b==='R'){ if(this.iF())return; let dx=0,dy=0; if(b==='U')dy=-1; if(b==='D')dy=1; if(b==='L')dx=-1; if(b==='R')dx=1; let nx=this.p.x+dx,ny=this.p.y+dy; if(nx<0||nx>=10||ny<0||ny>=10)return; let tM=this.m[ny][nx];
                    if(dy!==0){ let cL=this.m[this.p.y][this.p.x]==='L', nL=tM==='L', dD=(tM==='D'&&dy===1); if(!cL&&!nL&&!dD)return; } if(tM==='W')return;
                    let tE=this.es.findIndex(e=>e.x===nx&&e.y===ny); if(tE!==-1){this.sv();this.p={x:nx,y:ny};this.fr="TOUCHED GHOST!";this.st='GAMEOVER';return;}
                    let bI=this.bs.findIndex(bo=>bo.x===nx&&bo.y===ny); if(bI!==-1){ if(dy!==0)return; let nnx=nx+dx; if(nnx<0||nnx>=10||this.m[ny][nnx]==='W'||this.m[ny][nnx]==='D'||this.m[ny][nnx]==='L'||this.bs.find(bo=>bo.x===nnx&&bo.y===ny))return; this.sv(); let eH=this.es.findIndex(e=>e.x===nnx&&e.y===ny); if(eH!==-1)this.es.splice(eH,1); this.bs[bI].x=nnx; }else this.sv();
                    if(tM==='D'){ if(dy===-1){this.hs.pop();return;} this.m[ny][nx]=' '; } this.p={x:nx,y:ny}; if(!this.es.length)this.st='TRANS';
                }
            },
            drw(){
                if(this.st==='START'){ txt("CATRAP",100,20,16); txt("PRESS START",100,140,8); return; } if(this.st==='TRANS'){ txt(`LVL ${this.lv+1} CLEAR!`,100,90,10); if(~~(state.gT/400)%2===0)txt("PRESS START",100,120,8); return; }
                for(let y=0;y<10;y++)for(let x=0;x<10;x++){ let t=this.m[y][x], px=x*20, py=y*20; if(t==='W'){ fr(px,py,20,20,C1); fr(px+2,py+2,16,16,C3); fr(px+4,py+4,12,12,C0); }else if(t==='L'){ fr(px+4,py,2,20,C1); fr(px+14,py,2,20,C1); for(let i=2;i<20;i+=6)fr(px+4,py+i,12,2,C1); }else if(t==='D'){ for(let i=0;i<2;i++)for(let j=0;j<2;j++)if((i+j)%2===0)fr(px+i*10,py+j*10,10,10,C1); } }
                for(let b of this.bs){ ctx.fillStyle=C0; ctx.beginPath(); ctx.arc(b.x*20+10,b.y*20+10,8,0,M.PI*2); ctx.fill(); }
                for(let e of this.es){ let px=e.x*20, py=e.y*20; ctx.fillStyle=C1; ctx.beginPath(); ctx.arc(px+10,py+10,8,M.PI,0); ctx.lineTo(px+18,py+18); ctx.lineTo(px+14,py+16); ctx.lineTo(px+10,py+18); ctx.lineTo(px+6,py+16); ctx.lineTo(px+2,py+18); ctx.fill(); fr(px+6,py+6,2,2,C3); fr(px+12,py+6,2,2,C3); }
                let px=this.p.x*20, py=this.p.y*20; fr(px+4,py+4,4,4,C0); fr(px+12,py+4,4,4,C0); fr(px+4,py+8,12,10,C0); fr(px+6,py+10,2,2,C3); fr(px+12,py+10,2,2,C3); fr(px+9,py+14,2,2,C3);
                txt(`LVL:${this.lv+1}`,5,12,8,'left',C3); txt(`ENEMY:${this.es.length}`,110,12,8,'left',C3); fr(0,188,200,12,'rgba(155,188,15,.7)'); txt("A:REW B:RESET",100,197,8);
                if(this.st==='GAMEOVER'){ fr(10,60,180,80,'rgba(155,188,15,.9)'); sr(10,60,180,80,C0); if(this.fr==="ALL CLEARED!")txt("YOU WIN!",100,90,12);else{txt("GAME OVER",100,85,12);txt(this.fr,100,105,8);} if(~~(state.gT/400)%2===0)txt("HOLD A: REWIND",100,125,8); }
            },
            art(x,y,w,h){ fr(x,y,w,h,C3); sr(x,y,w,h,C0); let cx=x+30, cy=y+25; fr(cx-6,cy-4,4,4,C0); fr(cx+6,cy-4,4,4,C0); fr(cx-6,cy,16,12,C0); fr(cx-2,cy+3,2,2,C3); fr(cx+4,cy+3,2,2,C3); ctx.fillStyle=C1; ctx.beginPath(); ctx.arc(x+55,y+25,8,0,M.PI*2); ctx.fill(); }
        };