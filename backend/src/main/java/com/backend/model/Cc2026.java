package com.backend.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "cc2026")
@Getter
@Setter
@NoArgsConstructor
public class Cc2026 {
    @Id
    @Column(name = "radicacion", length = 150)
    private String radicacion;

    @Column(name = "numero")
    private Integer numero;

    @Column(name = "url_proceso", columnDefinition = "TEXT")
    private String urlProceso;

    @Column(name = "url_proceso2", columnDefinition = "TEXT")
    private String urlProceso2;

    @Column(name = "url_proceso3", columnDefinition = "TEXT")
    private String urlProceso3;

    @Column(name = "ponente", columnDefinition = "TEXT")
    private String ponente;

    @Column(name = "norma_demandada", columnDefinition = "TEXT")
    private String normaDemandada;

    @Column(name = "demandante", columnDefinition = "TEXT")
    private String demandante;

    @Column(name = "fecha", columnDefinition = "TEXT")
    private String fecha;

    @Column(name = "url_demanda", columnDefinition = "TEXT")
    private String urlDemanda;
}
