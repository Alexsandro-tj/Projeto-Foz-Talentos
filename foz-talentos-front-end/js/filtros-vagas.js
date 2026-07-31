"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const clearFiltersButton =
    document.getElementById("clearFilters");

  const searchInput =
    document.getElementById("publicSearch");

  const stateFilter =
    document.getElementById("publicStateFilter");

  const areaFilter =
    document.getElementById("publicAreaFilter");

  const modalidadeCheckboxes =
    document.querySelectorAll(".modalidade-filter");

  const contratoCheckboxes =
    document.querySelectorAll(".contrato-filter");

  const experienciaCheckboxes =
    document.querySelectorAll(".experiencia-filter");

  const dateRadioButtons =
    document.querySelectorAll(".date-filter");

  const salaryMinFilter =
    document.getElementById("salaryMinFilter");

  const salaryMaxFilter =
    document.getElementById("salaryMaxFilter");

  const salaryMinText =
    document.getElementById("salaryMinText");

  const salaryMaxText =
    document.getElementById("salaryMaxText");

  const salaryRangeProgress =
    document.getElementById("salaryRangeProgress");


  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(valor);
  }


  function atualizarFaixaSalarial() {

    if (!salaryMinFilter || !salaryMaxFilter) {
      return;
    }

    let minimo = Number(salaryMinFilter.value);
    let maximo = Number(salaryMaxFilter.value);

    if (minimo > maximo) {
      if (document.activeElement === salaryMinFilter) {
        minimo = maximo;
        salaryMinFilter.value = String(minimo);
      } else {
        maximo = minimo;
        salaryMaxFilter.value = String(maximo);
      }
    }

    if (salaryMinText) {
      salaryMinText.textContent = formatarMoeda(minimo);
    }

    if (salaryMaxText) {
      salaryMaxText.textContent = formatarMoeda(maximo);
    }

    if (salaryRangeProgress) {
      const limiteMinimo = Number(salaryMinFilter.min || 0);
      const limiteMaximo = Number(salaryMaxFilter.max || 20000);
      const intervalo = limiteMaximo - limiteMinimo;

      const inicio =
        ((minimo - limiteMinimo) / intervalo) * 100;

      const fim =
        ((maximo - limiteMinimo) / intervalo) * 100;

      salaryRangeProgress.style.left = `${inicio}%`;
      salaryRangeProgress.style.right = `${100 - fim}%`;
    }

    document.dispatchEvent(
      new CustomEvent("salaryFilterChange", {
        detail: {
          minimum: minimo,
          maximum: maximo
        }
      })
    );
  }


  salaryMinFilter?.addEventListener(
    "input",
    atualizarFaixaSalarial
  );

  salaryMaxFilter?.addEventListener(
    "input",
    atualizarFaixaSalarial
  );


  clearFiltersButton?.addEventListener("click", () => {

    if (searchInput) {
      searchInput.value = "";
      searchInput.dispatchEvent(
        new Event("input", { bubbles: true })
      );
    }

    if (stateFilter) {
      stateFilter.value = "";
      stateFilter.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }

    if (areaFilter) {
      areaFilter.value = "";
      areaFilter.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }

    [
      modalidadeCheckboxes,
      contratoCheckboxes,
      experienciaCheckboxes
    ].forEach((grupo) => {

      grupo.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      });

    });

    dateRadioButtons.forEach((radioButton) => {
      radioButton.checked = radioButton.value === "";
    });

    const todasAsDatas =
      Array.from(dateRadioButtons)
        .find((radioButton) => radioButton.value === "");

    todasAsDatas?.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    if (salaryMinFilter) {
      salaryMinFilter.value =
        salaryMinFilter.min || "0";
    }

    if (salaryMaxFilter) {
      salaryMaxFilter.value =
        salaryMaxFilter.max || "20000";
    }

    atualizarFaixaSalarial();
  });


  atualizarFaixaSalarial();

});
