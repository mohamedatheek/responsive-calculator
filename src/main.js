import './style.css';

const display = document.querySelector('#display');
const keypad = document.querySelector('#keypad');

let current = '0';
let previous = null;
let operator = null;
let waitingForNext = false;
let justCalculated = false;

function show() {
  if (current === 'Error') {
    display.textContent = 'Error';
    return;
  }

  // Commas improve readability, but keep a trailing decimal point while typing.
  const [integer, decimals] = current.split('.');
  const prettyInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = decimals === undefined ? prettyInteger : `${prettyInteger}.${decimals}`;
  display.textContent = formatted;
  display.style.fontSize = formatted.length > 14 ? '2.4rem' : '';
}

function allClear() {
  current = '0';
  previous = null;
  operator = null;
  waitingForNext = false;
  justCalculated = false;
  show();
}

function enterDigit(digit) {
  if (current === 'Error') allClear();
  if (waitingForNext || justCalculated) {
    current = digit;
    waitingForNext = false;
    justCalculated = false;
  } else if (current.replace(/\D/g, '').length < 12) {
    current = current === '0' ? digit : current + digit;
  }
  show();
}

function enterDecimal() {
  if (current === 'Error') allClear();
  if (waitingForNext || justCalculated) {
    current = '0.';
    waitingForNext = false;
    justCalculated = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  show();
}

function calculate(a, b, selectedOperator) {
  let answer;
  switch (selectedOperator) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '×': answer = a * b; break;
    case '÷': answer = b === 0 ? NaN : a / b; break;
    default: return null;
  }
  return Number.isFinite(answer) ? String(Number(answer.toPrecision(12))) : 'Error';
}

function chooseOperator(nextOperator) {
  if (current === 'Error') return;

  if (operator !== null && !waitingForNext) {
    current = calculate(previous, Number(current), operator);
    if (current === 'Error') {
      previous = null;
      operator = null;
      show();
      return;
    }
  }
  previous = Number(current);
  operator = nextOperator;
  waitingForNext = true;
  justCalculated = false;
  show();
}

function equals() {
  if (operator === null || waitingForNext || current === 'Error') return;
  current = calculate(previous, Number(current), operator);
  previous = null;
  operator = null;
  waitingForNext = false;
  justCalculated = true;
  show();
}

function percent() {
  if (current === 'Error') return;
  current = String(Number((Number(current) / 100).toPrecision(12)));
  waitingForNext = false;
  justCalculated = false;
  show();
}

function deleteDigit() {
  if (current === 'Error' || justCalculated) {
    allClear();
    return;
  }
  if (waitingForNext) {
    // Cancel the pending operation so DEL does not delete an invisible digit.
    operator = null;
    previous = null;
    waitingForNext = false;
  }
  current = current.length > 1 ? current.slice(0, -1) : '0';
  if (current === '-' || current === '') current = '0';
  show();
}

function performAction(action) {
  switch (action) {
    case 'clear': allClear(); break;
    case 'delete': deleteDigit(); break;
    case 'decimal': enterDecimal(); break;
    case 'percent': percent(); break;
    case 'equals': equals(); break;
  }
}

// Mouse and touch: event delegation on the keypad.
keypad.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action) performAction(button.dataset.action);
});

// Extra usability: keyboard shortcuts.
document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
  else if (event.key === '.') enterDecimal();
  else if (['+', '-'].includes(event.key)) chooseOperator(event.key);
  else if (event.key === '*') chooseOperator('×');
  else if (event.key === '/') chooseOperator('÷');
  else if (event.key === '%') percent();
  else if (event.key === 'Enter' || event.key === '=') equals();
  else if (event.key === 'Backspace') deleteDigit();
  else if (event.key === 'Escape') allClear();
  else return;
  event.preventDefault();
});

show();
