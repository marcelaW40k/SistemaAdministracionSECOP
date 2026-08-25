package com.backend.controller;

import com.backend.model.Cc2026;
import com.backend.repository.Cc2026Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cc2026")
@RequiredArgsConstructor
public class Cc2026Controller {
    private final Cc2026Repository cc2026Repository;

    @GetMapping
    public List<Cc2026> listar() {
        return cc2026Repository.findAll();
    }

    @GetMapping("/{radicacion}")
    public ResponseEntity<Cc2026> obtenerPorRadicacion(@PathVariable String radicacion) {
        return cc2026Repository.findById(radicacion)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cc2026> crear(@RequestBody Cc2026 nuevo) {
        if (cc2026Repository.existsById(nuevo.getRadicacion())) {
            return ResponseEntity.status(409).build();
        }
        Cc2026 guardado = cc2026Repository.save(nuevo);
        return ResponseEntity.status(201).body(guardado);
    }

    @PutMapping("/{radicacion}")
    public ResponseEntity<Cc2026> actualizar(
            @PathVariable String radicacion,
            @RequestBody Cc2026 datos
    ) {
        if (!cc2026Repository.existsById(radicacion)) {
            return ResponseEntity.notFound().build();
        }
        datos.setRadicacion(radicacion);
        Cc2026 actualizado = cc2026Repository.save(datos);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{radicacion}")
    public ResponseEntity<Void> eliminar(@PathVariable String radicacion) {
        if (!cc2026Repository.existsById(radicacion)) {
            return ResponseEntity.notFound().build();
        }
        cc2026Repository.deleteById(radicacion);
        return ResponseEntity.noContent().build();
    }
}
