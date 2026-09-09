/* =========================================
   KAIROS BANK
   V0.2 - MOTOR FINANCIERO
========================================= */


/* =========================================
   DATOS BASE
========================================= */

const APR = 12.90;
const MONTHLY_RATE = APR / 100 / 12;

const NORMAL_PAYMENT = 1189.78;
const TOTAL_PAYMENTS = 72;

/*
  Este capital original está CALIBRADO
  provisionalmente para que:

  pago 29 -> saldo aproximado $37,924.48

  Cuando tengamos el "Amount Financed"
  real del contrato, reemplazaremos
  este valor.
*/

const ORIGINAL_PRINCIPAL = 57321.54;


/* =========================================
   ELEMENTOS HTML
========================================= */

const paymentAmount =
  document.getElementById("paymentAmount");

const paymentsMade =
  document.getElementById("paymentsMade");

const currentBalance =
  document.getElementById("currentBalance");

const selectedPayment =
  document.getElementById("selectedPayment");

const extraPayment =
  document.getElementById("extraPayment");

const principalPaid =
  document.getElementById("principalPaid");

const interestPaid =
  document.getElementById("interestPaid");

const newBalance =
  document.getElementById("newBalance");

const interestSaved =
  document.getElementById("interestSaved");

const remainingPayments =
  document.getElementById("remainingPayments");

const monthsSaved =
  document.getElementById("monthsSaved");

const simulateButton =
  document.getElementById("simulateButton");

const printButton =
  document.getElementById("printButton");

const resetButton =
  document.getElementById("resetButton");

const receiptSelectedPayment =
  document.getElementById("receiptSelectedPayment");

const receiptExtra =
  document.getElementById("receiptExtra");

const receiptPaymentNumber =
  document.getElementById("receiptPaymentNumber");


/* =========================================
   FORMATO
========================================= */

function currency(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(value);

}


/* =========================================
   CALCULAR SALDO DESPUÉS DE N PAGOS
========================================= */

function calculateBalanceAfterPayments(
  originalBalance,
  payment,
  rate,
  numberOfPayments
) {

  let balance = originalBalance;

  for (
    let i = 0;
    i < numberOfPayments;
    i++
  ) {

    const interest =
      balance * rate;

    const principal =
      payment - interest;

    balance -= principal;

    if (balance <= 0) {
      return 0;
    }

  }

  return balance;

}


/* =========================================
   SIMULAR PRÉSTAMO DESDE UN SALDO
========================================= */

function simulateLoan(
  startingBalance,
  monthlyPayment
) {

  let balance = startingBalance;

  let months = 0;
  let totalInterest = 0;

  while (
    balance > 0 &&
    months < 500
  ) {

    const interest =
      balance * MONTHLY_RATE;

    let payment =
      monthlyPayment;

    if (
      payment >
      balance + interest
    ) {

      payment =
        balance + interest;

    }

    const principal =
      payment - interest;

    if (principal <= 0) {

      return {
        months: Infinity,
        interest: Infinity
      };

    }

    balance -= principal;

    totalInterest += interest;

    months++;

  }

  return {
    months,
    interest: totalInterest
  };

}


/* =========================================
   BOMBITA ÚNICA
========================================= */

function simulateSingleExtra(
  startingBalance,
  selectedAmount
) {

  const interestThisMonth =
    startingBalance * MONTHLY_RATE;

  const principalThisMonth =
    selectedAmount - interestThisMonth;

  const resultingBalance =
    Math.max(
      0,
      startingBalance -
      principalThisMonth
    );

  const future =
    simulateLoan(
      resultingBalance,
      NORMAL_PAYMENT
    );

  return {
    interestThisMonth,
    principalThisMonth,
    resultingBalance,
    months:
      future.months + 1,
    totalInterest:
      interestThisMonth +
      future.interest
  };

}


/* =========================================
   ATAQUE MENSUAL
========================================= */

function simulateMonthlyAttack(
  startingBalance,
  selectedAmount
) {

  const interestThisMonth =
    startingBalance * MONTHLY_RATE;

  const principalThisMonth =
    selectedAmount - interestThisMonth;

  const resultingBalance =
    Math.max(
      0,
      startingBalance -
      principalThisMonth
    );

  const fullSimulation =
    simulateLoan(
      startingBalance,
      selectedAmount
    );

  return {
    interestThisMonth,
    principalThisMonth,
    resultingBalance,
    months:
      fullSimulation.months,
    totalInterest:
      fullSimulation.interest
  };

}


/* =========================================
   ENCONTRAR PAGO PARA ELIMINAR MESES
========================================= */

function findPaymentForTargetMonths(
  startingBalance,
  desiredMonths
) {

  const normal =
    simulateLoan(
      startingBalance,
      NORMAL_PAYMENT
    );

  const targetMonths =
    Math.max(
      1,
      normal.months -
      desiredMonths
    );

  let low =
    NORMAL_PAYMENT;

  let high =
    NORMAL_PAYMENT * 10;

  let result =
    high;

  for (
    let i = 0;
    i < 100;
    i++
  ) {

    const middle =
      (low + high) / 2;

    const simulation =
      simulateLoan(
        startingBalance,
        middle
      );

    if (
      simulation.months <=
      targetMonths
    ) {

      result = middle;
      high = middle;

    } else {

      low = middle;

    }

  }

  return result;

}


