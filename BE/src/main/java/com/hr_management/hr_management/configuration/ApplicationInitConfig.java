package com.hr_management.hr_management.configuration;


import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Role;
import com.hr_management.hr_management.enums.Roles;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.PermissionRepository;
import com.hr_management.hr_management.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequiredArgsConstructor
public class ApplicationInitConfig {
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    PermissionRepository permissionRepository;
    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository){
        return args -> {
            if(accountRepository.findByUsername("admin").isEmpty()){
                var roles=new HashSet<Role>();
                Optional<Role> role=roleRepository.findByName(Roles.ADMIN.toString());
                if((role.isEmpty())){
                    Role adminRole = roleRepository.save(Role.builder()
                            .name(Roles.ADMIN.toString())
                            .build());
                    roles.add(adminRole);
                }else{
                    roles.add(role.get());
                }
                Account account= Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build();
                accountRepository.save(account);
            }
        };
    }
}
