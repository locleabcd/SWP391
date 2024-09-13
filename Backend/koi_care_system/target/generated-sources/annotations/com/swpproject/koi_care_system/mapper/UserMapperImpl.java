package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.request.UserDTO;
import com.swpproject.koi_care_system.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.39.0.v20240820-0604, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User maptoUser(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( userDTO.getEmail() );
        user.setPassword( userDTO.getPassword() );
        user.setUsername( userDTO.getUsername() );

        return user;
    }

    @Override
    public UserDTO maptoUserDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.email( user.getEmail() );
        userDTO.password( user.getPassword() );
        userDTO.username( user.getUsername() );

        return userDTO.build();
    }

    @Override
    public void updateUser(User user, UserDTO userDTO) {
        if ( userDTO == null ) {
            return;
        }

        user.setEmail( userDTO.getEmail() );
        user.setPassword( userDTO.getPassword() );
        user.setUsername( userDTO.getUsername() );
    }
}
