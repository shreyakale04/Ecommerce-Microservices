package com.ecommerce.order.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collections;

public class JwtAuthConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        String role = jwt.getClaimAsString("role");

        System.out.println("JWT ROLE = " + role);
        System.out.println("JWT EMAIL = " + jwt.getSubject());

        if (role == null) {
            throw new RuntimeException("Role not found in JWT");
        }

        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(role);

        System.out.println(
                "AUTHORITY = " + authority.getAuthority()
        );

        return new JwtAuthenticationToken(
                jwt,
                Collections.singletonList(authority)
        );
    }
}