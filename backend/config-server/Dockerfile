FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY build/libs/config-server-0.0.1-SNAPSHOT.jar /app/config-server.jar

ENTRYPOINT ["java", "-jar", "/app/config-server.jar"]