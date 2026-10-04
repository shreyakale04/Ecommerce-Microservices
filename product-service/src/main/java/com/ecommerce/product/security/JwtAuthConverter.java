package com.ecommerce.product.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collections;

public class JwtAuthConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        String role = jwt.getClaimAsString("role");

        if (role == null) {
            throw new RuntimeException("Role not found in JWT");
        }

        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(role);

        return new org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken(
                jwt,
                Collections.singletonList(authority)
        );
    }
}