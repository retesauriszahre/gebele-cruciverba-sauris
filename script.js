/* Gebele. — Cruciverba Sauris
   Script condiviso dalle tre pagine (index.html, cruciverba.html, vinto.html).
   Ogni blocco si aggancia solo se gli elementi che gli servono esistono nella pagina corrente. */

const STORAGE_KEY = 'gebele_hidden_word';

function saveHiddenWord(word) {
  try {
    localStorage.setItem(STORAGE_KEY, word);
  } catch (e) {
    /* localStorage non disponibile (es. navigazione privata): la pagina resta comunque usabile */
  }
}

function readHiddenWord() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}

/* ============================================================
   PAGINA CRUCIVERBA
   ============================================================ */

const gridData = [[null, null, null, null, null, "M", "I", "L", "L", "E", "F", "I", "O", "R", "I"], ["F", "A", "G", "G", "I", "O", null, null, null, null, null, null, null, null, null], [null, "A", "F", "F", "I", "N", "A", "Z", "I", "O", "N", "E", null, null, null], [null, null, null, "O", "R", "T", "O", null, null, null, null, null, null, null, null], [null, null, null, null, "F", "A", "V", "A", null, null, null, null, null, null, null], [null, null, null, "C", "A", "N", "A", "P", "A", null, null, null, null, null, null], [null, null, null, null, null, "A", "C", "H", "I", "L", "L", "E", "A", null, null], [null, null, null, null, "C", "R", "A", "U", "T", "I", null, null, null, null, null], [null, null, "L", "I", "N", "O", null, null, null, null, null, null, null, null, null]];
const hlCol = 5;
const rowsMeta = [["MILLEFIORI", 5, 0], ["FAGGIO", 0, 5], ["AFFINAZIONE", 1, 4], ["ORTO", 3, 2], ["FAVA", 4, 1], ["CANAPA", 3, 2], ["ACHILLEA", 5, 0], ["CRAUTI", 4, 1], ["LINO", 2, 3]];

function normalize(s) {
  return (s || "").toUpperCase().trim();
}

function hideRewardCta() {
  const cta = document.getElementById('reward-cta');
  if (cta) cta.hidden = true;
}

const checkBtn = document.getElementById('check-btn');
if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    let allFilled = true;
    let allCorrect = true;
    cells.forEach(cell => {
      const input = cell.querySelector('input');
      const val = normalize(input.value);
      const expected = cell.dataset.letter.toUpperCase();
      cell.classList.remove('correct','wrong');
      if (!val) allFilled = false;
      if (val === expected) {
        cell.classList.add('correct');
      } else {
        cell.classList.add('wrong');
        allCorrect = false;
      }
    });
    const feedback = document.getElementById('feedback');
    if (!allFilled) {
      feedback.textContent = 'Mancano ancora alcune caselle.';
      feedback.className = 'bad';
      document.getElementById('reveal').classList.remove('show');
      hideRewardCta();
    } else if (allCorrect) {
      feedback.textContent = 'Tutte le risposte sono corrette.';
      feedback.className = 'ok';
      let hidden = '';
      rowsMeta.forEach(([word, start, hl]) => { hidden += word[hl]; });
      document.getElementById('reveal-word').textContent = hidden;
      document.getElementById('reveal').classList.add('show');
      saveHiddenWord(hidden);
      const cta = document.getElementById('reward-cta');
      if (cta) cta.hidden = false;
    } else {
      feedback.textContent = 'Qualche lettera non è corretta: riprova.';
      feedback.className = 'bad';
      document.getElementById('reveal').classList.remove('show');
      hideRewardCta();
    }
  });
}

const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell input').forEach(i => i.value = '');
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('correct','wrong'));
    document.getElementById('feedback').textContent = '';
    document.getElementById('reveal').classList.remove('show');
    hideRewardCta();
  });
}

// DEBUG: pulsante temporaneo di autocompletamento — rimuovere prima della pubblicazione definitiva
const debugFillBtn = document.getElementById('debug-fill-btn');
if (debugFillBtn) {
  debugFillBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => {
      const input = cell.querySelector('input');
      input.value = cell.dataset.letter.toUpperCase();
    });
    document.getElementById('check-btn').click();
  });
}

// auto-advance focus in avanti, e Backspace/Canc che cancella e torna indietro casella per casella
const inputs = Array.from(document.querySelectorAll('.cell input'));
inputs.forEach((input, idx) => {
  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      const next = inputs[idx + 1];
      if (next) next.focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      input.closest('.cell').classList.remove('correct','wrong');
      if (input.value.length > 0) {
        input.value = '';
      } else {
        const prev = inputs[idx - 1];
        if (prev) {
          prev.value = '';
          prev.closest('.cell').classList.remove('correct','wrong');
          prev.focus();
        }
      }
    }
  });
});

/* ============================================================
   PAGINA "HAI VINTO!"
   ============================================================ */

const winOk = document.getElementById('win-ok');
const winEmpty = document.getElementById('win-empty');
if (winOk && winEmpty) {
  const word = readHiddenWord();
  if (word) {
    document.getElementById('win-word').textContent = word;
    winOk.hidden = false;
    winEmpty.hidden = true;
  } else {
    winOk.hidden = true;
    winEmpty.hidden = false;
  }
}
