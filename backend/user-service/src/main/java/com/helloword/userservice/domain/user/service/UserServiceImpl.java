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

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder customPasswordEncoder;

    private static final String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final String PHONE_PATTERN = "^\\d{11}$";

    @Override
    public void registerUser(SignupRequest signupRequest) {
        signupRequest.setPassword(customPasswordEncoder.encode(signupRequest.getPassword()));

        if (!Pattern.matches(EMAIL_PATTERN, signupRequest.getEmail())) {
            throw new ExceptionResponse(CustomException.INVALID_EMAIL_FORMAT);
        }

        if (!Pattern.matches(PHONE_PATTERN, signupRequest.getPhone())) {
            throw new ExceptionResponse(CustomException.INVALID_PHONE_FORMAT);
        }

        if(checkDuplicateEmail(signupRequest.getEmail())) {
            throw new ExceptionResponse(CustomException.DUPLICATE_EMAIL);
        }

        if(checkDuplicatePhone(signupRequest.getPhone())) {
            throw new ExceptionResponse(CustomException.DUPLICATE_PHONE);
        }

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
    public void deleteUser(Long xUserId, Long userId) {
        checkOwnership(xUserId, userId);
        userRepository.deleteById(userId);
    }

    @Override
    public void updatePassword(Long xUserId, Long userId, NewPasswordRequest newPasswordRequest) {
        User user = findUserById(userId);
        checkOwnership(xUserId, userId);

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

    private User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new ExceptionResponse(CustomException.NOT_FOUND));
    }

    private void checkOwnership(Long ownerId, Long requestUserId) {
        if (!ownerId.equals(requestUserId)) {
            throw new ExceptionResponse(CustomException.FORBIDDEN);
        }
    }
}
