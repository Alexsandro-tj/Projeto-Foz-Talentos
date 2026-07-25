"use strict";

/*
  Aguarda todo o HTML ser carregado.
*/
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTOS DA PÁGINA
  ========================================================= */

  const searchInput =
    document.getElementById("publicSearch");

  const stateFilter =
    document.getElementById("publicStateFilter");

  const areaFilter =
    document.getElementById("publicAreaFilter");

  const clearFiltersButton =
    document.getElementById("clearFilters");

  const modalidadeCheckboxes =
    document.querySelectorAll(".modalidade-filter");

  const contratoCheckboxes =
    document.querySelectorAll(".contrato-filter");

  const dateRadioButtons =
    document.querySelectorAll(".date-filter");

  /*
    Controles do filtro salarial.
  */
  const salaryMinFilter =
    document.getElementById("salaryMinFilter");

  const salaryMaxFilter =
    document.getElementById("salaryMaxFilter");

  /*
    Textos que exibem os valores selecionados.
  */
  const salaryMinText =
    document.getElementById("salaryMinText");

  const salaryMaxText =
    document.getElementById("salaryMaxText");

  /*
    Parte azul da barra salarial.
  */
  const salaryRangeProgress =
    document.getElementById("salaryRangeProgress");


  /* =========================================================
     CONFIGURAÇÕES DO SALÁRIO
  ========================================================= */

  /*
    Distância mínima permitida entre os dois pontos.

    Exemplo:
    mínimo = R$ 2.000
    máximo não poderá ficar abaixo de R$ 2.500.
  */
  const salaryGap = 500;


  /* =========================================================
     FORMATAR VALOR EM REAL
  ========================================================= */

  function formatCurrency(value) {

    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    });
  }


  /* =========================================================
     ATUALIZAR VISUAL DO SLIDER
  ========================================================= */

  function updateSalarySlider(changedInput) {

    /*
      Caso algum elemento não exista,
      a função é encerrada.
    */
    if (
      !salaryMinFilter ||
      !salaryMaxFilter ||
      !salaryMinText ||
      !salaryMaxText ||
      !salaryRangeProgress
    ) {
      return;
    }

    let minimumValue =
      Number(salaryMinFilter.value);

    let maximumValue =
      Number(salaryMaxFilter.value);

    /*
      Impede o ponto mínimo de ultrapassar
      o ponto máximo.
    */
    if (
      changedInput === salaryMinFilter &&
      maximumValue - minimumValue < salaryGap
    ) {
      minimumValue = maximumValue - salaryGap;

      salaryMinFilter.value =
        String(minimumValue);
    }

    /*
      Impede o ponto máximo de ultrapassar
      o ponto mínimo.
    */
    if (
      changedInput === salaryMaxFilter &&
      maximumValue - minimumValue < salaryGap
    ) {
      maximumValue = minimumValue + salaryGap;

      salaryMaxFilter.value =
        String(maximumValue);
    }

    /*
      Atualiza os textos apresentados ao usuário.
    */
    salaryMinText.textContent =
      formatCurrency(minimumValue);

    salaryMaxText.textContent =
      formatCurrency(maximumValue);

    /*
      Obtém os valores mínimo e máximo
      definidos no próprio input.
    */
    const sliderMinimum =
      Number(salaryMinFilter.min);

    const sliderMaximum =
      Number(salaryMinFilter.max);

    /*
      Transforma os valores em porcentagens
      para posicionar corretamente a barra azul.
    */
    const minimumPercentage =
      ((minimumValue - sliderMinimum) /
        (sliderMaximum - sliderMinimum)) * 100;

    const maximumPercentage =
      ((maximumValue - sliderMinimum) /
        (sliderMaximum - sliderMinimum)) * 100;

    salaryRangeProgress.style.left =
      `${minimumPercentage}%`;

    salaryRangeProgress.style.width =
      `${maximumPercentage - minimumPercentage}%`;
  }


  /* =========================================================
     EVENTOS DO FILTRO SALARIAL
  ========================================================= */

  salaryMinFilter?.addEventListener("input", () => {

    updateSalarySlider(salaryMinFilter);

    /*
      Cria um evento personalizado para avisar
      ao vagas.js que o salário foi alterado.
    */
    document.dispatchEvent(
      new CustomEvent("salaryFilterChange", {
        detail: {
          minimum: Number(salaryMinFilter.value),
          maximum: Number(salaryMaxFilter.value)
        }
      })
    );
  });

  salaryMaxFilter?.addEventListener("input", () => {

    updateSalarySlider(salaryMaxFilter);

    document.dispatchEvent(
      new CustomEvent("salaryFilterChange", {
        detail: {
          minimum: Number(salaryMinFilter.value),
          maximum: Number(salaryMaxFilter.value)
        }
      })
    );
  });


  /* =========================================================
     FUNÇÃO PARA DISPARAR EVENTOS
  ========================================================= */

  function dispatchElementEvent(element, eventType) {

    if (!element) {
      return;
    }

    element.dispatchEvent(
      new Event(eventType, {
        bubbles: true
      })
    );
  }


  /* =========================================================
     BOTÃO LIMPAR FILTROS
  ========================================================= */

  if (!clearFiltersButton) {
    console.error(
      'Botão com id "clearFilters" não foi encontrado.'
    );

    return;
  }

  clearFiltersButton.addEventListener("click", () => {

    /*
      Desmarca as modalidades.
    */
    modalidadeCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    /*
      Desmarca os contratos.
    */
    contratoCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    /*
      Volta o filtro de data para "Todas".
    */
    dateRadioButtons.forEach((radioButton) => {
      radioButton.checked = radioButton.value === "";
    });

    /*
      Limpa estado e área.
    */
    if (stateFilter) {
      stateFilter.value = "";
    }

    if (areaFilter) {
      areaFilter.value = "";
    }

    /*
      Apaga a pesquisa.
    */
    if (searchInput) {
      searchInput.value = "";
    }

    /*
      Restaura a faixa salarial completa.
    */
    if (salaryMinFilter) {
      salaryMinFilter.value =
        salaryMinFilter.min;
    }

    if (salaryMaxFilter) {
      salaryMaxFilter.value =
        salaryMaxFilter.max;
    }

    updateSalarySlider();


    /* =========================================================
       AVISAR A LÓGICA DAS VAGAS
    ========================================================= */

    dispatchElementEvent(searchInput, "input");
    dispatchElementEvent(stateFilter, "change");
    dispatchElementEvent(areaFilter, "change");

    modalidadeCheckboxes.forEach((checkbox) => {
      dispatchElementEvent(checkbox, "change");
    });

    contratoCheckboxes.forEach((checkbox) => {
      dispatchElementEvent(checkbox, "change");
    });

    dateRadioButtons.forEach((radioButton) => {
      dispatchElementEvent(radioButton, "change");
    });

    /*
      Avisa que o salário voltou para
      a faixa completa.
    */
    document.dispatchEvent(
      new CustomEvent("salaryFilterChange", {
        detail: {
          minimum: Number(
            salaryMinFilter?.value ?? 0
          ),

          maximum: Number(
            salaryMaxFilter?.value ?? 20000
          )
        }
      })
    );
  });


  /* =========================================================
     CONFIGURAÇÃO INICIAL
  ========================================================= */

  /*
    Preenche os valores e a barra azul
    assim que a página abre.
  */
  updateSalarySlider();

});