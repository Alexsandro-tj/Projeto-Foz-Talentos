package br.com.foztalentos.api.controller;

import br.com.foztalentos.api.constant.ApiRoutes;
import br.com.foztalentos.api.dto.job.JobFilterDTO;
import br.com.foztalentos.api.dto.job.JobRequestDTO;
import br.com.foztalentos.api.dto.job.JobResponseDTO;
import br.com.foztalentos.api.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

// Controller para listagem e gestão de vagas de emprego
@RestController
@RequestMapping(ApiRoutes.JOBS)
@RequiredArgsConstructor
public class JobController {

        private final JobService jobService;

        // Listagem paginada geral (pública)
        @Operation(summary = "Listar vagas", description = """
                Lista todas as vagas cadastradas.
                
                Suporta paginação e ordenação.
                
                Exemplo:
                GET /jobs?page=0&size=10&sort=createdAt,desc"""
        )
        @GetMapping
        public ResponseEntity<Page<JobResponseDTO>> findAll(Pageable pageable) {
            Page<JobResponseDTO> jobs = jobService.findAll(pageable);
            return ResponseEntity.ok(jobs);
        }

        // Consulta de vaga por ID (pública)
        @Operation(summary = "Buscar vaga por ID")
        @GetMapping("/{id}")
        public ResponseEntity<JobResponseDTO> findById( @PathVariable Long id) {
            return ResponseEntity.ok(jobService.findById(id));
        }

        // Busca customizada por múltiplos filtros de pesquisa (pública)
        @Operation(summary = "Filtrar vagas", description = """
            Filtros disponíveis:
            • search, states, categoryId, contractType, workMode, publishedAfter, publishedBefore
    
            Exemplo:
            /jobs/filter?states=RJ&categoryId=1&workMode=REMOTE&publishedAfter=2026-07-01&sort=createdAt,desc"""
        )
            @GetMapping("/filter")
            public ResponseEntity<Page<JobResponseDTO>> filter(@ModelAttribute JobFilterDTO filter, Pageable pageable) {

                return ResponseEntity.ok(jobService.filter(filter, pageable));

            }

        // Cadastro de nova vaga (restrito a admins)
        @Operation(summary = "Cadastrar vaga")
        @PostMapping
        @PreAuthorize("hasAnyRole('MASTER','EMPLOYEE')")
        public ResponseEntity<JobResponseDTO> create(@Valid @RequestBody JobRequestDTO request) {

            JobResponseDTO savedJob = jobService.create(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        }

        // Alteração dos dados da vaga (restrito a admins)
        @Operation(summary = "Atualizar vaga")
        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('MASTER','EMPLOYEE')")
        public ResponseEntity<JobResponseDTO> update(@PathVariable Long id, @Valid @RequestBody JobRequestDTO request) {

            JobResponseDTO updatedJob = jobService.update(id, request);

            return ResponseEntity.ok(updatedJob);
        }

        // Inativação/encerramento da vaga (restrito a admins)
        @Operation(summary = "Desativar vaga")
        @PatchMapping("/{id}/deactivate")
        @PreAuthorize("hasAnyRole('MASTER','EMPLOYEE')")
        public ResponseEntity<Void> deactivate(@PathVariable Long id) {
            jobService.deactivate(id);
            return ResponseEntity.noContent().build();
        }
}
