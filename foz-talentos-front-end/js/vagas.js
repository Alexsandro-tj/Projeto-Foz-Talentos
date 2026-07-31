"use strict";

/*
  Aguarda o carregamento completo do HTML.
*/
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTOS DA PÁGINA
  ========================================================= */

  const publicJobsList =
    document.getElementById("publicJobsList");

  const publicEmptyState =
    document.getElementById("publicEmptyState");

  const jobsResultCount =
    document.getElementById("jobsResultCount");

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


  /* =========================================================
     VERIFICAÇÕES INICIAIS
  ========================================================= */

  /*
    Caso o local onde os cards devem aparecer
    não exista, o arquivo é encerrado.
  */
  if (!publicJobsList) {
    console.error(
      'Elemento com id "publicJobsList" não encontrado.'
    );

    return;
  }

  /*
    Verifica se o serviço de vagas foi carregado.
  */
  if (!window.VagasService) {
    console.error(
      "VagasService não foi carregado. Verifique vagas-service.js."
    );

    return;
  }


  /* =========================================================
     ESTADO DO FILTRO SALARIAL
  ========================================================= */

  /*
    Guarda os valores atuais do filtro salarial.

    Eles também são atualizados pelo evento personalizado
    criado no filtros-vagas.js.
  */
  let salarioMinimoSelecionado =
    Number(salaryMinFilter?.value ?? 0);

  let salarioMaximoSelecionado =
    Number(salaryMaxFilter?.value ?? 20000);


  /* =========================================================
     PROTEÇÃO DE CONTEÚDO HTML
  ========================================================= */

  /*
    Impede que textos cadastrados sejam interpretados
    como código HTML.
  */
  function escapeHtml(valor = "") {

    return String(valor).replace(
      /[&<>'"]/g,
      (caractere) => {

        const entidades = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#039;",
          '"': "&quot;"
        };

        return entidades[caractere];
      }
    );
  }


  /* =========================================================
     NORMALIZAÇÃO DE TEXTO
  ========================================================= */

  /*
    Remove acentos, transforma o texto em minúsculas
    e elimina espaços extras.

    Isso permite comparar, por exemplo:

    "Híbrido" com "hibrido"
    "Júnior" com "junior"
  */
  function normalizarTexto(valor = "") {

    return String(valor)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }


  /* =========================================================
     FORMATAR DATA
  ========================================================= */

  function formatarData(data) {

    if (!data) {
      return "";
    }

    const dataConvertida =
      new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("pt-BR").format(
      dataConvertida
    );
  }


  /* =========================================================
     CONVERTER SALÁRIO EM NÚMERO
  ========================================================= */

  /*
    Converte textos como:

    "R$ 3.500,00" para 3500
    "2500" para 2500
    "A combinar" para null
  */
  function obterSalarioNumerico(salario) {

    if (
      salario === null ||
      salario === undefined ||
      salario === ""
    ) {
      return null;
    }

    if (typeof salario === "number") {
      return Number.isFinite(salario)
        ? salario
        : null;
    }

    const texto =
      normalizarTexto(salario);

    /*
      Salários não informados não serão eliminados
      pelo filtro salarial.
    */
    if (
      texto.includes("combinar") ||
      texto.includes("negociar") ||
      texto.includes("pretensao")
    ) {
      return null;
    }

    /*
      Remove R$, espaços e outros caracteres.
    */
    let valorLimpo =
      String(salario)
        .replace(/[^\d.,-]/g, "");

    if (!valorLimpo) {
      return null;
    }

    /*
      Formato brasileiro:
      3.500,00
    */
    if (
      valorLimpo.includes(".") &&
      valorLimpo.includes(",")
    ) {
      valorLimpo =
        valorLimpo
          .replace(/\./g, "")
          .replace(",", ".");
    }

    /*
      Formato:
      3500,00
    */
    else if (valorLimpo.includes(",")) {
      valorLimpo =
        valorLimpo.replace(",", ".");
    }

    /*
      Quando existe apenas ponto, verifica se ele
      provavelmente representa milhar.

      Exemplo:
      3.500 vira 3500.
    */
    else if (
      /^\d{1,3}(\.\d{3})+$/.test(valorLimpo)
    ) {
      valorLimpo =
        valorLimpo.replace(/\./g, "");
    }

    const numero =
      Number(valorLimpo);

    return Number.isFinite(numero)
      ? numero
      : null;
  }


  /* =========================================================
     OBTER ESTADO DA LOCALIZAÇÃO
  ========================================================= */

  /*
    Procura uma sigla estadual no final da localização.

    Exemplo:
    "Foz do Iguaçu - PR" retorna "PR".
  */
  function obterEstadoDaVaga(vaga) {

    /*
      Também aceita propriedades específicas,
      caso sejam adicionadas futuramente.
    */
    if (vaga.estado) {
      return String(vaga.estado).toUpperCase();
    }

    const localizacao =
      String(vaga.localizacao || "");

    const resultado =
      localizacao.match(
        /(?:-|\/|,)\s*([A-Za-z]{2})\s*$/
      );

    return resultado
      ? resultado[1].toUpperCase()
      : "";
  }


  /* =========================================================
     OBTER ÁREA DA VAGA
  ========================================================= */

  /*
    Aceita diferentes nomes de propriedade,
    para evitar problemas entre versões do projeto.
  */
  function obterAreaDaVaga(vaga) {

    return (
      vaga.area ||
      vaga.categoria ||
      vaga.areaAtuacao ||
      vaga.setor ||
      ""
    );
  }


  /* =========================================================
     VALORES SELECIONADOS NOS CHECKBOXES
  ========================================================= */

  function obterValoresMarcados(checkboxes) {

    return Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) =>
        normalizarTexto(checkbox.value)
      );
  }


  /* =========================================================
     FILTRO DE CONTRATO
  ========================================================= */

  /*
    Permite que o filtro "Efetivo" encontre
    vagas cadastradas como "CLT".

    Isso resolve a diferença entre o formulário
    administrativo e o filtro público.
  */
  function contratoCorresponde(
    contratoDaVaga,
    contratosSelecionados
  ) {

    if (contratosSelecionados.length === 0) {
      return true;
    }

    const contratoNormalizado =
      normalizarTexto(contratoDaVaga);

    return contratosSelecionados.some(
      (contratoSelecionado) => {

        /*
          Efetivo equivale a CLT.
        */
        if (contratoSelecionado === "efetivo") {
          return (
            contratoNormalizado === "efetivo" ||
            contratoNormalizado === "clt"
          );
        }

        return (
          contratoNormalizado ===
          contratoSelecionado
        );
      }
    );
  }


  /* =========================================================
     FILTRO DE DATA
  ========================================================= */

  function vagaCorrespondeAData(
    vaga,
    valorSelecionado
  ) {

    if (!valorSelecionado) {
      return true;
    }

    const dataDaVaga =
      new Date(
        vaga.criadoEm ||
        vaga.atualizadoEm
      );

    if (Number.isNaN(dataDaVaga.getTime())) {
      return true;
    }

    const agora =
      new Date();

    const diferencaEmMilissegundos =
      agora.getTime() - dataDaVaga.getTime();

    const diferencaEmDias =
      diferencaEmMilissegundos /
      (1000 * 60 * 60 * 24);

    const valor =
      normalizarTexto(valorSelecionado);

    /*
      Aceita diferentes valores possíveis
      definidos no HTML.
    */
    if (
      valor === "hoje" ||
      valor === "today" ||
      valor === "1"
    ) {
      return diferencaEmDias <= 1;
    }

    if (
      valor === "3" ||
      valor === "3dias" ||
      valor === "ultimos-3-dias"
    ) {
      return diferencaEmDias <= 3;
    }

    if (
      valor === "7" ||
      valor === "7dias" ||
      valor === "ultima-semana" ||
      valor === "ultimos-7-dias"
    ) {
      return diferencaEmDias <= 7;
    }

    if (
      valor === "15" ||
      valor === "15dias" ||
      valor === "ultimos-15-dias"
    ) {
      return diferencaEmDias <= 15;
    }

    if (
      valor === "30" ||
      valor === "30dias" ||
      valor === "ultimo-mes" ||
      valor === "ultimos-30-dias"
    ) {
      return diferencaEmDias <= 30;
    }

    /*
      Caso o valor do HTML seja apenas um número,
      ele será tratado como quantidade de dias.
    */
    const quantidadeDeDias =
      Number(valor);

    if (Number.isFinite(quantidadeDeDias)) {
      return diferencaEmDias <= quantidadeDeDias;
    }

    return true;
  }


  /* =========================================================
     FILTRO SALARIAL
  ========================================================= */

  function vagaCorrespondeAoSalario(vaga) {

    const salarioDaVaga =
      obterSalarioNumerico(vaga.salario);

    /*
      Vagas com "A combinar" permanecem visíveis,
      pois não existe um valor conhecido para comparar.
    */
    if (salarioDaVaga === null) {
      return true;
    }

    return (
      salarioDaVaga >= salarioMinimoSelecionado &&
      salarioDaVaga <= salarioMaximoSelecionado
    );
  }


  /* =========================================================
     CRIAR LINK DE CANDIDATURA
  ========================================================= */

  function criarCandidatura(vaga) {

    const titulo =
      vaga.titulo || "vaga";

    const identificador =
      vaga.id || "";

    const mensagem =
      encodeURIComponent(
        `Olá! Tenho interesse na vaga ${titulo}` +
        `${identificador ? ` (${identificador})` : ""}.`
      );

    const whatsapp =
      String(vaga.whatsapp || "")
        .replace(/\D/g, "");

    if (whatsapp) {
      return {
        url:
          `https://wa.me/${whatsapp}?text=${mensagem}`,

        texto:
          "Candidatar-se pelo WhatsApp"
      };
    }

    const email =
      String(vaga.email || "").trim();

    if (email) {
      const assunto =
        encodeURIComponent(
          `Candidatura — ${titulo}`
        );

      return {
        url:
          `mailto:${email}?subject=${assunto}&body=${mensagem}`,

        texto:
          "Candidatar-se por e-mail"
      };
    }

    return null;
  }


  /* =========================================================
     CRIAR LISTA DE ITENS
  ========================================================= */

  function criarLista(itens) {

    if (
      !Array.isArray(itens) ||
      itens.length === 0
    ) {
      return "";
    }

    return itens
      .map(
        (item) =>
          `<li>${escapeHtml(item)}</li>`
      )
      .join("");
  }


  /* =========================================================
     CRIAR CARD DA VAGA
  ========================================================= */

  function criarCardDaVaga(vaga) {

    const candidatura =
      criarCandidatura(vaga);

    const requisitos =
      criarLista(vaga.requisitos);

    const beneficios =
      criarLista(vaga.beneficios);

    const data =
      formatarData(
        vaga.atualizadoEm ||
        vaga.criadoEm
      );

    const experiencia =
      vaga.experiencia
        ? `
          <span class="job-tag">
            ${escapeHtml(vaga.experiencia)}
          </span>
        `
        : "";

    const area =
      obterAreaDaVaga(vaga);

    const areaTag =
      area
        ? `
          <span class="job-tag">
            ${escapeHtml(area)}
          </span>
        `
        : "";

    const botaoCandidatura =
      candidatura
        ? `
          <a
            class="button button-primary public-job-apply"
            href="${escapeHtml(candidatura.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${escapeHtml(candidatura.texto)}
          </a>
        `
        : `
          <span class="public-job-no-contact">
            Contato para candidatura indisponível
          </span>
        `;

    return `
      <article
        class="public-job-card job-card"
        data-job-id="${escapeHtml(vaga.id || "")}"
      >
        <div class="public-job-header">

          <div class="public-job-heading">

            <span class="public-job-company">
              ${escapeHtml(vaga.empresa || "")}
            </span>

            <h2>
              ${escapeHtml(vaga.titulo || "")}
            </h2>

            <p class="public-job-location">
              ${escapeHtml(vaga.localizacao || "")}
            </p>

          </div>

          ${
            data
              ? `
                <span class="public-job-date">
                  Atualizada em ${escapeHtml(data)}
                </span>
              `
              : ""
          }

        </div>

        <div class="public-job-tags">

          ${
            vaga.contrato
              ? `
                <span class="job-tag">
                  ${escapeHtml(vaga.contrato)}
                </span>
              `
              : ""
          }

          ${
            vaga.modalidade
              ? `
                <span class="job-tag">
                  ${escapeHtml(vaga.modalidade)}
                </span>
              `
              : ""
          }

          ${experiencia}

          ${areaTag}

          ${
            vaga.salario
              ? `
                <span class="job-tag job-salary">
                  ${escapeHtml(vaga.salario)}
                </span>
              `
              : ""
          }

        </div>

        ${
          vaga.descricao
            ? `
              <p class="public-job-description">
                ${escapeHtml(vaga.descricao)}
              </p>
            `
            : ""
        }

        ${
          requisitos
            ? `
              <div class="public-job-section">
                <h3>Requisitos</h3>

                <ul>
                  ${requisitos}
                </ul>
              </div>
            `
            : ""
        }

        ${
          beneficios
            ? `
              <div class="public-job-section">
                <h3>Benefícios</h3>

                <ul>
                  ${beneficios}
                </ul>
              </div>
            `
            : ""
        }

        <div class="public-job-footer">

          ${botaoCandidatura}

        </div>
      </article>
    `;
  }


  /* =========================================================
     ATUALIZAR CONTADOR E ESTADO VAZIO
  ========================================================= */

  function atualizarEstadoDaLista(
    quantidade,
    existemVagasAtivas
  ) {

    if (jobsResultCount) {
      jobsResultCount.textContent =
        quantidade === 1
          ? "1 vaga encontrada"
          : `${quantidade} vagas encontradas`;
    }

    if (!publicEmptyState) {
      return;
    }

    const tituloVazio =
      publicEmptyState.querySelector("h2");

    const textoVazio =
      publicEmptyState.querySelector("p");

    if (quantidade > 0) {
      publicJobsList.hidden = false;
      publicEmptyState.hidden = true;
      return;
    }

    publicJobsList.hidden = true;
    publicEmptyState.hidden = false;

    if (!existemVagasAtivas) {

      if (tituloVazio) {
        tituloVazio.textContent =
          "Nenhuma vaga disponível";
      }

      if (textoVazio) {
        textoVazio.textContent =
          "No momento, não há vagas publicadas.";
      }

      return;
    }

    if (tituloVazio) {
      tituloVazio.textContent =
        "Nenhuma vaga encontrada";
    }

    if (textoVazio) {
      textoVazio.textContent =
        "Tente alterar ou limpar os filtros selecionados.";
    }
  }


  /* =========================================================
     APLICAR FILTROS
  ========================================================= */

  function aplicarFiltros() {

    /*
      Apenas vagas ativas aparecem
      na página pública.
    */
    const vagasAtivas =
      VagasService
        .listar()
        .filter(
          (vaga) =>
            normalizarTexto(vaga.status) === "ativa"
        );

    const termoPesquisado =
      normalizarTexto(searchInput?.value);

    const estadoSelecionado =
      String(stateFilter?.value || "")
        .trim()
        .toUpperCase();

    const areaSelecionada =
      normalizarTexto(areaFilter?.value);

    const modalidadesSelecionadas =
      obterValoresMarcados(
        modalidadeCheckboxes
      );

    const contratosSelecionados =
      obterValoresMarcados(
        contratoCheckboxes
      );

    const experienciasSelecionadas =
      obterValoresMarcados(
        experienciaCheckboxes
      );

    const dataSelecionada =
      Array.from(dateRadioButtons)
        .find(
          (radioButton) =>
            radioButton.checked
        )
        ?.value || "";

    const vagasFiltradas =
      vagasAtivas.filter((vaga) => {

        const textoDaVaga =
          normalizarTexto(
            [
              vaga.titulo,
              vaga.empresa,
              vaga.localizacao,
              vaga.contrato,
              vaga.modalidade,
              vaga.experiencia,
              obterAreaDaVaga(vaga),
              vaga.descricao,
              ...(vaga.requisitos || []),
              ...(vaga.beneficios || [])
            ].join(" ")
          );

        const correspondeAPesquisa =
          !termoPesquisado ||
          textoDaVaga.includes(
            termoPesquisado
          );

        const estadoDaVaga =
          obterEstadoDaVaga(vaga);

        const correspondeAoEstado =
          !estadoSelecionado ||
          estadoDaVaga === estadoSelecionado;

        const areaDaVaga =
          normalizarTexto(
            obterAreaDaVaga(vaga)
          );

        const correspondeAArea =
          !areaSelecionada ||
          areaDaVaga === areaSelecionada;

        const modalidadeDaVaga =
          normalizarTexto(
            vaga.modalidade
          );

        const correspondeAModalidade =
          modalidadesSelecionadas.length === 0 ||
          modalidadesSelecionadas.includes(
            modalidadeDaVaga
          );

        const correspondeAoContrato =
          contratoCorresponde(
            vaga.contrato,
            contratosSelecionados
          );

        const experienciaDaVaga =
          normalizarTexto(
            vaga.experiencia
          );

        const correspondeAExperiencia =
          experienciasSelecionadas.length === 0 ||
          experienciasSelecionadas.includes(
            experienciaDaVaga
          );

        const correspondeAData =
          vagaCorrespondeAData(
            vaga,
            dataSelecionada
          );

        const correspondeAoSalario =
          vagaCorrespondeAoSalario(vaga);

        return (
          correspondeAPesquisa &&
          correspondeAoEstado &&
          correspondeAArea &&
          correspondeAModalidade &&
          correspondeAoContrato &&
          correspondeAExperiencia &&
          correspondeAData &&
          correspondeAoSalario
        );
      });

    publicJobsList.innerHTML =
      vagasFiltradas
        .map(criarCardDaVaga)
        .join("");

    atualizarEstadoDaLista(
      vagasFiltradas.length,
      vagasAtivas.length > 0
    );
  }


  /* =========================================================
     EVENTOS DOS FILTROS
  ========================================================= */

  searchInput?.addEventListener(
    "input",
    aplicarFiltros
  );

  stateFilter?.addEventListener(
    "change",
    aplicarFiltros
  );

  areaFilter?.addEventListener(
    "change",
    aplicarFiltros
  );

  modalidadeCheckboxes.forEach(
    (checkbox) => {

      checkbox.addEventListener(
        "change",
        aplicarFiltros
      );
    }
  );

  contratoCheckboxes.forEach(
    (checkbox) => {

      checkbox.addEventListener(
        "change",
        aplicarFiltros
      );
    }
  );

  experienciaCheckboxes.forEach(
    (checkbox) => {

      checkbox.addEventListener(
        "change",
        aplicarFiltros
      );
    }
  );

  dateRadioButtons.forEach(
    (radioButton) => {

      radioButton.addEventListener(
        "change",
        aplicarFiltros
      );
    }
  );


  /* =========================================================
     EVENTO PERSONALIZADO DO FILTRO SALARIAL
  ========================================================= */

  document.addEventListener(
    "salaryFilterChange",
    (event) => {

      salarioMinimoSelecionado =
        Number(
          event.detail?.minimum ??
          salaryMinFilter?.value ??
          0
        );

      salarioMaximoSelecionado =
        Number(
          event.detail?.maximum ??
          salaryMaxFilter?.value ??
          20000
        );

      aplicarFiltros();
    }
  );


  /* =========================================================
     PRIMEIRA RENDERIZAÇÃO
  ========================================================= */

  aplicarFiltros();

});