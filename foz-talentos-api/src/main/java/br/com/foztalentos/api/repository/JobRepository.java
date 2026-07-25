package br.com.foztalentos.api.repository;

import br.com.foztalentos.api.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

// Repositório de dados para a entidade Job (com suporte a consultas com Specification)
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

}
