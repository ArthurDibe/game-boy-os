import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const SN = {
            n:"SNAKE", st:'START', sc:0, hs:localStorage.getItem('gbS')||0, s:[], f:{x:0,y:0}, dx:1, dy:0, mT:0,
            ini(){ this.st='START'; this.s=[{x:10,y:10},{x:9,y:10},{x:8,y:10}]; this.dx=1; this.dy=0; this.sc=0; this.mT=0; this.pF(); },
            pF(){ let v=0; while(!v){ this.f={x:~~(M.random()*20),y:~~(M.random()*20)}; v=1; for(let p of this.s)if(p.x===this.f.x&&p.y===this.f.y)v=0; } },
            upd(dt){ if(this.st!=='PLAYING')return; this.mT+=dt; if(this.mT<120)return; this.mT=0; let h={x:this.s[0].x+this.dx,y:this.s[0].y+this.dy}; if(h.x<0||h.x>=20||h.y<0||h.y>=20){this.gO();return;} for(let p of this.s)if(h.x===p.x&&h.y===p.y){this.gO();return;} this.s.unshift(h); if(h.x===this.f.x&&h.y===this.f.y){this.sc+=10;this.pF();}else this.s.pop(); },
            inp(b){ if(this.st!=='PLAYING'){ if(b==='ST'||b==='A'){if(this.st==='GAMEOVER')this.ini();this.st='PLAYING';} return; } if(b==='U'&&this.dy!==1){this.dx=0;this.dy=-1;} if(b==='D'&&this.dy!==-1){this.dx=0;this.dy=1;} if(b==='L'&&this.dx!==1){this.dx=-1;this.dy=0;} if(b==='R'&&this.dx!==-1){this.dx=1;this.dy=0;} },
            drw(){ if(this.st==='START'){txt("SNAKE",100,20,16);txt("PRESS START",100,140,8);if(this.hs>0)txt(`HI:${this.hs}`,100,105,8);}else if(this.st==='PLAYING'){ if(~~(state.gT/200)%2===0)fr(this.f.x*10+1,this.f.y*10+1,8,8,C0); this.s.forEach(p=>fr(p.x*10+1,p.y*10+1,8,8,C0)); txt(`SC:${this.sc}`,5,12,8,'left'); }else if(this.st==='GAMEOVER'){txt("GAME OVER",100,90,12);txt(`SC:${this.sc}`,100,115,10);} },
            gO(){ this.st='GAMEOVER'; if(this.sc>this.hs){this.hs=this.sc;localStorage.setItem('gbS',this.hs);} },
            art(x,y,w,h){ fr(x,y,w,h,C3); sr(x,y,w,h,C0); fr(x+10,y+25,6,6,C0); fr(x+16,y+25,6,6,C0); fr(x+22,y+25,6,6,C0); fr(x+22,y+19,6,6,C0); fr(x+28,y+19,6,6,C0); fr(x+30,y+20,2,2,C3); }
        };