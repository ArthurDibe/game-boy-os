import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const RP = {
            n:"TALE OF ORB", st:'START', cX:0, cY:0, p:{}, lvl:[], en:[], it:[], chests:[], lv:1,
            hD:["   0000   ","  022220  "," 02022020 "," 02222220 ","  020020  "," 01011010 "," 01111110 ","  011110  ","  02  20  "," 000  000 "].join(''),
            hU:["   0000   ","  022220  "," 02222220 "," 02222220 ","  022220  "," 01011010 "," 01111110 ","  011110  ","  02  20  "," 000  000 "].join(''),
            hS:["   0000   ","  022220  "," 0202220  "," 0222220  ","  02020   ","  010110  "," 0111110  ","  011110  ","   0220   ","  00000   "].join(''),
            eO:["   0000   ","  011110  "," 01011010 "," 01111110 ","  001100  "," 01111110 "," 02011020 "," 02000020 ","  022220  ","   0000   "].join(''),
            tT:["   0000   ","  011110  "," 01221110 "," 01211110 "," 01112210 ","  011110  ","   0000   ","   0220   ","   0220   ","   0000   "].join(''),
            dP(s, x, y, f=0){
                for(let i=0; i<100; i++) {
                    let c = s[i];
                    if(c !== ' ') fr(x+(f ? 9-(i%10) : i%10), y+~~(i/10), 1, 1, c==='0'?C0:c==='1'?C1:c==='2'?C2:C3);
                }
            },
            ini(){
                this.st='START'; 
                this.p={x:40, y:260, w:10, h:10, d:3, hp:6, mHp:6, aT:0, hT:0, kx:0, ky:0, gems:0, keys:0};
                this.genLvl(1);
            },
            genLvl(levelNum) {
                this.lv = levelNum;
                this.p.x = 40; this.p.y = 260; this.p.d = 3; this.p.keys = 0;
                this.it = []; this.en = []; this.chests = [];
                this.lvl = Array(30).fill(0).map(()=>Array(30).fill('.'));

                for(let i=0; i<30; i++) { this.lvl[0][i] = this.lvl[29][i] = this.lvl[i][0] = this.lvl[i][29] = 'T'; }

                let obs = ['T', 'R', 'W'];
                for(let i=0; i<30 + this.lv*5; i++) {
                    let r = 2+~~(M.random()*25), c = 2+~~(M.random()*25);
                    let t = obs[~~(M.random()*obs.length)];
                    this.lvl[r][c] = t;
                    if(M.random()<.5) this.lvl[r+1][c] = t;
                    if(M.random()<.5) this.lvl[r][c+1] = t;
                }

                for(let r=24; r<=28; r++) for(let c=1; c<=5; c++) this.lvl[r][c] = '.';

                for(let r=1; r<=6; r++) for(let c=23; c<=28; c++) this.lvl[r][c] = '.'; 
                for(let r=1; r<=6; r++) this.lvl[r][23] = 'T'; 
                for(let c=24; c<=28; c++) this.lvl[6][c] = 'T'; 
                this.lvl[6][25] = 'D'; 
                this.lvl[3][26] = 'O'; 

                let numC = 3 + ~~(M.random()*3);
                for(let i=0; i<numC; i++) {
                    let r, c;
                    do { r = 2+~~(M.random()*25); c = 2+~~(M.random()*25); } 
                    while(this.lvl[r][c] !== '.' || (r>20 && c<10) || (r<8 && c>20));
                    this.lvl[r][c] = 'C';
                    this.chests.push({r, c, k: false});
                }
                this.chests[~~(M.random()*this.chests.length)].k = true;

                let numE = 3 + this.lv;
                for(let i=0; i<numE; i++) {
                    let r, c;
                    do { r = 2+~~(M.random()*25); c = 2+~~(M.random()*25); } 
                    while(this.lvl[r][c] !== '.' || (r>20 && c<10) || (r<8 && c>20));
                    this.en.push({x:c*10, y:r*10, w:10, h:10, vx:(M.random()>.5?30:-30), vy:(M.random()>.5?30:-30), hp:2 + ~~(this.lv/3), hT:0, kx:0, ky:0});
                }
            },
            tA(x,y,w,h){
                let ts=[]; let r1=M.max(0,~~(y/10)), r2=M.min(this.lvl.length-1,~~((y+h-.1)/10));
                let c1=M.max(0,~~(x/10)), c2=M.min(this.lvl[0].length-1,~~((x+w-.1)/10));
                for(let r=r1; r<=r2; r++) for(let c=c1; c<=c2; c++) { let t = this.lvl[r][c]; if(t!=='.') ts.push({r,c,t}); }
                return ts;
            },
            upd(dt){
                if(this.st!=='PLAYING') return;
                let dtS = M.min(dt/1000, 0.05); let p = this.p;
                if(p.hT>0) p.hT -= dt; if(p.aT>0) p.aT -= dt;
                
                let nx = p.x, ny = p.y;
                if(p.hT>0 && (M.abs(p.kx)>1 || M.abs(p.ky)>1)) {
                    nx += p.kx*dtS; ny += p.ky*dtS; p.kx*=0.8; p.ky*=0.8;
                } else if(p.aT<=0) {
                    let spd = 70 * dtS;
                    if(state.k.U) { ny -= spd; p.d = 1; } if(state.k.D) { ny += spd; p.d = 0; }
                    if(state.k.L) { nx -= spd; p.d = 2; } if(state.k.R) { nx += spd; p.d = 3; }
                }

                let hw = 8, hh = 8;
                let tsX = this.tA(nx+1, p.y+1, hw, hh);
                let dX = tsX.find(b=>b.t==='D');
                if(dX && p.keys>0 && this.en.length === 0) { this.lvl[dX.r][dX.c]='.'; p.keys--; tsX = this.tA(nx+1, p.y+1, hw, hh); }
                if(!tsX.some(b=>['T','W','R','D','C','c'].includes(b.t))) p.x = nx;
                
                let tsY = this.tA(p.x+1, ny+1, hw, hh);
                let dY = tsY.find(b=>b.t==='D');
                if(dY && p.keys>0 && this.en.length === 0) { this.lvl[dY.r][dY.c]='.'; p.keys--; tsY = this.tA(p.x+1, ny+1, hw, hh); }
                if(!tsY.some(b=>['T','W','R','D','C','c'].includes(b.t))) p.y = ny;

                if(this.tA(p.x+1, p.y+1, hw, hh).some(b=>b.t==='O')) this.st='TRANS';

                let sHx=0, sHy=0, sHw=0, sHh=0;
                if(p.aT>0) {
                    if(p.d===0) { sHx=p.x; sHy=p.y+p.h; sHw=10; sHh=10; }
                    if(p.d===1) { sHx=p.x; sHy=p.y-10; sHw=10; sHh=10; }
                    if(p.d===2) { sHx=p.x-10; sHy=p.y; sHw=10; sHh=10; }
                    if(p.d===3) { sHx=p.x+p.w; sHy=p.y; sHw=10; sHh=10; }
                }

                for(let i=this.en.length-1; i>=0; i--){
                    let e = this.en[i];
                    if(e.hT>0) e.hT -= dt;
                    let ex = e.x, ey = e.y;
                    
                    if(e.hT>0 && (M.abs(e.kx)>1 || M.abs(e.ky)>1)) {
                        ex += e.kx*dtS; ey += e.ky*dtS; e.kx*=0.8; e.ky*=0.8;
                    } else {
                        ex += e.vx*dtS; ey += e.vy*dtS;
                        if(M.random()<0.02) { e.vx=(M.random()-.5)*80; e.vy=(M.random()-.5)*80; }
                    }

                    if(this.tA(ex+1, e.y+1, hw, hh).some(b=>['T','W','R','D','C','c'].includes(b.t))) e.vx *= -1; else e.x = ex;
                    if(this.tA(e.x+1, ey+1, hw, hh).some(b=>['T','W','R','D','C','c'].includes(b.t))) e.vy *= -1; else e.y = ey;

                    if(p.aT>0 && e.hT<=0 && sHx<e.x+e.w && sHx+sHw>e.x && sHy<e.y+e.h && sHy+sHh>e.y) {
                        e.hp--; e.hT=300; e.kx=(e.x-p.x>0?1:-1)*200; e.ky=(e.y-p.y>0?1:-1)*200;
                        if(e.hp<=0) { 
                            if(M.random()<0.6) this.it.push({x:e.x+2, y:e.y+2, t:M.random()<.5?'gem':'heart'});
                            this.en.splice(i,1); continue; 
                        }
                    }

                    if(p.hT<=0 && p.x+1<e.x+9 && p.x+9>e.x+1 && p.y+1<e.y+9 && p.y+9>e.y+1) {
                        p.hp--; p.hT=800; p.kx=(p.x-e.x>0?1:-1)*200; p.ky=(p.y-e.y>0?1:-1)*200;
                        if(p.hp<=0) this.st='GAMEOVER';
                    }
                }

                for(let i=this.it.length-1; i>=0; i--) {
                    let it = this.it[i];
                    if(p.x < it.x+8 && p.x+p.w > it.x-2 && p.y < it.y+8 && p.y+p.h > it.y-2) {
                        if(it.t==='gem') p.gems++;
                        if(it.t==='key') p.keys++;
                        if(it.t==='heart') p.hp = M.min(p.mHp, p.hp+2);
                        this.it.splice(i,1);
                    }
                }

                this.cX = M.max(0, M.min(this.lvl[0].length*10 - 200, p.x - 95));
                this.cY = M.max(0, M.min(this.lvl.length*10 - 200, p.y - 95));
            },
            inp(b){ 
                if(this.st==='START' && (b==='ST'||b==='A')) { this.st='PLAYING'; return; }
                if(this.st==='GAMEOVER' && (b==='ST'||b==='A')) { this.ini(); this.st='PLAYING'; return; }
                if(this.st==='TRANS' && (b==='ST'||b==='A')) { this.genLvl(this.lv+1); this.st='PLAYING'; return; }
                
                if(this.st==='PLAYING' && b==='A' && this.p.aT<=0) {
                    this.p.aT = 150;
                    let p = this.p, sx=p.x-2, sy=p.y-2, sw=14, sh=14;
                    if(p.d===0) { sy+=10; sh=10; } 
                    if(p.d===1) { sy-=10; sh=10; } 
                    if(p.d===2) { sx-=10; sw=10; } 
                    if(p.d===3) { sx+=10; sw=10; }
                    
                    let ts = this.tA(sx, sy, sw, sh);
                    ts.forEach(b => {
                        if(b.t==='C') {
                            this.lvl[b.r][b.c] = 'c';
                            let ch = this.chests.find(c => c.r === b.r && c.c === b.c);
                            let dropT = ch && ch.k ? 'key' : (M.random() < 0.5 ? 'gem' : 'heart');
                            
                            let kx = b.c*10+2, ky = b.r*10+2;
                            if(p.d===0) ky-=10; if(p.d===1) ky+=10; if(p.d===2) kx+=10; if(p.d===3) kx-=10;
                            this.it.push({x: kx, y: ky, t: dropT});
                        }
                    });
                }
            },
            drw(){
                if(this.st==='START'){ txt("TALE OF ORB",100,80,12); txt("PRESS START",100,120,8); return; }

                let c1 = M.max(0, ~~(this.cX/10)), c2 = M.min(this.lvl[0].length-1, ~~((this.cX+200)/10));
                let r1 = M.max(0, ~~(this.cY/10)), r2 = M.min(this.lvl.length-1, ~~((this.cY+200)/10));

                for(let r=r1; r<=r2; r++){
                    for(let c=c1; c<=c2; c++){
                        let x = c*10 - this.cX, y = r*10 - this.cY, t = this.lvl[r][c];
                        if(t==='.') { fr(x,y,10,10,C3); if((r*7+c*11)%5===0) fr(x+2,y+6,2,2,C2); }
                        if(t==='T') { this.dP(this.tT, x, y); }
                        if(t==='W') { fr(x,y,10,10,C2); if((r+c+~~(state.gT/200))%2===0) { fr(x+2,y+4,6,2,C3); fr(x+4,y+6,2,2,C3); } else { fr(x+4,y+4,6,2,C3); fr(x+6,y+6,2,2,C3); } }
                        if(t==='R') { fr(x,y+2,10,6,C1); fr(x+1,y+1,8,8,C2); sr(x+1,y+2,8,6,C0); }
                        if(t==='C') { fr(x+1,y+2,8,7,C1); sr(x+1,y+2,8,7,C0); fr(x+1,y+2,8,3,C2); fr(x+4,y+4,2,2,C0); }
                        if(t==='c') { fr(x+1,y+4,8,5,C1); sr(x+1,y+4,8,5,C0); fr(x+1,y+1,8,3,C2); sr(x+1,y+1,8,3,C0); }
                        if(t==='D') { fr(x,y,10,10,C1); sr(x,y,10,10,C0); fr(x+3,y+3,4,4,C0); fr(x+4,y+7,2,3,C0); }
                        if(t==='O') { if(~~(state.gT/200)%2===0) fr(x+2,y+2,6,6,C2); else fr(x+2,y+2,6,6,C3); sr(x+2,y+2,6,6,C0); }
                    }
                }

                for(let it of this.it) {
                    let ix = it.x - this.cX, iy = it.y - this.cY;
                    if(it.t==='gem') { fr(ix+2,iy,2,6,C0); fr(ix,iy+2,6,2,C0); fr(ix+1,iy+1,4,4,C2); }
                    if(it.t==='key') { fr(ix,iy+1,4,4,C2); sr(ix,iy+1,4,4,C0); fr(ix+4,iy+2,4,2,C0); fr(ix+6,iy+4,2,2,C0); }
                    if(it.t==='heart') { fr(ix+1,iy+1,2,2,C0); fr(ix+5,iy+1,2,2,C0); fr(ix+1,iy+3,6,4,C0); }
                }

                for(let e of this.en) {
                    if(e.hT>0 && ~~(state.gT/50)%2===0) continue;
                    this.dP(this.eO, e.x - this.cX, e.y - this.cY, ~~(state.gT/150)%2);
                }

                let px = this.p.x - this.cX, py = this.p.y - this.cY;
                if(this.p.hT<=0 || ~~(state.gT/50)%2===0) {
                    let s = this.p.d===0 ? this.hD : this.p.d===1 ? this.hU : this.hS;
                    this.dP(s, px, py, this.p.d===3);

                    if(this.p.aT>0) {
                        let cS = C0;
                        if(this.p.d===0) { fr(px+4, py+10, 2, 8, cS); fr(px+3, py+10, 4, 2, C2); fr(px+4, py+12, 2, 6, C3); }
                        if(this.p.d===1) { fr(px+4, py-8, 2, 8, cS); fr(px+3, py-2, 4, 2, C2); fr(px+4, py-8, 2, 6, C3); }
                        if(this.p.d===2) { fr(px-8, py+4, 8, 2, cS); fr(px-2, py+3, 2, 4, C2); fr(px-8, py+4, 6, 2, C3); }
                        if(this.p.d===3) { fr(px+10, py+4, 8, 2, cS); fr(px+10, py+3, 2, 4, C2); fr(px+12, py+4, 6, 2, C3); }
                    }
                }

                for(let i=0; i<this.p.mHp/2; i++) {
                    let hx = 5 + i*12, hy = 5;
                    if(this.p.hp >= (i+1)*2) { fr(hx,hy,4,4,C0); fr(hx+5,hy,4,4,C0); fr(hx,hy+4,9,4,C0); fr(hx+2,hy+8,5,2,C0); }
                    else if(this.p.hp === (i+1)*2-1) { fr(hx,hy,4,4,C0); fr(hx,hy+4,4,4,C0); fr(hx+2,hy+8,2,2,C0); }
                    else { sr(hx,hy,9,8,C0); }
                }
                txt("G:"+this.p.gems, 195, 12, 8, 'right');
                txt("K:"+this.p.keys, 195, 22, 8, 'right');
                txt("M:"+this.en.length, 195, 32, 8, 'right');

                if(this.st==='GAMEOVER'){fr(10,60,180,80,'rgba(155,188,15,.9)');sr(10,60,180,80,C0);txt("GAME OVER",100,100,12);}
                if(this.st==='TRANS'){ 
                    fr(10,60,180,80,'rgba(155,188,15,.9)'); sr(10,60,180,80,C0); 
                    txt("ORB SECURED!",100,85,10); txt("LEVEL " + this.lv + " CLEAR",100,105,8); 
                    if(~~(state.gT/400)%2===0)txt("PRESS START",100,125,8); 
                }
            },
            art(x,y,w,h){ fr(x,y,w,h,C2); sr(x,y,w,h,C0); fr(x+w/2-5, y+h/2-5, 10, 10, C0); fr(x+w/2+10, y+h/2-10, 8, 20, C1); fr(x+w/2-20, y+h/2, 8, 8, C0); }
        };