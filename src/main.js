import { initDisplay } from './engine/display.js';
import { initInput } from './engine/input.js';
import { state, ctx, fr, txt, C0, C1, C3, M } from './engine/state.js';
import { GL } from './games/index.js';

initDisplay();
initInput();

GL.sort((a, b) => a.n.localeCompare(b.n));
GL.forEach(g=>g.ini()); 

function drawMenu() {
    txt("GAME SELECT", 100, 22, 10); fr(10, 30, 180, 2, C0); 
    GL[state.mC].art(60, 38, 80, 50);

    let lX=20, lY=98, lH=80, iH=16, mxV=5;
    let scr = M.max(0, M.min((state.mC-2)*iH, M.max(0, (GL.length*iH)-lH)));

    ctx.save(); ctx.beginPath(); ctx.rect(lX, lY, 160, lH); ctx.clip();
    GL.forEach((g, i) => {
        let y = lY + 12 + (i*iH) - scr;
        if(i===state.mC && ~~(state.gT/300)%2===0) txt(">", lX, y, 10, 'left', C0);
        txt(g.n, lX+15, y, 10, 'left', i===state.mC?C0:C1);
    });
    ctx.restore();

    if(GL.length > mxV) {
        fr(180, lY, 4, lH, C1);
        let th = M.max(10, (mxV/GL.length)*lH), pc = state.mC/(GL.length-1);
        fr(179, lY + pc*(lH-th), 6, th, C0);
    }
    txt("D-PAD:SELECT  A:PLAY", 100, 190, 7, 'center', C1);
}

export function trg(b) {
    if(state.sys === 'MENU') {
        if(b==='U') state.mC = Math.max(0, state.mC-1); 
        else if(b==='D') state.mC = Math.min(GL.length-1, state.mC+1);
        else if(b==='ST'||b==='A'){ GL[state.mC].ini(); state.sys = 'GAME'; }
    } else {
        if(b==='SE') state.sys = 'MENU'; else GL[state.mC].inp(b);
    }
}

let lt = performance.now();
function loop(t) {
    let dt = t - lt; lt = t; state.gT += dt;
    fr(0, 0, 200, 200, C3);
    if(state.sys === 'MENU') drawMenu(); else { GL[state.mC].upd(dt); GL[state.mC].drw(); }
    requestAnimationFrame(loop);
}
setTimeout(() => requestAnimationFrame(loop), 150);
