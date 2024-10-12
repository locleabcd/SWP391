package com.swpproject.koi_care_system.config;

import com.swpproject.koi_care_system.enums.Role;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.repository.UserProfileRepository;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.authentication.IAuthenticationService;
import com.swpproject.koi_care_system.service.profile.IProfileService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class OAuth2LoginHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IProfileService profileService;
    @Autowired
    private IAuthenticationService authenticationService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        if ("google".equals(token.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();
            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();
            String imageUrl = attributes.getOrDefault("picture", "").toString();
            userRepository.findByEmail(email).ifPresentOrElse(user -> {
                DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(user.getRole().name())),
                        attributes, "sub");
                Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(user.getRole().name())),
                        token.getAuthorizedClientRegistrationId());
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            }, () -> {
                User userEntity = new User();
                userEntity.setRole(Role.MEMBER);
                userEntity.setEmail(email);
                userEntity.setUsername(name);
                userEntity.setStatus(true);
                userEntity.setProvider("GOOGLE");
                userEntity.setPassword("99999999");
                userRepository.save(userEntity);
                userEntity.setUserProfile(profileService.createProfileOauth(userEntity,imageUrl));
                userRepository.save(userEntity);

                String jwt = authenticationService.generateToken(userEntity);
                response.addHeader("Authorization", "Bearer " + jwt);


                DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(userEntity.getRole().name())),
                        attributes, "sub");
                Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(userEntity.getRole().name())),
                        token.getAuthorizedClientRegistrationId());
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            });
        }
        this.setAlwaysUseDefaultTargetUrl(true);
        this.setDefaultTargetUrl("https://koi-care-system.vercel.app/member");
        super.onAuthenticationSuccess(request, response, authentication);
    }
}