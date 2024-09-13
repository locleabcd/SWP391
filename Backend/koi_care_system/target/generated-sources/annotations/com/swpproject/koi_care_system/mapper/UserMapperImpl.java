package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.request.UserDTO;
import com.swpproject.koi_care_system.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User maptoUser(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User user = new User();

        user.setUsername( userDTO.getUsername() );
        user.setPassword( userDTO.getPassword() );
        user.setEmail( userDTO.getEmail() );

        return user;
    }

    @Override
    public UserDTO maptoUserDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.username( user.getUsername() );
        userDTO.password( user.getPassword() );
        userDTO.email( user.getEmail() );

        return userDTO.build();
    }

    @Override
    public void updateUser(User user, UserDTO userDTO) {
        if ( userDTO == null ) {
            return;
        }

        user.setUsername( userDTO.getUsername() );
        user.setPassword( userDTO.getPassword() );
        user.setEmail( userDTO.getEmail() );
    }
}
