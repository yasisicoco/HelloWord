package com.helloword.collectionservice.global.response;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.helloword.collectionservice.domain.collection.controller.CollectionController;

import jakarta.servlet.http.HttpServletResponse;

@RestControllerAdvice(assignableTypes = {CollectionController.class})
public class SuccessResponseAdvice implements ResponseBodyAdvice {
	@Override
	public boolean supports(MethodParameter returnType, Class converterType) {
		return true;
	}

	@Override
	public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
		HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
		int code = servletResponse.getStatus();
		HttpStatus resolve = HttpStatus.resolve(code);

		if (resolve == null) {
			return body;
		}

		if (resolve.is2xxSuccessful()) {
			return new SuccessResponse(code, body);
		}

		return body;
	}

}
