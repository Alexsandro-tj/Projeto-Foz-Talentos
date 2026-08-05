(function () {
  "use strict";

  const STORAGE_KEY = "fozTalentosVagas";

  const vagasIniciais = [
    {
      id: "FT-A1B2C3",
      titulo: "Assistente Administrativo",
      empresa: "Foz Talentos",
      cidade: "Foz do Iguaçu",
      estado: "PR",
      localizacao: "Foz do Iguaçu - PR",
      area: "Administrativo",
      experiencia: "Júnior",
      contrato: "CLT",
      modalidade: "Presencial",
      salario: "A combinar",
      descricao: "Apoio às rotinas administrativas, atendimento e organização de documentos.",
      requisitos: [
        "Ensino médio completo",
        "Conhecimento básico em informática",
        "Boa comunicação"
      ],
      beneficios: ["Vale-transporte", "Vale-alimentação"],
      whatsapp: "5561981357318",
      email: "vagas@foztalentos.com.br",
      status: "ativa",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    },
    {
      id: "FT-D4E5F6",
      titulo: "Analista de Recursos Humanos",
      empresa: "Empresa Parceira",
      cidade: "Foz do Iguaçu",
      estado: "PR",
      localizacao: "Foz do Iguaçu - PR",
      area: "Recursos Humanos",
      experiencia: "Pleno",
      contrato: "CLT",
      modalidade: "Híbrido",
      salario: "R$ 3.500,00",
      descricao: "Atuação em recrutamento e seleção, integração e apoio aos processos de desenvolvimento humano.",
      requisitos: [
        "Graduação em RH, Psicologia ou áreas afins",
        "Experiência com recrutamento e seleção"
      ],
      beneficios: [
        "Plano de saúde",
        "Vale-refeição",
        "Auxílio educação"
      ],
      whatsapp: "5561981357318",
      email: "vagas@foztalentos.com.br",
      status: "ativa",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
  ];

  const WHATSAPP_OFICIAL = "5561981357318";

  function corrigirWhatsAppDaVaga(vaga) {
    const numero =
      String(vaga?.whatsapp || "").replace(/\D/g, "");

    const numeroDeTeste =
      numero === "5545999999999";

    const numeroInvalido =
      numero.length < 12 || numero.length > 13;

    if (numeroDeTeste || numeroInvalido) {
      return {
        ...vaga,
        whatsapp: WHATSAPP_OFICIAL
      };
    }

    return vaga;
  }

  function migrarCodigosAntigos(vagas) {
    const codigosUsados = new Set();

    return vagas.map((vaga) => {
      const idAtual =
        String(vaga.id || "").toUpperCase();

      const formatoValido =
        /^FT-[A-HJ-NP-Z2-9]{6}$/.test(idAtual);

      if (
        formatoValido &&
        !codigosUsados.has(idAtual)
      ) {
        codigosUsados.add(idAtual);

        return {
          ...vaga,
          id: idAtual
        };
      }

      const novoCodigo =
        gerarCodigo(
          Array.from(codigosUsados).map((id) => ({ id }))
        );

      codigosUsados.add(novoCodigo);

      return {
        ...vaga,
        id: novoCodigo
      };
    });
  }

  function ler() {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);

      if (!salvo) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(vagasIniciais)
        );
        return [...vagasIniciais];
      }

      const dados = JSON.parse(salvo);

      if (!Array.isArray(dados)) {
        return [];
      }

      const vagasCorrigidas =
        migrarCodigosAntigos(
          dados.map(corrigirWhatsAppDaVaga)
        );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(vagasCorrigidas)
      );

      return vagasCorrigidas;
    } catch (erro) {
      console.error("Erro ao ler vagas:", erro);
      return [];
    }
  }

  function salvar(vagas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vagas));
  }

  function gerarCodigo(vagasExistentes = []) {
    const caracteres =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const codigosExistentes =
      new Set(
        vagasExistentes
          .map((vaga) => String(vaga.id || "").toUpperCase())
      );

    let codigo = "";

    do {
      codigo = "FT-";

      for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
    } while (codigosExistentes.has(codigo));

    return codigo;
  }


  const CAMPOS_OBRIGATORIOS = [
    "titulo",
    "empresa",
    "cidade",
    "estado",
    "localizacao",
    "area",
    "contrato",
    "modalidade",
    "experiencia",
    "salario",
    "status",
    "descricao"
  ];

  function validarDadosDaVaga(dados) {
    const camposAusentes =
      CAMPOS_OBRIGATORIOS.filter(
        (campo) =>
          !String(dados?.[campo] ?? "").trim()
      );

    if (
      !Array.isArray(dados?.requisitos) ||
      dados.requisitos.length === 0
    ) {
      camposAusentes.push("requisitos");
    }

    if (camposAusentes.length > 0) {
      throw new Error(
        `Campos obrigatórios ausentes: ${camposAusentes.join(", ")}.`
      );
    }
  }

  window.VagasService = {
    listar() {
      return ler().sort(
        (a, b) =>
          new Date(b.atualizadoEm) -
          new Date(a.atualizadoEm)
      );
    },

    buscarPorId(id) {
      return ler().find((vaga) => vaga.id === id) || null;
    },

    criar(dados) {
      validarDadosDaVaga(dados);

      const agora = new Date().toISOString();

      const vagas = ler();

      const novaVaga = {
        ...dados,
        id: gerarCodigo(vagas),
        criadoEm: agora,
        atualizadoEm: agora
      };

      vagas.push(novaVaga);
      salvar(vagas);

      return novaVaga;
    },

    atualizar(id, dados) {
      validarDadosDaVaga(dados);

      const vagas = ler();
      const indice = vagas.findIndex((vaga) => vaga.id === id);

      if (indice < 0) {
        throw new Error("Vaga não encontrada.");
      }

      vagas[indice] = {
        ...vagas[indice],
        ...dados,
        id,
        atualizadoEm: new Date().toISOString()
      };

      salvar(vagas);
      return vagas[indice];
    },

    excluir(id) {
      const vagas = ler();
      const novasVagas = vagas.filter((vaga) => vaga.id !== id);

      if (novasVagas.length === vagas.length) {
        return false;
      }

      salvar(novasVagas);
      return true;
    }
  };
})();
