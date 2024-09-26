FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY build/libs/discovery-server-0.0.1-SNAPSHOT.jar /app/discovery-server.jar

ENTRYPOINT ["java", "-jar", "/app/discovery-server.jar"]