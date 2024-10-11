FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY build/libs/log-service-0.0.1-SNAPSHOT.jar /app/log-service.jar

ENTRYPOINT ["java", "-jar", "/app/log-service.jar"]