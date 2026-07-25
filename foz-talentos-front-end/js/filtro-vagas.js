"use strict";

/*
  Aguarda todo o HTML da página ser carregado
  antes de procurar os elementos.
*/
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     CAMPOS DE PESQUISA E FILTROS
  ========================================================= */

  /*
    Campo usado para pesquisar pelo nome da vaga,
    empresa ou cidade.
  */
  const searchInput =
    document.getElementById("publicSearch");

  /*
    Select responsável pelo filtro de estados.
  */
  const stateFilter =
    document.getElementById("publicStateFilter");

  /*
    Select responsável pelo filtro de áreas.
  */
  const areaFilter =
    document.getElementById("publicAreaFilter");

  /*
    Select responsável pelo filtro de data
    de publicação da vaga.
  */
  const dateFilter =
    document.getElementById("publicDateFilter");

  /*
    Select responsável pelo filtro
    por faixa salarial.
  */
  const salaryFilter =
    document.getElementById("publicSalaryFilter");

  /*
    Botão responsável por limpar todos os filtros.
  */
  const clearFiltersButton =
    document.getElementById("clearFilters");

  /*
    Seleciona todos os checkboxes
    usados no filtro de modalidade.
  */
  const modalidadeCheckboxes =
    document.querySelectorAll(".modalidade-filter");

  /*
    Seleciona todos os checkboxes
    usados no filtro de contrato.
  */
  const contratoCheckboxes =
    document.querySelectorAll(".contrato-filter");


  /* =========================================================
     VERIFICAÇÃO DO BOTÃO
  ========================================================= */

  /*
    Caso o botão de limpar filtros não exista,
    mostramos um erro no console e encerramos
    a execução deste arquivo.
  */
  if (!clearFiltersButton) {
    console.error(
      'Botão com id "clearFilters" não foi encontrado.'
    );

    return;
  }


  /* =========================================================
     FUNÇÃO PARA DISPARAR EVENTO
  ========================================================= */

  /*
    Esta função dispara manualmente um evento
    em determinado elemento.

    Isso é necessário porque apenas mudar o valor
    do select ou do input não executa automaticamente
    a lógica de filtragem do outro arquivo JavaScript.
  */
  function dispararEvento(elemento, tipoDoEvento) {

    /*
      Caso o elemento não exista,
      a função apenas termina.
    */
    if (!elemento) {
      return;
    }

    elemento.dispatchEvent(
      new Event(tipoDoEvento, {
        bubbles: true
      })
    );
  }


  /* =========================================================
     CLIQUE NO BOTÃO LIMPAR FILTROS
  ========================================================= */

  clearFiltersButton.addEventListener("click", () => {

    /* ---------------------------------------------------------
       LIMPAR CHECKBOXES DE MODALIDADE
    --------------------------------------------------------- */

    modalidadeCheckboxes.forEach((checkbox) => {

      /*
        false significa que o checkbox
        ficará desmarcado.
      */
      checkbox.checked = false;
    });


    /* ---------------------------------------------------------
       LIMPAR CHECKBOXES DE CONTRATO
    --------------------------------------------------------- */

    contratoCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });


    /* ---------------------------------------------------------
       LIMPAR FILTRO DE ESTADO
    --------------------------------------------------------- */

    if (stateFilter) {

      /*
        O valor vazio corresponde à opção:
        "Todos os estados".
      */
      stateFilter.value = "";
    }


    /* ---------------------------------------------------------
       LIMPAR FILTRO DE ÁREA
    --------------------------------------------------------- */

    if (areaFilter) {

      /*
        Volta para a opção:
        "Todas as áreas".
      */
      areaFilter.value = "";
    }


    /* ---------------------------------------------------------
       LIMPAR FILTRO DE DATA
    --------------------------------------------------------- */

    if (dateFilter) {

      /*
        Volta para a opção:
        "Todas as datas".
      */
      dateFilter.value = "";
    }


    /* ---------------------------------------------------------
       LIMPAR FILTRO DE SALÁRIO
    --------------------------------------------------------- */

    if (salaryFilter) {

      /*
        Volta para a opção:
        "Todos os salários".
      */
      salaryFilter.value = "";
    }


    /* ---------------------------------------------------------
       LIMPAR CAMPO DE PESQUISA
    --------------------------------------------------------- */

    if (searchInput) {

      /*
        Remove todo o texto digitado.
      */
      searchInput.value = "";
    }


    /* =========================================================
       DISPARAR EVENTOS DOS CAMPOS
    ========================================================= */

    /*
      O campo de pesquisa normalmente utiliza
      o evento "input".
    */
    dispararEvento(searchInput, "input");

    /*
      Os elementos select normalmente utilizam
      o evento "change".
    */
    dispararEvento(stateFilter, "change");
    dispararEvento(areaFilter, "change");
    dispararEvento(dateFilter, "change");
    dispararEvento(salaryFilter, "change");


    /*
      Dispara o evento "change" em todos
      os checkboxes de modalidade.
    */
    modalidadeCheckboxes.forEach((checkbox) => {
      dispararEvento(checkbox, "change");
    });


    /*
      Dispara o evento "change" em todos
      os checkboxes de contrato.
    */
    contratoCheckboxes.forEach((checkbox) => {
      dispararEvento(checkbox, "change");
    });

  });

});