FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY build/libs/game-service-0.0.1-SNAPSHOT.jar /app/game-service.jar

ENTRYPOINT ["java", "-jar", "/app/game-service.jar"]