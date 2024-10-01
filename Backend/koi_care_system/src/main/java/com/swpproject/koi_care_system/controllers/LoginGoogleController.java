package com.swpproject.koi_care_system.controllers;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginGoogleController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/profile")
    public String profile(OAuth2AuthenticationToken token, Model model) {
        model.addAttribute("name", token.getPrincipal().getAttributes().get("name"));
        model.addAttribute("email", token.getPrincipal().getAttributes().get("email"));
        model.addAttribute("photo", token.getPrincipal().getAttributes().get("picture"));
        return "user-profile";
    }
}