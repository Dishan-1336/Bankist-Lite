'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// -------------------------------- FOR DISPLAYING ALL THE TRANSACTIONS ----------------------------------------

let displayTransactions = (movements, sort = false) => {
  containerMovements.textContent = '';

  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    let type = mov < 0 ? 'withdrawal' : 'deposit';

    let html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// -------------------------------- FOR DISPLAYING THE OVERALL SUMMARY ----------------------------------------

let calcDisplaySummary = acc => {
  let income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = income;

  let expense = acc.movements
    .filter(mov => mov < 0)
    .map(mov => Math.abs(mov))
    .reduce((acc, curr) => acc + curr, 0);

  labelSumOut.textContent = expense;
  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = interest;

  acc.balance = income - expense;
  labelBalance.textContent = `${acc.balance}€`;
};

// -------------------------------- FOR CREATING USERNAME ----------------------------------------

let createUserName = accs => {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserName(accounts);

//displayTransactions(account1.movements);
//calcDisplaySummary(account1.movements);

// console.log(accounts);

// -------------------------------- FOR LOGIN ----------------------------------------

let currentUser;

// ------------------------------- UPDATE THE DATA --------------------------------------

let updateData = () => {
  displayTransactions(currentUser.movements);
  calcDisplaySummary(currentUser);
};

btnLogin.onclick = event => {
  event.preventDefault();

  currentUser = accounts.find(acc => {
    return acc.userName === inputLoginUsername.value;
  });

  if (currentUser.pin == inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentUser.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';

    updateData();
  }
};

// -------------------------------- FOR TRANSFERRING MONEY ----------------------------------------

btnTransfer.onclick = event => {
  event.preventDefault();

  let transferAmount = Number(inputTransferAmount.value);
  let receiverAccount = accounts.find(acc => {
    return acc.userName === inputTransferTo.value;
  });

  if (transferAmount > 0 && Number(currentUser.balance) >= transferAmount) {
    currentUser.movements.push(-transferAmount);

    receiverAccount.movements.push(transferAmount);

    inputTransferAmount.value = inputTransferTo.value = '';

    updateData();
  } else {
    alert('Invalid amount or, account');
  }
};

// -------------------------------- FOR GETTING LOAN ----------------------------------------

btnLoan.onclick = event => {
  event.preventDefault();

  let loanAmount = Number(inputLoanAmount.value);

  if (
    Number(loanAmount) > 0 &&
    currentUser.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currentUser.movements.push(loanAmount);
    updateData();

    inputLoanAmount.value = '';
  }
};

// -------------------------------- FOR DELETING MONEY ----------------------------------------

btnClose.onclick = event => {
  event.preventDefault();

  if (
    currentUser.userName === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(
      acc => acc.userName === currentUser.userName
    );

    accounts.splice(index, 1);

    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
};

// -------------------------------- FOR SORTING ----------------------------------------

let sorted = false;
btnSort.onclick = () => {
  displayTransactions(currentUser.movements, !sorted);
  sorted = !sorted;
};
