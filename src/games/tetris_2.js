import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const T2 = {
            n:"TETRIS 2", st:'START', sc:0, lv:1, fl:0, bd:[], pc:null, cx:0, cy:0, mT:0, fT:0,
            ini(){ this.st='START'; this.lv=1; this.sc=0; },
            ld(){
                this.bd = Array(16).fill(0).map(()=>Array(10).fill(0)); this.fl=0;
                let fN = M.min(12, 2+this.lv*2), rws = M.min(10, 3+~~(this.lv/2));
                let sC = (x,y) => { let cs=[1,2,3].sort(()=>M.random()-.5); for(let c of cs){ if(!(x>=2&&this.bd[y][x-1]?.c===c&&this.bd[y][x-2]?.c===c)&&!(y>=2&&this.bd[y-1]?.[x]?.c===c&&this.bd[y-2]?.[x]?.c===c)) return c; } return 1; };
                let bts=[]; for(let y=15;y>15-rws;y--) for(let x=0;x<10;x++) if(M.random()<.4) bts.push({x,y}); bts.sort(()=>M.random()-.5);
                for(let i=0;i<bts.length;i++){ let p=bts[i], iF=i<fN; this.bd[p.y][p.x]={c:sC(p.x,p.y), f:iF}; if(iF) this.fl++; }
                while(this.fl<fN){ let rx=~~(M.random()*10), ry=15-~~(M.random()*rws); if(!this.bd[ry][rx]){ this.bd[ry][rx]={c:sC(rx,ry), f:1}; this.fl++; } else if(!this.bd[ry][rx].f){ this.bd[ry][rx].f=1; this.fl++; } }
                this.DROP_SPEED = Math.max(150, 800 - this.lv * 60); this.gameState = 'FALLING';
            },
            sp(){
                let sh = [[[0,0],[-1,0],[1,0],[0,-1]], [[0,0],[1,0],[0,1],[1,1]], [[0,0],[-1,0],[1,0],[1,-1]], [[0,0],[-1,0],[1,0],[-1,-1]], [[0,0],[-1,0],[1,0],[2,0]], [[0,0],[-1,0],[0,-1],[1,-1]], [[0,0],[1,0],[0,-1],[-1,-1]]];
                this.pc = sh[~~(M.random()*sh.length)].map(p=>({x:p[0],y:p[1],c:~~(M.random()*3)+1})); this.cx=4; this.cy=0; this.mT=0;
                this.st = this.cK(this.cx,this.cy,this.pc) ? 'GAMEOVER' : 'PLAYING';
            },
            cK(x,y,b){ for(let p of b){ let nx=x+p.x, ny=y+p.y; if(nx<0||nx>=10||ny>=16||(ny>=0&&this.bd[ny][nx])) return 1; } return 0; },
            lk(){ for(let p of this.pc) if(this.cy+p.y>=0) this.bd[this.cy+p.y][this.cx+p.x]={c:p.c, f:0}; this.pc=null; this.st='FALLING'; },
            mt(){
                let cl = new Set();
                for(let y=0;y<16;y++) for(let x=0;x<8;x++){ let c=this.bd[y][x]?.c; if(c&&c===this.bd[y][x+1]?.c&&c===this.bd[y][x+2]?.c){ cl.add(`${x},${y}`);cl.add(`${x+1},${y}`);cl.add(`${x+2},${y}`); let k=3; while(x+k<10&&this.bd[y][x+k]?.c===c)cl.add(`${x+k++},${y}`); } }
                for(let x=0;x<10;x++) for(let y=0;y<14;y++){ let c=this.bd[y][x]?.c; if(c&&c===this.bd[y+1][x]?.c&&c===this.bd[y+2][x]?.c){ cl.add(`${x},${y}`);cl.add(`${x},${y+1}`);cl.add(`${x},${y+2}`); let k=3; while(y+k<16&&this.bd[y+k][x]?.c===c)cl.add(`${x},${y+k++}`); } }
                if(cl.size>0){ for(let k of cl){ let [x,y]=state.k.split(','); if(this.bd[y][x].f) this.fl--; this.bd[y][x]=0; this.sc+=10; } return 1; } return 0;
            },
            upd(dt){
                if(this.st==='MATCHING'){ if(this.mt()){ this.fT=0; this.st='FALLING'; }else{ if(this.fl<=0) this.st='TRANS'; else this.sp(); } return; }
                if(this.st==='FALLING'){ this.fT+=dt; if(this.fT>80){ this.fT=0; let fl=0; for(let x=0;x<10;x++) for(let y=14;y>=0;y--) if(this.bd[y][x]&&!this.bd[y+1][x]){ this.bd[y+1][x]=this.bd[y][x]; this.bd[y][x]=0; fl=1; } if(!fl) this.st='MATCHING'; } return; }
                if(this.st==='PLAYING'){ this.mT+=dt; let sp=state.k.D?50:M.max(150,800-this.lv*60); if(this.mT>sp){ this.mT=0; if(!this.cK(this.cx,this.cy+1,this.pc)) this.cy++; else this.lk(); } }
            },
            inp(b){
                if(this.st==='START'||this.st==='GAMEOVER'){ if(b==='ST'||b==='A') this.ld(); } else if(this.st==='TRANS'){ if(b==='ST'||b==='A'){ this.lv++; this.ld(); } }
                else if(this.st==='PLAYING'){ if(b==='L'&&!this.cK(this.cx-1,this.cy,this.pc)) this.cx--; else if(b==='R'&&!this.cK(this.cx+1,this.cy,this.pc)) this.cx++; else if(b==='A'||b==='B'||b==='U'){ let rt=this.pc.map(p=>({x:-p.y, y:p.x, c:p.c})); if(!this.cK(this.cx,this.cy,rt)) this.pc=rt; else if(!this.cK(this.cx-1,this.cy,rt)){this.cx--;this.pc=rt;} else if(!this.cK(this.cx+1,this.cy,rt)){this.cx++;this.pc=rt;} } }
            },
            drw(){
                if(this.st==='START'){ txt("TETRIS 2",100,20,16); txt("MATCH 3",100,110,10); txt("PRESS START",100,140,8); return; }
                fr(10,20,100,160,C3); sr(9,19,102,162,C1);
                txt(`LVL:${this.lv}`,115,30,8,'left'); txt(`SCORE`,115,60,8,'left'); txt(`${this.sc}`,115,75,8,'left'); txt(`FLASH`,115,105,8,'left'); txt(`${this.fl}`,115,120,8,'left');
                let db = (x,y,c,f) => { if(y<0)return; let px=10+x*10, py=20+y*10, iv=f&&(~~(state.gT/200)%2===0); fr(px,py,10,10,iv?C2:(c===3?C1:C0)); if(c===2){ fr(px+2,py+2,6,6,iv?C0:C3); } else if(c===3){ fr(px+4,py+2,2,6,iv?C0:C3); fr(px+2,py+4,6,2,iv?C0:C3); } };
                for(let y=0;y<16;y++) for(let x=0;x<10;x++) if(this.bd[y][x]) db(x,y,this.bd[y][x].c,this.bd[y][x].f);
                if(this.st==='PLAYING'&&this.pc) for(let p of this.pc) db(this.cx+p.x,this.cy+p.y,p.c,0);
                if(this.st==='TRANS'||this.st==='GAMEOVER'){ fr(10,60,100,60,'rgba(155,188,15,.9)'); txt(this.st==='TRANS'?"LEVEL UP!":"GAME OVER",60,90,10); txt("PRESS START",60,105,8); }
            },
            art(x,y,w,h){ fr(x,y,w,h,C3); sr(x,y,w,h,C0); fr(x+w/2-10,y+10,20,10,C0); fr(x+w/2-5,y+20,10,10,C0); fr(x+10,y+35,10,10,C0); fr(x+22,y+35,10,10,C1); }
        };