import { W, D } from './state.js';

export const rsz = () => {
    const gb = D.getElementById('gb');
    const isLs = D.body.classList.contains('ls');
    if (isLs) {
        gb.style.width = W.innerWidth + 'px';
        gb.style.height = W.innerHeight + 'px';
        gb.style.transform = 'none'; 
    } else {
        gb.style.width = '380px';
        gb.style.height = '680px';
        const scale = Math.min(W.innerWidth / 380, W.innerHeight / 680) * 0.98;
        gb.style.transform = `scale(${scale})`;
    }
};

export const checkOri = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in W);
    if(isMobile) {
        if(W.innerWidth > W.innerHeight) D.body.classList.add('ls');
        else D.body.classList.remove('ls');
    }
    rsz();
};

export const initDisplay = () => {
    W.addEventListener('resize', checkOri);
    W.addEventListener('orientationchange', checkOri);
    D.getElementById('tgl-rot').addEventListener('click', () => { D.body.classList.toggle('ls'); rsz(); });
    D.getElementById('tgl-ctrl').addEventListener('click', () => { D.body.classList.toggle('hide-ctrl'); });
    checkOri();
};
