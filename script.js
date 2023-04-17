"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Dishan Ahmed",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Antu Chakrabarty",
  movements: [430, 1000, 700, 50, 900, 750, -500],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-09T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-27T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-14T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-27T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account5 = {
  owner: "Romel Rahman",
  movements: [430, 1000, 700, 50, 90, -200],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-21T09:48:16.867Z",
    "2019-12-20T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-08T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-29T18:49:59.371Z",
    "2020-07-20T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// -------------------------------------------- ELEMENTS ----------------------------------------

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user"); // userrName = firstLetter of each word in small letter
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// -------------------------------- FOR DATE FORMATTING ----------------------------------------

let calcMovementsDate = (date) => {
  let caclPassedDays = (date) =>
    Math.round((new Date() - date) / (1000 * 60 * 60 * 24));

  let passedDays = caclPassedDays(date);

  if (passedDays === 0) return `Today`;
  if (passedDays === 1) return `Yesterday`;
  if (passedDays <= 7) return `${passedDays} Days Ago`;

  // let year = date.getFullYear();
  // let month = `${date.getMonth() + 1}`.padStart(2, 0);
  // let day = `${date.getDay()}`.padStart(2, 0);

  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(currentUser.locale).format(date);
};

// ---------------------------------------- FOR DATE FORMATTING -----------------------------------------------------

let formatCur = (value, locale, cur) => {
  let options = {
    style: "currency",
    currency: cur,
  };

  return new Intl.NumberFormat(locale, options).format(value);
};

// -------------------------------- FOR DISPLAYING ALL THE TRANSACTIONS ----------------------------------------

let displayTransactions = (acc, sort = false) => {
  containerMovements.textContent = "";

  let movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    let date = calcMovementsDate(new Date(acc.movementsDates[i]));

    let type = mov < 0 ? "withdrawal" : "deposit";

    let html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${date}</div>
      <div class="movements__value">${formatCur(
        mov,
        currentUser.locale,
        currentUser.currency
      )}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// -------------------------------- FOR DISPLAYING THE OVERALL SUMMARY ----------------------------------------

let calcDisplaySummary = (acc) => {
  let income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = formatCur(
    income,
    currentUser.locale,
    currentUser.currency
  );

  let expense = acc.movements
    .filter((mov) => mov < 0)
    .map((mov) => Math.abs(mov))
    .reduce((acc, curr) => acc + curr, 0);

  labelSumOut.textContent = formatCur(
    expense,
    currentUser.locale,
    currentUser.currency
  );
  let interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => mov * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = formatCur(
    interest,
    currentUser.locale,
    currentUser.currency
  );

  acc.balance = income - expense;
  labelBalance.textContent = formatCur(
    acc.balance,
    currentUser.locale,
    currentUser.currency
  );
};

// -------------------------------- FOR CREATING USERNAME ----------------------------------------

let createUserName = (accs) => {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};

createUserName(accounts);

let currentUser, timer;

// ------------------------------- START LOGOUT TIMER --------------------------------------

let startLogoutTimer = () => {
  let time = 300;
  let tick = () => {
    let min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    let sec = `${time % 60}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    time--;

    if (time == -1) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started...";
      containerApp.style.opacity = 0;
    }
  };

  let timer = setInterval(tick, 1000);
  return timer;
};

// ------------------------------- UPDATE THE DATA --------------------------------------

let updateData = () => {
  displayTransactions(currentUser);
  calcDisplaySummary(currentUser);
};

// -------------------------------- FOR LOGIN ----------------------------------------

btnLogin.onclick = (event) => {
  event.preventDefault();

  currentUser = accounts.find((acc) => {
    return acc.userName === inputLoginUsername.value;
  });

  if (!currentUser) {
    alert("Invalid UserName");
  }

  if (currentUser.pin == inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentUser.owner.split(" ")[0]
    }`;

    setInterval(() => {
      let date = new Date();
      // let year = date.getFullYear();
      // let month = `${date.getMonth() + 1}`.padStart(2, 0);
      // let day = `${date.getDay()}`.padStart(2, 0);
      let hour = `${date.getHours()}`.padStart(2, 0);
      let min = `${date.getMinutes()}`.padStart(2, 0);
      let sec = `${date.getSeconds()}`.padStart(2, 0);
      // let options = {
      //   hour: "Numeric",
      //   min: "Numeric",
      //   day: "Numeric",
      //   month: "Numeric",
      //   year: "short",
      // };

      labelDate.textContent = `${new Intl.DateTimeFormat(
        currentUser.locale
      ).format(date)}, ${hour}:${min}:${sec}`;
    }, 1000);

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateData();
  } else {
    alert("Invalid Pin");
  }
};

// -------------------------------- FOR TRANSFERRING MONEY ----------------------------------------

btnTransfer.onclick = (event) => {
  event.preventDefault();

  let date = new Date();
  let transferAmount = Number(inputTransferAmount.value);
  let receiverAccount = accounts.find((acc) => {
    return acc.userName === inputTransferTo.value;
  });

  if (!receiverAccount) {
    alert("Invalid User Name. Please write correct one!!!");
  }

  if (transferAmount > 0 && Number(currentUser.balance) >= transferAmount) {
    currentUser.movements.push(-transferAmount);
    currentUser.movementsDates.push(date.toISOString());

    receiverAccount.movements.push(transferAmount);
    receiverAccount.movementsDates.push(date.toISOString());

    inputTransferAmount.value = inputTransferTo.value = "";

    updateData();
  } else {
    alert("Invalid amount");
  }

  clearInterval(timer);
  timer = startLogoutTimer();
};

// -------------------------------- FOR GETTING LOAN ----------------------------------------

btnLoan.onclick = (event) => {
  event.preventDefault();

  let date = new Date();

  let loanAmount = Number(inputLoanAmount.value);

  if (
    Number(loanAmount) > 0 &&
    currentUser.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      currentUser.movements.push(loanAmount);
      currentUser.movementsDates.push(date.toISOString());
      updateData();
    }, 5000);

    inputLoanAmount.value = "";
  } else {
    alert("You are not allowed for this amount!!!");
  }

  clearInterval(timer);
  timer = startLogoutTimer();
};

// -------------------------------- FOR DELETING ACCOUNT ----------------------------------------

btnClose.onclick = (event) => {
  event.preventDefault();

  if (
    currentUser.userName === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(
      (acc) => acc.userName === currentUser.userName
    );

    accounts.splice(index, 1);

    inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = 0;
  } else {
    alert("Invalid username or, pin!!!");
  }

  clearInterval(timer);
  timer = startLogoutTimer();
};

// -------------------------------- FOR SORTING ----------------------------------------

let sorted = false;
btnSort.onclick = () => {
  displayTransactions(currentUser, !sorted);
  sorted = !sorted;
};
