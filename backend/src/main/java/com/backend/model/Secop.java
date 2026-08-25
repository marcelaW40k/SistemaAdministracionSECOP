package com.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "secop")
@Getter
@Setter
@NoArgsConstructor
public class Secop {
    @Id
    @Column(name = "referencia", length = 150)
    private String referencia;

    @Column(name = "pais", columnDefinition = "TEXT")
    private String pais;

    @Column(name = "entidad_estatal", columnDefinition = "TEXT")
    private String entidadEstatal;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fase_actual", columnDefinition = "TEXT")
    private String faseActual;

    @Column(name = "fecha_publicacion", columnDefinition = "TEXT")
    private String fechaPublicacion;

    @Column(name = "fecha_presentacion_ofertas", columnDefinition = "TEXT")
    private String fechaPresentacionOfertas;

    @Column(name = "url_detalle", columnDefinition = "TEXT")
    private String urlDetalle;
}
