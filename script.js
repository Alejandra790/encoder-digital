'use strict';

/* =========================================================
   Encoder de prioridad de 4 entradas y 2 salidas
   Prioridad: E3 > E2 > E1 > E0
   ========================================================= */

const NOMBRES = ['E0', 'E1', 'E2', 'E3'];

/**
 * Lógica del encoder.
 * @param {boolean[]} entradas  [E0, E1, E2, E3]
 * @returns {{v:number, index:(number|null), s1:number, s0:number}}
 */
function encode(entradas) {
  for (let i = 3; i >= 0; i--) {
    if (entradas[i]) {
      return { v: 1, index: i, s1: (i >> 1) & 1, s0: i & 1 };
    }
  }
  return { v: 0, index: null, s1: 0, s0: 0 };
}

/* ---------- Utilidades de texto ---------- */
function listaEs(arr) {
  if (arr.length <= 1) return arr.join('');
  return arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
}

function explicar(entradas) {
  const r = encode(entradas);
  const activas = NOMBRES.filter((_, i) => entradas[i]);
  if (!r.v) {
    return 'No hay entradas activas. La señal de validez es 0, por lo que no existe una entrada seleccionada. ' +
           'El código de salida no debe interpretarse como una selección válida.';
  }
  const codigo = '' + r.s1 + r.s0;
  const ganadora = NOMBRES[r.index];
  if (activas.length === 1) {
    return 'La entrada ' + ganadora + ' es la única activa. Por lo tanto, el encoder produce la salida binaria ' +
           codigo + ' y la señal de validez es 1.';
  }
  const ignoradas = activas.filter(n => n !== ganadora);
  return 'Las entradas ' + listaEs(activas) + ' están activas. Como ' + ganadora +
         ' tiene mayor prioridad que ' + listaEs(ignoradas) + ', el encoder selecciona ' + ganadora +
         ' y genera la salida ' + codigo + '. La señal de validez es 1.';
}

/* Exportar para pruebas en Node (no afecta al navegador) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { encode, explicar, listaEs };
}

/* =========================================================
   Interfaz (solo en navegador)
   ========================================================= */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciar);
}

