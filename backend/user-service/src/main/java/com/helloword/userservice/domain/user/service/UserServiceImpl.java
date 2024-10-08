package com.helloword.userservice.domain.user.service;

import com.helloword.userservice.domain.user.dto.request.*;
import com.helloword.userservice.domain.user.dto.response.AuthenticateUserResponse;
import com.helloword.userservice.domain.user.model.EmailVerification;
import com.helloword.userservice.domain.user.model.User;
import com.helloword.userservice.domain.user.repository.EmailVerificationRepository;
import com.helloword.userservice.domain.user.repository.UserRepository;
import com.helloword.userservice.global.exception.CustomException;
import com.helloword.userservice.global.exception.MainException;
import com.helloword.userservice.global.utils.EmailUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder customPasswordEncoder;

    private final EmailUtil emailUtil;

    private static final String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final String PHONE_PATTERN = "^\\d{11}$";

    @Transactional
    @Override
    public void registerUser(SignupRequest signupRequest) {
        signupRequest.setPassword(customPasswordEncoder.encode(signupRequest.getPassword()));

        if (!Pattern.matches(EMAIL_PATTERN, signupRequest.getEmail())) {
            throw new MainException(CustomException.INVALID_EMAIL_FORMAT);
        }

        if (!Pattern.matches(PHONE_PATTERN, signupRequest.getPhone())) {
            throw new MainException(CustomException.INVALID_PHONE_FORMAT);
        }

        if (checkDuplicateEmail(signupRequest.getEmail())) {
            throw new MainException(CustomException.DUPLICATE_EMAIL);
        }

        if (checkDuplicatePhone(signupRequest.getPhone())) {
            throw new MainException(CustomException.DUPLICATE_PHONE);
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

    @Transactional
    @Override
    public void deleteUser(Long xUserId, Long userId) {
        checkOwnership(xUserId, userId);
        userRepository.deleteById(userId);
    }

    @Transactional
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
                () -> new MainException(CustomException.NOT_FOUND)
        );

        if (!customPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new MainException(CustomException.NOT_FOUND);
        }

        return AuthenticateUserResponse.toDto(user);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new MainException(CustomException.NOT_FOUND));
    }

    private void checkOwnership(Long ownerId, Long requestUserId) {
        if (!ownerId.equals(requestUserId)) {
            throw new MainException(CustomException.FORBIDDEN);
        }
    }

    @Transactional
    @Override
    public void sendEmailCode(SendCodeRequestDto sendCodeRequestDto) {
        EmailVerification emailVerification = emailVerificationRepository
                .findByEmail(sendCodeRequestDto.email())
                .orElseGet(() -> EmailVerification.createEmailVerification(sendCodeRequestDto.email()));

        // 이미 인증된 이메일이면 처리
        if (emailVerification.isEmailVerified()) {
            throw new MainException(CustomException.EMAIL_ALREADY_VERIFIED);
        }

        // 인증 코드를 갱신하거나 새로운 인증 정보를 저장
        if (emailVerification.getId() != null) {
            emailVerification.refreshVerificationCode();
        } else {
            emailVerificationRepository.save(emailVerification);
        }

        // 이메일 전송을 위한 변수 설정 및 이메일 전송
        Map<String, Object> variables = Map.of(
                "verificationCode", emailVerification.getVerificationCode()
        );

        String subject = "Hello, Word! 이메일 인증 코드";
        String template = "signupEmailTemplate";
        emailUtil.sendEmail(sendCodeRequestDto.email(), subject, template, variables);
    }

    @Transactional
    @Override
    public void verifyEmailCode(VerifyCodeRequestDto verifyCodeRequestDto) {
        EmailVerification emailVerification = emailVerificationRepository.findByEmail(verifyCodeRequestDto.email())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_EMAIL));

        if (emailVerification.isEmailVerified()) {
            throw new MainException(CustomException.EMAIL_ALREADY_VERIFIED);
        }

        if(!emailVerification.isCodeValid()) {
            throw new MainException(CustomException.VERIFICATION_CODE_EXPIRED);
        }

        if (!emailVerification.getVerificationCode().equals(verifyCodeRequestDto.code())) {
            throw new MainException(CustomException.VERIFICATION_CODE_MISMATCH);
            }

        emailVerification.updateEmailVerified();
    }

    @Transactional
    @Override
    public void sendTempPassword(SendTempPasswordRequestDto sendTemporaryPasswordRequestDto) {
        User user = userRepository.findByEmail(sendTemporaryPasswordRequestDto.email())
                .orElseThrow(() -> new MainException(CustomException.EMAIL_MISMATCH));
        if(!user.getUsername().equals(sendTemporaryPasswordRequestDto.username()))
            throw new MainException(CustomException.EMAIL_MISMATCH);
        String tempPassword = generateTemporaryPassword();

        user.changePassword(customPasswordEncoder.encode(tempPassword));

        Map<String, Object> variables = Map.of(
                "tempPassword", tempPassword
        );

        String subject = "Hello, Word! 임시 비밀번호 발급 안내";
        String template = "passwordEmailTemplate";
        emailUtil.sendEmail(sendTemporaryPasswordRequestDto.email(), subject, template, variables);
    }


    private String generateTemporaryPassword() {
        String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
        String CHAR_UPPER = CHAR_LOWER.toUpperCase();
        String DIGIT = "0123456789";
        String SPECIAL_CHAR = "!@#$%^&*()-_+=<>?";
        String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + DIGIT + SPECIAL_CHAR;

        StringBuilder password = new StringBuilder(12);
        Random random = new SecureRandom();

        for (int i = 0; i < 12; i++) {
            int index = random.nextInt(PASSWORD_ALLOW_BASE.length());
            password.append(PASSWORD_ALLOW_BASE.charAt(index));
        }

        return password.toString();
    }
}
