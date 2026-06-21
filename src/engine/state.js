export const M = Math;
export const D = document;
export const W = window;
export const ctx = D.getElementById('cv').getContext('2d');
export const C0='#0f380f', C1='#306230', C2='#8bac0f', C3='#9bbc0f';

export const state = {
    sys: 'MENU',
    gT: 0,
    k: {U:0, D:0, L:0, R:0, A:0, B:0, ST:0, SE:0},
    mC: 0
};

export const txt = (t,x,y,sz,a='center',c=C0) => { ctx.fillStyle=c; ctx.font=`${sz}px "Press Start 2P"`; ctx.textAlign=a; ctx.fillText(t,x,y); };
export const fr = (x,y,w,h,c=C0) => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); };
export const sr = (x,y,w,h,c=C0) => { ctx.strokeStyle=c; ctx.lineWidth=2; ctx.strokeRect(x,y,w,h); };
