FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY build/libs/word-service-0.0.1-SNAPSHOT.jar /app/word-service.jar

ENTRYPOINT ["java", "-jar", "/app/word-service.jar"]