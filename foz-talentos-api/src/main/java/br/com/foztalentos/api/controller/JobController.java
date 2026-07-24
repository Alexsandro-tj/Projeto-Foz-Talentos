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

@RestController
@RequestMapping(ApiRoutes.JOBS)
@RequiredArgsConstructor
public class JobController {

        private final JobService jobService;

        @Operation(summary = "Listar vagas")
        @GetMapping
        public ResponseEntity<Page<JobResponseDTO>> findAll(Pageable pageable) {
            Page<JobResponseDTO> jobs = jobService.findAll(pageable);
            return ResponseEntity.ok(jobs);
        }
        @Operation(summary = "Buscar vaga por ID")
        @GetMapping("/{id}")
        public ResponseEntity<JobResponseDTO> findById( @PathVariable Long id) {
            return ResponseEntity.ok(jobService.findById(id));
        }

        @Operation(summary = "Filtrar vagas")
        @GetMapping("/filter")
        public ResponseEntity<Page<JobResponseDTO>> filter(@ModelAttribute JobFilterDTO filter, Pageable pageable) {

            return ResponseEntity.ok(jobService.filter(filter, pageable));

        }

        @Operation(summary = "Criar vaga")
        @PostMapping
        @PreAuthorize("hasAnyRole('MASTER','EMPLOYEE')")
        public ResponseEntity<JobResponseDTO> create(@Valid @RequestBody JobRequestDTO request) {

            JobResponseDTO savedJob = jobService.create(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        }

        @Operation(summary = "Atualizar vaga")
        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('MASTER','EMPLOYEE')")
        public ResponseEntity<JobResponseDTO> update(@PathVariable Long id, @Valid @RequestBody JobRequestDTO request) {

            JobResponseDTO updatedJob = jobService.update(id, request);

            return ResponseEntity.ok(updatedJob);
        }

        @Operation(summary = "Desativar vaga")
        @PatchMapping("/{id}/deactivate")
        @PreAuthorize("hasAnyRole('MASTER','EMPLOYEE')")
        public ResponseEntity<Void> deactivate(@PathVariable Long id) {
            jobService.deactivate(id);
            return ResponseEntity.noContent().build();
        }
}