/* =========================================
   SALDO ESTIMADO ACTUAL
========================================= */

function getEstimatedCurrentBalance() {

  const made =
    Number(
      paymentsMade.value
    ) || 0;

  return calculateBalanceAfterPayments(
    ORIGINAL_PRINCIPAL,
    NORMAL_PAYMENT,
    MONTHLY_RATE,
    made
  );

}


/* =========================================
   ACTUALIZAR PREVIEW
========================================= */

function updatePreview() {

  const payment =
    Number(
      paymentAmount.value
    ) || 0;

  const extra =
    Math.max(
      0,
      payment -
      NORMAL_PAYMENT
    );

  const balance =
    getEstimatedCurrentBalance();


  currentBalance.textContent =
    currency(balance);

  selectedPayment.textContent =
    currency(payment);

  extraPayment.textContent =
    currency(extra);

  receiptSelectedPayment.textContent =
    currency(payment);

  receiptExtra.textContent =
    currency(extra);

  receiptPaymentNumber.textContent =
    `${paymentsMade.value} / ${TOTAL_PAYMENTS}`;

}


/* =========================================
   SIMULACIÓN PRINCIPAL
========================================= */

function runSimulation() {

  let payment =
    Number(
      paymentAmount.value
    );

  const balance =
    getEstimatedCurrentBalance();

  const mode =
    document.querySelector(
      'input[name="mode"]:checked'
    ).value;


  /* ESCENARIO NORMAL */

  const normalScenario =
    simulateLoan(
      balance,
      NORMAL_PAYMENT
    );


  /* MODO ELIMINAR MESES */

  if (mode === "target") {

    const desiredMonths =
      Number(
        prompt(
          "¿Cuántos meses quieres eliminar?"
        )
      );

    if (
      !desiredMonths ||
      desiredMonths <= 0
    ) {

      return;

    }

    payment =
      findPaymentForTargetMonths(
        balance,
        desiredMonths
      );

    paymentAmount.value =
      payment.toFixed(2);

  }


  /* VALIDACIÓN */

  if (
    payment <
    NORMAL_PAYMENT
  ) {

    alert(
      "El pago elegido debe ser igual o mayor al pago normal."
    );

    return;

  }


  let scenario;


  /* BOMBITA */

  if (mode === "single") {

    scenario =
      simulateSingleExtra(
        balance,
        payment
      );

  }


  /* ATAQUE MENSUAL / OBJETIVO */

  else {

    scenario =
      simulateMonthlyAttack(
        balance,
        payment
      );

  }


  /* CÁLCULOS FINALES */

  const extra =
    payment -
    NORMAL_PAYMENT;

  const savedMonths =
    Math.max(
      0,
      normalScenario.months -
      scenario.months
    );

  const savedInterest =
    Math.max(
      0,
      normalScenario.interest -
      scenario.totalInterest
    );


  /* MOSTRAR */

  currentBalance.textContent =
    currency(balance);

  selectedPayment.textContent =
    currency(payment);

  extraPayment.textContent =
    currency(extra);

  principalPaid.textContent =
    currency(
      scenario.principalThisMonth
    );

  interestPaid.textContent =
    currency(
      scenario.interestThisMonth
    );

  newBalance.textContent =
    currency(
      scenario.resultingBalance
    );

  interestSaved.textContent =
    currency(
      savedInterest
    );

  remainingPayments.textContent =
    scenario.months;

  monthsSaved.textContent =
    savedMonths === 1
      ? "1 mes"
      : `${savedMonths} meses`;


  document
    .querySelector(
      ".result-note"
    )
    .textContent =
      "Estimación de Kairos Bank basada en amortización mensual.";


  updatePreview();

}


/* =========================================
   BOTONES RÁPIDOS
========================================= */

document
  .querySelectorAll("[data-extra]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const extra =
          Number(
            button.dataset.extra
          );

        paymentAmount.value =
          (
            NORMAL_PAYMENT +
            extra
          ).toFixed(2);

        updatePreview();

      }
    );

  });


/* =========================================
   EVENTOS
========================================= */

paymentAmount.addEventListener(
  "input",
  updatePreview
);

paymentsMade.addEventListener(
  "input",
  updatePreview
);


simulateButton.addEventListener(
  "click",
  () => {

    runSimulation();

    document
      .getElementById(
        "results"
      )
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


printButton.addEventListener(
  "click",
  () => {

    window.print();

  }
);


resetButton.addEventListener(
  "click",
  () => {

    paymentAmount.value =
      NORMAL_PAYMENT.toFixed(2);

    paymentsMade.value =
      29;

    principalPaid.textContent =
      "—";

    interestPaid.textContent =
      "—";

    newBalance.textContent =
      "—";

    interestSaved.textContent =
      "—";

    remainingPayments.textContent =
      "—";

    monthsSaved.textContent =
      "—";

    updatePreview();

  }
);


/* =========================================
   INICIO
========================================= */

updatePreview();
