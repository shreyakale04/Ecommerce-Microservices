FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8706

ENTRYPOINT ["java", "-jar", "app.jar"]