function iniciar() {
  const $ = (id) => document.getElementById(id);
  const estado = [false, false, false, false];
  let filtroMulti = false;
  let ejemploIdx = 0;
  const EJEMPLOS = [[1, 3], [0, 2], [0, 1, 2], [0, 1, 2, 3]];

  /* ----- Menú móvil ----- */
  const toggle = $('navToggle');
  const links = $('navLinks');
  toggle.addEventListener('click', () => {
    const abierto = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(abierto));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ----- Tabla de verdad (16 filas) ----- */
  const cuerpo = $('truthBody');
  for (let n = 0; n < 16; n++) {
    const ent = [!!(n & 1), !!(n & 2), !!(n & 4), !!(n & 8)]; // [E0,E1,E2,E3]
    const r = encode(ent);
    const cuenta = ent.filter(Boolean).length;
    const tr = document.createElement('tr');
    tr.dataset.n = String(n);
    if (cuenta > 1) tr.classList.add('multi');
    if (!r.v) tr.classList.add('invalid');

    let obs;
    if (!r.v) obs = '<span class="badge">Sin entrada válida (V = 0)</span>';
    else if (cuenta > 1) obs = '<span class="badge multi">Varias activas: gana ' + NOMBRES[r.index] + '</span>';
    else obs = '<span class="badge ok">Una sola activa</span>';

    tr.innerHTML =
      '<td>' + n + '</td>' +
      '<td>' + (ent[3] ? 1 : 0) + '</td><td>' + (ent[2] ? 1 : 0) + '</td>' +
      '<td>' + (ent[1] ? 1 : 0) + '</td><td>' + (ent[0] ? 1 : 0) + '</td>' +
      '<td>' + r.s1 + '</td><td>' + r.s0 + '</td><td>' + r.v + '</td>' +
      '<td class="sel">' + (r.v ? NOMBRES[r.index] : 'Ninguna') + '</td>' +
      '<td class="sel">' + obs + '</td>';
    tr.title = 'Clic para cargar esta combinación en el simulador';
    tr.addEventListener('click', () => {
      for (let i = 0; i < 4; i++) estado[i] = ent[i];
      render();
      $('simulador').scrollIntoView({ behavior: 'smooth' });
    });
    cuerpo.appendChild(tr);
  }

  function aplicarFiltro() {
    cuerpo.querySelectorAll('tr').forEach((tr) => {
      tr.hidden = filtroMulti && !tr.classList.contains('multi');
    });
    $('fAll').classList.toggle('is-active', !filtroMulti);
    $('fMulti').classList.toggle('is-active', filtroMulti);
    $('fAll').setAttribute('aria-pressed', String(!filtroMulti));
    $('fMulti').setAttribute('aria-pressed', String(filtroMulti));
  }
  $('fAll').addEventListener('click', () => { filtroMulti = false; aplicarFiltro(); });
  $('fMulti').addEventListener('click', () => { filtroMulti = true; aplicarFiltro(); });

  /* ----- Render del simulador ----- */
  function render() {
    const r = encode(estado);
    const activas = estado.filter(Boolean).length;

    for (let i = 0; i < 4; i++) {
      const sw = $('sw' + i);
      const gana = r.v && r.index === i;
      sw.classList.toggle('on', estado[i] && !gana);
      sw.classList.toggle('win', gana);
      sw.setAttribute('aria-checked', String(estado[i]));
      sw.querySelector('.sw-state').textContent =
        gana ? (activas > 1 ? 'Activa · gana prioridad' : 'Activa') :
        estado[i] ? 'Activa (ignorada)' : 'Inactiva';
      if (gana && activas === 1) sw.querySelector('.sw-state').textContent = 'Activa';

      const gana2 = gana && activas > 1;
      const wire = $('wi' + i);
      const nodo = $('ni' + i);
      wire.setAttribute('class', 'wire' + (estado[i] ? (gana2 || (gana && activas === 1) ? ' win' : ' on') : ''));
      nodo.setAttribute('class', 'node' + (estado[i] ? (gana ? ' win' : ' on') : ''));
    }

    // Salidas
    $('valS1').textContent = r.s1;
    $('valS0').textContent = r.s0;
    $('valV').textContent = r.v;
    $('outS1').classList.toggle('on', !!(r.v && r.s1));
    $('outS0').classList.toggle('on', !!(r.v && r.s0));
    $('outV').classList.toggle('v-on', !!r.v);

    $('wo1').setAttribute('class', 'wire' + (r.v && r.s1 ? ' out' : ''));
    $('wo0').setAttribute('class', 'wire' + (r.v && r.s0 ? ' out' : ''));
    $('wov').setAttribute('class', 'wire' + (r.v ? ' on' : ''));
    $('no1').setAttribute('class', 'node' + (r.v && r.s1 ? ' out' : ''));
    $('no0').setAttribute('class', 'node' + (r.v && r.s0 ? ' out' : ''));
    $('nov').setAttribute('class', 'node' + (r.v ? ' on' : ''));

    $('codeText').textContent = r.v ? ('' + r.s1 + r.s0) : '—';
    $('selText').textContent = r.v ? NOMBRES[r.index] : 'Sin entrada válida';

    const msg = $('priorityMsg');
    if (activas > 1) {
      msg.hidden = false;
      msg.textContent = 'Hay ' + activas + ' entradas activas: el circuito seleccionó la de mayor prioridad (' +
        NOMBRES[r.index] + ').';
    } else {
      msg.hidden = true;
      msg.textContent = '';
    }

    $('explainText').textContent = explicar(estado);

    // Fila actual de la tabla
    const n = (estado[0] ? 1 : 0) | (estado[1] ? 2 : 0) | (estado[2] ? 4 : 0) | (estado[3] ? 8 : 0);
    cuerpo.querySelectorAll('tr').forEach((tr) => {
      tr.classList.toggle('current', tr.dataset.n === String(n));
    });
  }

  /* ----- Eventos del simulador ----- */
  for (let i = 0; i < 4; i++) {
    $('sw' + i).addEventListener('click', () => { estado[i] = !estado[i]; render(); });
  }
  $('btnClear').addEventListener('click', () => { estado.fill(false); render(); });
  document.querySelectorAll('[data-only]').forEach((b) => {
    b.addEventListener('click', () => {
      const k = Number(b.dataset.only);
      for (let i = 0; i < 4; i++) estado[i] = (i === k);
      render();
    });
  });
  $('btnExample').addEventListener('click', () => {
    const ej = EJEMPLOS[ejemploIdx % EJEMPLOS.length];
    ejemploIdx++;
    for (let i = 0; i < 4; i++) estado[i] = ej.indexOf(i) !== -1;
    render();
  });

  aplicarFiltro();
  render();
}
