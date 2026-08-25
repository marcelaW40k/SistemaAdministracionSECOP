package com.backend.controller;

import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.model.Usuario;
import com.backend.repository.UsuarioRepository;
import com.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Si el usuario/password no son validos, esto lanza una excepcion, que Spring convierte automaticamente en 403.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow();

        String token = jwtService.generateToken(usuario);

        return ResponseEntity.ok(new LoginResponse(token, usuario.getUsername(), usuario.getRol().name()));
    }
}
