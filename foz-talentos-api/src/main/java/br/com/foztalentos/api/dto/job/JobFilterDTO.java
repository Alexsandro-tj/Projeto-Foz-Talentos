package br.com.foztalentos.api.dto.job;

import br.com.foztalentos.api.enums.ContractType;
import br.com.foztalentos.api.enums.WorkMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// Parâmetros opcionais para consulta filtrada de vagas
public record JobFilterDTO(

        String search,
        List<String> states,
        Long categoryId,
        ContractType contractType,
        WorkMode workMode,
        BigDecimal minSalary,
        BigDecimal maxSalary,
        LocalDate publishedAfter,
        LocalDate publishedBefore

) {}
