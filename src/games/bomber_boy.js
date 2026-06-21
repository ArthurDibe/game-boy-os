import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const BM = {
            n:"BOMBER BOY", st:'START', mC: 0,
            ini(mode){
                if(mode===undefined) { this.st='START'; this.mC=0; return; }
                this.mode = mode; 
                this.st='PLAYING';
                this.map=[]; this.bs=[]; this.fs=[]; this.pwrs=[]; this.ens=[]; this.bots=[];
                for(let y=0;y<13;y++){
                    let r=[];
                    for(let x=0;x<13;x++){
                        if(x%2===1 && y%2===1) r.push('#');
                        else r.push(M.random()<.6 ? 'S' : '.');
                    }
                    this.map.push(r);
                }
                
                let clr = (cx,cy) => { this.map[cy][cx]='.'; this.map[cy][cx+(cx===0?1:-1)]='.'; this.map[cy+(cy===0?1:-1)][cx]='.'; };
                clr(0,0);
                this.p = {x:4, y:4, w:10, h:10, bMax:1, bRad:1, a:1};
                
                if(this.mode === 1) { 
                    clr(12,0); clr(0,12); clr(12,12);
                    this.bots.push({id:1, x:2+12*15, y:2, dx:-1, dy:0, bMax:1, bRad:1, a:1});
                    this.bots.push({id:2, x:2, y:2+12*15, dx:1, dy:0, bMax:1, bRad:1, a:1});
                    this.bots.push({id:3, x:2+12*15, y:2+12*15, dx:-1, dy:0, bMax:1, bRad:1, a:1});
                }

                let numE = this.mode === 0 ? 3 : 1; 
                for(let i=0; i<numE; i++) {
                    let ex, ey;
                    do { ex = ~~(M.random()*13); ey = ~~(M.random()*13); }
                    while (this.map[ey][ex] !== '.' || (ex<3 && ey<3) || (ex>9&&ey<3) || (ex<3&&ey>9) || (ex>9&&ey>9));
                    let ds = [[-1,0],[1,0],[0,-1],[0,1]];
                    let d = ds[~~(M.random()*4)];
                    this.ens.push({x: 2+ex*15, y: 2+ey*15, dx: d[0], dy: d[1]});
                }
            },
            cK(x,y, isE=0){
                let r1=M.max(0,~~((y-2)/15)), r2=M.min(12,~~((y+9-2)/15));
                let c1=M.max(0,~~((x-2)/15)), c2=M.min(12,~~((x+9-2)/15));
                for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) {
                    if(this.map[r][c]==='#'||this.map[r][c]==='S') return 1;
                }
                for(let b of this.bs) {
                    let bx = 2+b.x*15, by = 2+b.y*15;
                    if (x < bx+15 && x+10 > bx && y < by+15 && y+10 > by) {
                        if (isE || !b.wlk) return 1;
                    }
                }
                return (x<2 || x+10>197 || y<2 || y+10>197);
            },
            upd(dt){
                if(this.st!=='PLAYING') return;
                let dtS = dt/1000, spd = 60*dtS;
                
                for(let b of this.bs) {
                    if(b.wlk) {
                        let bx = 2+b.x*15, by = 2+b.y*15;
                        let pT = this.p.a && !(this.p.x >= bx+15 || this.p.x+10 <= bx || this.p.y >= by+15 || this.p.y+10 <= by);
                        let bT = this.bots.some(bot => bot.a && !(bot.x >= bx+15 || bot.x+10 <= bx || bot.y >= by+15 || bot.y+10 <= by));
                        if(!pT && !bT) b.wlk = 0; 
                    }
                }
                
                if(this.p.a) {
                    let nx=this.p.x, ny=this.p.y;
                    if(state.k.U) ny-=spd; if(state.k.D) ny+=spd;
                    if(state.k.L) nx-=spd; if(state.k.R) nx+=spd;
                    
                    if(!this.cK(nx, this.p.y)) this.p.x = nx;
                    else if(!state.k.U && !state.k.D) {
                        let cy = (this.p.y-2)/15;
                        if(cy - M.floor(cy) < 0.4 && !this.cK(nx, this.p.y-1)) this.p.y-=1;
                        else if(cy - M.floor(cy) > 0.6 && !this.cK(nx, this.p.y+1)) this.p.y+=1;
                    }
                    
                    if(!this.cK(this.p.x, ny)) this.p.y = ny;
                    else if(!state.k.L && !state.k.R) {
                        let cx = (this.p.x-2)/15;
                        if(cx - M.floor(cx) < 0.4 && !this.cK(this.p.x-1, ny)) this.p.x-=1;
                        else if(cx - M.floor(cx) > 0.6 && !this.cK(this.p.x+1, ny)) this.p.x+=1;
                    }
                }

                for(let bot of this.bots) {
                    if(!bot.a) continue;
                    let nx=bot.x+bot.dx*spd, ny=bot.y+bot.dy*spd;
                    
                    let onB = this.bs.some(b=> {
                         let bx=2+b.x*15, by=2+b.y*15;
                         return (bot.x < bx+15 && bot.x+10 > bx && bot.y < by+15 && bot.y+10 > by);
                    });

                    if(!this.cK(nx, ny) || (onB && !this.cK(nx, ny, 1))) {
                        bot.x = nx; bot.y = ny;
                        if(M.random()<0.015 && this.bs.filter(b=>b.oid===bot.id).length < bot.bMax) {
                            let cx = (bot.x-2)/15, cy = (bot.y-2)/15;
                            if(M.abs(cx - M.round(cx)) < 0.2 && M.abs(cy - M.round(cy)) < 0.2) {
                                let tx=M.round(cx), ty=M.round(cy);
                                if(!this.bs.find(b=>b.x===tx && b.y===ty)) {
                                    this.bs.push({x:tx, y:ty, t:2000, r:bot.bRad, wlk:1, oid:bot.id});
                                    bot.dx *= -1; bot.dy *= -1;
                                }
                            }
                        }
                    } else {
                        let cx = M.round((bot.x-2)/15), cy = M.round((bot.y-2)/15);
                        bot.x = 2+cx*15; bot.y = 2+cy*15; 
                        let ds = [[-1,0],[1,0],[0,-1],[0,1]];
                        let valid = ds.filter(d => !this.cK(bot.x+d[0]*8, bot.y+d[1]*8));
                        if(valid.length) {
                            let d = valid[~~(M.random()*valid.length)];
                            bot.dx = d[0]; bot.dy = d[1];
                        } else { bot.dx *= -1; bot.dy *= -1; }

                        if(M.random() < 0.6 && this.bs.filter(b=>b.oid===bot.id).length < bot.bMax) {
                            if(!this.bs.find(b=>b.x===cx && b.y===cy)) {
                                this.bs.push({x:cx, y:cy, t:2000, r:bot.bRad, wlk:1, oid:bot.id});
                                bot.dx *= -1; bot.dy *= -1;
                            }
                        }
                    }
                }

                for(let i=this.pwrs.length-1; i>=0; i--) {
                    let pwr = this.pwrs[i];
                    let px = 2+pwr.x*15, py = 2+pwr.y*15;
                    let pick = (c) => (c.a && c.x < px+15 && c.x+10 > px && c.y < py+15 && c.y+10 > py);
                    if(pick(this.p)) {
                        if(pwr.t === 'F') this.p.bRad++; if(pwr.t === 'B') this.p.bMax++;
                        this.pwrs.splice(i,1); continue;
                    }
                    for(let bot of this.bots) {
                        if(pick(bot)) {
                            if(pwr.t === 'F') bot.bRad++; if(pwr.t === 'B') bot.bMax++;
                            this.pwrs.splice(i,1); break;
                        }
                    }
                }

                let eSpd = 30*dtS;
                for(let i=this.ens.length-1; i>=0; i--) {
                    let e = this.ens[i];
                    let ex = e.x + e.dx*eSpd, ey = e.y + e.dy*eSpd;
                    if(!this.cK(ex, ey, 1)) {
                        e.x = ex; e.y = ey;
                    } else {
                        let ds = [[-1,0],[1,0],[0,-1],[0,1]];
                        let valid = ds.filter(d => !this.cK(e.x+d[0]*2, e.y+d[1]*2, 1));
                        if(valid.length > 0) {
                            let d = valid[~~(M.random()*valid.length)];
                            e.dx = d[0]; e.dy = d[1];
                        } else { e.dx *= -1; e.dy *= -1; }
                    }
                    
                    if(this.p.a && this.p.x < e.x+10 && this.p.x+10 > e.x && this.p.y < e.y+10 && this.p.y+10 > e.y) {
                        this.p.a = 0; this.st = 'GAMEOVER';
                    }
                    for(let bot of this.bots) {
                        if(bot.a && bot.x < e.x+10 && bot.x+10 > e.x && bot.y < e.y+10 && bot.y+10 > e.y) bot.a = 0;
                    }
                }

                for(let i=this.bs.length-1; i>=0; i--) {
                    this.bs[i].t -= dt;
                    if(this.bs[i].t <= 0) {
                        let b = this.bs.splice(i,1)[0];
                        this.exp(b.x, b.y, b.r);
                    }
                }
                
                for(let i=this.fs.length-1; i>=0; i--) {
                    this.fs[i].t -= dt;
                    let f = this.fs[i];
                    if(f.t <= 0) {
                        this.fs.splice(i,1);
                    } else {
                        let fx = 2+f.x*15, fy = 2+f.y*15;
                        let hit = (c) => (c.a && c.x < fx+14 && c.x+10 > fx+1 && c.y < fy+14 && c.y+10 > fy+1);
                        
                        if(hit(this.p)) { this.p.a = 0; this.st = 'GAMEOVER'; }
                        for(let bot of this.bots) if(hit(bot)) bot.a = 0;

                        for(let j=this.ens.length-1; j>=0; j--) {
                            let e = this.ens[j];
                            if(e.x < fx+14 && e.x+10 > fx+1 && e.y < fy+14 && e.y+10 > fy+1) this.ens.splice(j,1);
                        }
                        for(let j=this.pwrs.length-1; j>=0; j--) {
                            if(this.pwrs[j].x === f.x && this.pwrs[j].y === f.y) this.pwrs.splice(j,1);
                        }
                    }
                }
                
                if(this.mode === 0 && this.ens.length === 0 && this.st === 'PLAYING') this.st = 'TRANS';
                if(this.mode === 1 && this.p.a && this.bots.filter(b=>b.a).length === 0 && this.st === 'PLAYING') this.st = 'TRANS';
            },
            exp(tx, ty, rad) {
                this.addF(tx, ty);
                let ds = [[0,-1],[0,1],[-1,0],[1,0]];
                for(let d of ds) {
                    for(let i=1; i<=rad; i++) {
                        let nx = tx+d[0]*i, ny = ty+d[1]*i;
                        if(nx<0||nx>12||ny<0||ny>12) break;
                        let cell = this.map[ny][nx];
                        if(cell === '#') break;
                        
                        let bIdx = this.bs.findIndex(b=>b.x===nx && b.y===ny);
                        if(bIdx !== -1) this.bs[bIdx].t = 0;

                        if(cell === 'S') {
                            this.map[ny][nx] = '.';
                            this.addF(nx, ny);
                            if(M.random() < 0.25) this.pwrs.push({x: nx, y: ny, t: M.random() < 0.5 ? 'F' : 'B'});
                            break; 
                        }
                        this.addF(nx, ny);
                    }
                }
            },
            addF(x, y) {
                if(!this.fs.find(f=>f.x===x && f.y===y)) this.fs.push({x,y,t:400});
            },
            inp(b){
                if(this.st==='START') {
                    if(b==='U') this.mC = 0;
                    if(b==='D') this.mC = 1;
                    if(b==='ST'||b==='A') this.ini(this.mC); 
                } else if(this.st==='GAMEOVER'||this.st==='TRANS'){ 
                    if(b==='ST'||b==='A') this.ini(); 
                } else if(this.st==='PLAYING' && b==='A' && this.p.a) {
                    if(this.bs.filter(bm=>bm.oid===0).length < this.p.bMax) {
                        let tx = M.round((this.p.x-2)/15), ty = M.round((this.p.y-2)/15);
                        if(!this.bs.find(bm=>bm.x===tx && bm.y===ty)) {
                            this.bs.push({x:tx, y:ty, t:2000, r:this.p.bRad, wlk:1, oid:0});
                        }
                    }
                }
            },
            drw(){
                if(this.st==='START'){ 
                    txt("BOMBER BOY",100,40,14); 
                    if(~~(state.gT/300)%2===0) txt(">", 20, this.mC===0 ? 90 : 110, 10, 'left', C0);
                    txt("SOLO MODE", 100, 90, 10, 'center', this.mC===0?C0:C1);
                    txt("AI MATCH", 100, 110, 10, 'center', this.mC===1?C0:C1);
                    if(~~(state.gT/400)%2===0)txt("PRESS START",100,160,8); 
                    return; 
                }
                
                for(let y=0; y<13; y++) {
                    for(let x=0; x<13; x++) {
                        let px = 2+x*15, py = 2+y*15;
                        let c = this.map[y][x];
                        if(c==='#') { fr(px,py,15,15,C1); fr(px+2,py+2,11,11,C0); }
                        else if(c==='S') { fr(px,py,15,15,C2); sr(px,py,15,15,C1); fr(px,py+7,15,1,C1); fr(px+7,py,1,7,C1); fr(px+3,py+7,1,8,C1); }
                    }
                }

                for(let p of this.pwrs) {
                    let px = 2+p.x*15, py = 2+p.y*15;
                    fr(px+2, py+2, 11, 11, C3); sr(px+2, py+2, 11, 11, C0);
                    txt(p.t, px+7.5, py+10, 8, 'center', C0);
                }

                for(let b of this.bs) {
                    let px = 2+b.x*15, py = 2+b.y*15;
                    ctx.fillStyle=C0; ctx.beginPath(); ctx.arc(px+7.5, py+7.5, 6, 0, M.PI*2); ctx.fill();
                    if(~~(b.t/100)%2===0) fr(px+6, py+2, 3, 3, C3);
                }

                for(let f of this.fs) {
                    let px = 2+f.x*15, py = 2+f.y*15;
                    fr(px+2, py+2, 11, 11, C0); fr(px+4, py+4, 7, 7, C2); fr(px+6, py+6, 3, 3, C3);
                }

                for(let e of this.ens) {
                    fr(e.x, e.y, 10, 10, C1); fr(e.x+2, e.y+2, 2, 2, C3); fr(e.x+6, e.y+2, 2, 2, C3);
                }

                for(let bot of this.bots) {
                    if(!bot.a) continue;
                    fr(bot.x, bot.y, 10, 10, C1);
                    fr(bot.x+2, bot.y+2, 6, 5, C3); 
                    fr(bot.x+3, bot.y+3, 1, 2, C0); 
                    fr(bot.x+6, bot.y+3, 1, 2, C0); 
                }

                if (this.p.a) {
                    fr(this.p.x, this.p.y, 10, 10, C0);
                    fr(this.p.x+2, this.p.y+2, 6, 5, C3); 
                    fr(this.p.x+3, this.p.y+3, 1, 2, C0); 
                    fr(this.p.x+6, this.p.y+3, 1, 2, C0); 
                }

                if(this.st==='GAMEOVER'){ fr(10,60,180,80,'rgba(155,188,15,.9)'); sr(10,60,180,80,C0); txt("GAME OVER",100,100,12); }
                if(this.st==='TRANS'){ fr(10,60,180,80,'rgba(155,188,15,.9)'); sr(10,60,180,80,C0); txt(this.mode===1?"SURVIVOR!":"CLEARED!",100,90,10); if(~~(state.gT/400)%2===0)txt("PRESS START",100,125,8); }
            },
            art(x,y,w,h){ fr(x,y,w,h,C3); sr(x,y,w,h,C0); ctx.fillStyle=C0; ctx.beginPath(); ctx.arc(x+w/2, y+h/2+5, 12, 0, M.PI*2); ctx.fill(); fr(x+w/2-2, y+h/2-10, 4, 6, C0); fr(x+w/2+4, y+h/2-2, 4, 4, C3); }
        };