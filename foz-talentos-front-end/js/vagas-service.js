import api from "./api.js";

"use strict";

const WHATSAPP_OFICIAL = "5561981357318";
let vagasCache = [];

function transformarLista(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) return valor.filter(Boolean).map(String);

  return String(valor)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapearExperiencia(level) {
  const niveis = {
    YOUNG_APPRENTICE: "Jovem Aprendiz",
    INTERNSHIP: "Estágio",
    TRAINEE: "Trainee",
    JUNIOR: "Júnior",
    MID_LEVEL: "Pleno",
    SENIOR: "Sênior",
    SPECIALIST: "Especialista",
    COORDINATOR: "Coordenador",
    MANAGER: "Gerente",
    DIRECTOR: "Diretor"
  };
  return niveis[level] ?? level ?? "";
}

function mapearModalidade(workMode) {
  const modalidades = {
    ONSITE: "Presencial",
    HYBRID: "Híbrido",
    REMOTE: "Remoto"
  };
  return modalidades[workMode] ?? workMode ?? "";
}

function mapearVaga(vaga) {
  const active = Boolean(vaga?.active);

  return {
    id: String(vaga?.id ?? ""),
    titulo: vaga?.title ?? "",
    empresa: vaga?.company ?? "",
    cidade: vaga?.city ?? "",
    estado: vaga?.state ?? "",
    localizacao: vaga?.city ? `${vaga.city} - ${vaga.state ?? ""}`.trim() : (vaga?.state ?? ""),
    area: vaga?.category ?? "",
    categoria: vaga?.category ?? "",
    experiencia: mapearExperiencia(vaga?.level),
    contrato: vaga?.contractType ?? "",
    modalidade: mapearModalidade(vaga?.workMode),
    salario: vaga?.salary ?? "",
    salarioValor: Number(vaga?.salaryValue ?? 0),
    ativa: active,
    status: active ? "ativa" : "inativa",
    descricao: vaga?.description ?? "",
    requisitos: transformarLista(vaga?.requirements),
    beneficios: transformarLista(vaga?.benefits),
    telefone: vaga?.phone ?? "",
    whatsapp: vaga?.phone ?? WHATSAPP_OFICIAL,
    email: vaga?.email ?? "",
    criadoEm: vaga?.createdAt ?? "",
    atualizadoEm: vaga?.updatedAt ?? ""
  };
}

function headersAutenticacao() {
  const token =
    sessionStorage.getItem("fozAdminToken") ||
    localStorage.getItem("fozAdminToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function converterDadosParaApi(dados) {
  const modalidade = {
    Presencial: "ONSITE",
    Híbrido: "HYBRID",
    Remoto: "REMOTE"
  };

  const nivel = {
    "Jovem Aprendiz": "YOUNG_APPRENTICE",
    "Estágio": "INTERNSHIP",
    "Trainee": "TRAINEE",
    "Júnior": "JUNIOR",
    "Pleno": "MID_LEVEL",
    "Sênior": "SENIOR",
    "Especialista": "SPECIALIST"
  };

  return {
    title: dados.titulo,
    company: dados.empresa,
    state: dados.estado,
    contractType: dados.contrato,
    level: nivel[dados.experiencia] || dados.experiencia,
    workMode: modalidade[dados.modalidade] || dados.modalidade,
    salary: dados.salario,
    active: dados.status === "ativa",
    description: dados.descricao,
    requirements: Array.isArray(dados.requisitos) ? dados.requisitos.join("\n") : dados.requisitos,
    benefits: Array.isArray(dados.beneficios) ? dados.beneficios.join("\n") : dados.beneficios,
    phone: dados.whatsapp,
    email: dados.email,
    category: dados.area
  };
}

class VagasService {
  async carregarVagas() {
    try {
      const response = await api.get("/jobs");
      const content = response.data?.content ?? [];
      vagasCache = content.map(mapearVaga);
      return vagasCache;
    } catch (error) {
      console.error("Erro ao buscar vagas na API:", error);
      throw error;
    }
  }

  listar() {
    return vagasCache;
  }

  buscarPorId(id) {
    return vagasCache.find((vaga) => String(vaga.id) === String(id));
  }

  async criar(dados) {
    await api.post("/jobs", converterDadosParaApi(dados), {
      headers: headersAutenticacao()
    });
    await this.carregarVagas();
  }

  async atualizar(id, dados) {
    await api.put(`/jobs/${id}`, converterDadosParaApi(dados), {
      headers: headersAutenticacao()
    });
    await this.carregarVagas();
  }

  async excluir(id) {
    await api.delete(`/jobs/${id}`, {
      headers: headersAutenticacao()
    });
    await this.carregarVagas();
  }
}

export default new VagasService();
