import { D, state } from './state.js';
import { trg } from '../main.js';

let bindings = JSON.parse(localStorage.getItem('gbBindings')) || {
    'U': 'ArrowUp', 'D': 'ArrowDown', 'L': 'ArrowLeft', 'R': 'ArrowRight',
    'A': 'z', 'B': 'x', 'ST': 'Enter', 'SE': 'Shift'
};
let keyMap = {};
export const updateKeyMap = () => {
    keyMap = {};
    for(let action in bindings) {
        let b = bindings[action].toLowerCase();
        keyMap[b] = action;
    }
};
updateKeyMap();

let listeningAction = null;
const kbList = D.getElementById('kb-list');
export const renderKb = () => {
    kbList.innerHTML = '';
    ['U','D','L','R','A','B','ST','SE'].forEach(act => {
        let lbl = act==='U'?'UP':act==='D'?'DOWN':act==='L'?'LEFT':act==='R'?'RIGHT':act==='ST'?'START':act==='SE'?'SELECT':act;
        
        let row = D.createElement('div');
        row.className = 'kb-row';
        row.innerHTML = `<span>${lbl}</span>`;
        
        let btn = D.createElement('button');
        btn.className = 'kb-btn' + (listeningAction === act ? ' listening' : '');
        btn.innerText = listeningAction === act ? 'PRESS KEY...' : (bindings[act] === ' ' ? 'Space' : bindings[act].toUpperCase());
        
        btn.onclick = () => { listeningAction = act; renderKb(); };
        row.appendChild(btn);
        kbList.appendChild(row);
    });
};

export const initInput = () => {
    D.getElementById('btn-map').onclick = () => { 
        listeningAction = null; 
        renderKb(); 
        D.getElementById('kModal').style.display = 'flex'; 
    };
    D.getElementById('kb-close').onclick = () => { 
        listeningAction = null;
        D.getElementById('kModal').style.display = 'none'; 
    };
    D.getElementById('kb-reset').onclick = () => {
        bindings = { 'U': 'ArrowUp', 'D': 'ArrowDown', 'L': 'ArrowLeft', 'R': 'ArrowRight', 'A': 'z', 'B': 'x', 'ST': 'Enter', 'SE': 'Shift' };
        localStorage.setItem('gbBindings', JSON.stringify(bindings));
        updateKeyMap();
        listeningAction = null;
        renderKb();
    };

    D.addEventListener("keydown", (e) => { 
        const kModal = D.getElementById('kModal');
        if(kModal.style.display === 'flex') {
            if(listeningAction) {
                e.preventDefault();
                bindings[listeningAction] = e.key === ' ' ? 'Space' : e.key;
                localStorage.setItem('gbBindings', JSON.stringify(bindings));
                updateKeyMap();
                listeningAction = null;
                renderKb();
            }
            return;
        }

        let keyStr = e.key.toLowerCase();
        if(e.key === ' ') keyStr = 'space';
        let action = keyMap[keyStr];
        
        if(action) { 
            e.preventDefault(); 
            if(!state.k[action]) trg(action); 
            state.k[action] = 1; 
        } 
    });

    D.addEventListener("keyup", (e) => { 
        let keyStr = e.key.toLowerCase();
        if(e.key === ' ') keyStr = 'space';
        let action = keyMap[keyStr];
        if(action) { 
            e.preventDefault(); 
            state.k[action] = 0; 
        } 
    });

    ['U','D','L','R','A','B','ST','SE'].forEach(btn => {
        const el = D.getElementById('b'+btn);
        const p = (e) => { e.preventDefault(); if(!state.k[btn]) trg(btn); state.k[btn] = 1; };
        const r = (e) => { e.preventDefault(); state.k[btn] = 0; };
        el.addEventListener('mousedown', p); el.addEventListener('touchstart', p, {passive: 0});
        el.addEventListener('mouseup', r); el.addEventListener('mouseleave', r); el.addEventListener('touchend', r); el.addEventListener('touchcancel', r);
    });
};
