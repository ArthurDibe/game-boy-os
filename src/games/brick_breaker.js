import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const BB = {
            n:"BRICK BREAKER", st:'START', sc:0, lvs:3, lv:1, p:{x:80, y:185, w:40, h:5}, b:{x:100, y:175, vx:1, vy:-1, s:.15}, br:[],
            ini(){ this.st='START'; this.sc=0; this.lvs=3; this.lv=1; this.rL(); },
            rL(){ this.br=[]; for(let r=0;r<5;r++)for(let c=0;c<8;c++)this.br.push({x:6+c*24,y:20+r*12,w:20,h:8,v:1}); this.rB(); },
            rB(){ this.p.x=80; this.b.x=100; this.b.y=175; this.b.vx=M.random()>.5?1:-1; this.b.vy=-1; this.b.s=.12+(this.lv*.02); },
            upd(dt){
                if(this.st!=='PLAYING')return;
                let spd = state.k.B ? 0.3 : 0.2; 
                if(state.k.L)this.p.x-=spd*dt; if(state.k.R)this.p.x+=spd*dt; this.p.x=M.max(0,M.min(160,this.p.x));
                let bx=this.b.x+this.b.vx*this.b.s*dt, by=this.b.y+this.b.vy*this.b.s*dt;
                if(bx<0){bx=0;this.b.vx*=-1;} if(bx>196){bx=196;this.b.vx*=-1;} if(by<0){by=0;this.b.vy*=-1;}
                if(this.b.vy>0&&by+4>=this.p.y&&by<=this.p.y+this.p.h&&bx+4>=this.p.x&&bx<=this.p.x+this.p.w){
                    by=this.p.y-4; this.b.vy*=-1; this.b.vx+=(bx-(this.p.x+this.p.w/2))*.05; this.b.vx=M.max(-1.5,M.min(1.5,this.b.vx));
                }
                for(let i=0;i<this.br.length;i++){ let bk=this.br[i];
                    if(bstate.k.v&&bx+4>bstate.k.x&&bx<bstate.k.x+bstate.k.w&&by+4>bstate.k.y&&by<bstate.k.y+bstate.k.h){
                        bstate.k.v=0; this.sc+=10; let oL=(bx+4)-bstate.k.x, oR=(bstate.k.x+bstate.k.w)-bx, oT=(by+4)-bstate.k.y, oB=(bstate.k.y+bstate.k.h)-by;
                        let mO=M.min(oL,oR,oT,oB); if(mO===oL||mO===oR)this.b.vx*=-1; else this.b.vy*=-1; break;
                    }
                }
                this.b.x=bx; this.b.y=by;
                if(this.b.y>200){ this.lvs--; if(this.lvs<=0)this.st='GAMEOVER'; else this.st='LIFELOST'; }
                if(!this.br.some(bk=>bstate.k.v)){ this.lv++; this.rL(); }
            },
            inp(b){ 
                if((this.st==='START'||this.st==='GAMEOVER')&&(b==='ST'||b==='A')){
                    if(this.st==='GAMEOVER')this.ini();
                    this.st='PLAYING';
                }
                else if(this.st==='LIFELOST'&&(b==='ST'||b==='A')){
                    this.rB(); this.st='PLAYING';
                }
            },
            drw(){
                if(this.st==='START'){txt("BRICK BREAKER",100,20,12);txt("PRESS START",100,140,8);return;}
                txt(`SC:${this.sc}`,5,12,8,'left'); txt(`LVS:${this.lvs}`,195,12,8,'right');
                fr(this.p.x,this.p.y,this.p.w,this.p.h,C0); fr(this.b.x,this.b.y,4,4,C0);
                for(let bk of this.br)if(bstate.k.v){fr(bstate.k.x,bstate.k.y,bstate.k.w,bstate.k.h,C1);sr(bstate.k.x,bstate.k.y,bstate.k.w,bstate.k.h,C0);}
                
                if(this.st==='LIFELOST'){
                    fr(10,60,180,80,'rgba(155,188,15,.9)'); sr(10,60,180,80,C0);
                    txt("LIFE LOST",100,85,12); txt(`REMAINING:${this.lvs}`,100,105,8);
                    if(~~(state.gT/400)%2===0)txt("PRESS START",100,125,8);
                }
                if(this.st==='GAMEOVER'){fr(10,60,180,80,'rgba(155,188,15,.9)');sr(10,60,180,80,C0);txt("GAME OVER",100,100,12);}
            },
            art(x,y,w,h){ fr(x,y,w,h,C3); sr(x,y,w,h,C0); fr(x+20,y+40,40,4,C0); fr(x+35,y+25,4,4,C0); for(let i=0;i<3;i++){fr(x+10+i*22,y+5,18,6,C1);sr(x+10+i*22,y+5,18,6,C0);fr(x+10+i*22,y+13,18,6,C1);sr(x+10+i*22,y+13,18,6,C0);} }
        };