/* =========================================
   KAIROS BANK
   V0.1

   Estructura funcional.
   Todavía NO contiene algoritmo financiero.
========================================= */


const NORMAL_PAYMENT = 1189.78;
const TOTAL_PAYMENTS = 72;


/* ELEMENTOS */

const paymentAmount =
  document.getElementById("paymentAmount");

const paymentsMade =
  document.getElementById("paymentsMade");

const selectedPayment =
  document.getElementById("selectedPayment");

const extraPayment =
  document.getElementById("extraPayment");

const simulateButton =
  document.getElementById("simulateButton");

const printButton =
  document.getElementById("printButton");

const resetButton =
  document.getElementById("resetButton");

const receiptSelectedPayment =
  document.getElementById(
    "receiptSelectedPayment"
  );

const receiptExtra =
  document.getElementById(
    "receiptExtra"
  );

const receiptPaymentNumber =
  document.getElementById(
    "receiptPaymentNumber"
  );


/* FORMATO MONEDA */

function currency(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(value);

}


/* ACTUALIZAR VISTA */

function updatePreview() {

  let payment =
    Number(paymentAmount.value) || 0;

  let extra =
    Math.max(
      0,
      payment - NORMAL_PAYMENT
    );


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


/* BOTONES RÁPIDOS */

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


/* CAMBIOS DIRECTOS */

paymentAmount.addEventListener(
  "input",
  updatePreview
);


paymentsMade.addEventListener(
  "input",
  updatePreview
);


/* SIMULAR */

simulateButton.addEventListener(
  "click",
  () => {

    updatePreview();

    document
      .getElementById("results")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* IMPRIMIR */

printButton.addEventListener(
  "click",
  () => {

    updatePreview();

    window.print();

  }
);


/* LIMPIAR */

resetButton.addEventListener(
  "click",
  () => {

    paymentAmount.value =
      NORMAL_PAYMENT.toFixed(2);

    paymentsMade.value =
      29;

    updatePreview();

  }
);


/* INICIO */

updatePreview();
