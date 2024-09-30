package com.helloword.userservice.domain.user.service;

import com.helloword.userservice.domain.user.dto.request.LoginRequest;
import com.helloword.userservice.domain.user.dto.request.NewPasswordRequest;
import com.helloword.userservice.domain.user.dto.request.SignupRequest;
import com.helloword.userservice.domain.user.dto.response.AuthenticateUserResponse;
import com.helloword.userservice.domain.user.model.User;
import com.helloword.userservice.domain.user.repository.UserRepository;
import com.helloword.userservice.global.exception.CustomException;
import com.helloword.userservice.global.exception.ExceptionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder customPasswordEncoder;

    @Override
    public void registerUser(SignupRequest signupRequest) {
        signupRequest.setPassword(customPasswordEncoder.encode(signupRequest.getPassword()));
        userRepository.save(User.createUser(signupRequest));
    }

    @Override
    public boolean checkDuplicateEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean checkDuplicatePhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public void updatePassword(Long userId, NewPasswordRequest newPasswordRequest) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ExceptionResponse(CustomException.NOT_FOUND)
        );

        user.changePassword(customPasswordEncoder.encode(newPasswordRequest.getPassword()));

        userRepository.save(user);
    }

    @Override
    public AuthenticateUserResponse authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(
                () -> new ExceptionResponse(CustomException.NOT_FOUND)
        );

        if (!customPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ExceptionResponse(CustomException.NOT_FOUND);
        }

        return AuthenticateUserResponse.toDto(user);
    }
}
