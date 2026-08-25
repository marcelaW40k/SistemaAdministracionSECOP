package com.backend.controller;

import com.backend.model.Secop;
import com.backend.repository.SecopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secop")
@RequiredArgsConstructor
public class SecopController {

    private final SecopRepository secopRepository;

    @GetMapping
    public List<Secop> listar() {
        return secopRepository.findAll();
    }

    @GetMapping("/{referencia}")
    public ResponseEntity<Secop> obtenerPorReferencia(@PathVariable String referencia) {
        return secopRepository.findById(referencia)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Secop> crear(@RequestBody Secop nuevo) {
        if (secopRepository.existsById(nuevo.getReferencia())) {
            return ResponseEntity.status(409).build(); // Conflict: la referencia ya existe
        }
        Secop guardado = secopRepository.save(nuevo);
        return ResponseEntity.status(201).body(guardado);
    }

    @PutMapping("/{referencia}")
    public ResponseEntity<Secop> actualizar(
            @PathVariable String referencia,
            @RequestBody Secop datos
    ) {
        if (!secopRepository.existsById(referencia)) {
            return ResponseEntity.notFound().build();
        }
        datos.setReferencia(referencia); // aseguramos que no cambien la llave por error
        Secop actualizado = secopRepository.save(datos);
        return ResponseEntity.ok(actualizado);
    }
    @DeleteMapping("/{referencia}")
    public ResponseEntity<Void> eliminar(@PathVariable String referencia) {
        if (!secopRepository.existsById(referencia)) {
            return ResponseEntity.notFound().build();
        }
        secopRepository.deleteById(referencia);
        return ResponseEntity.noContent().build();
    }
}
