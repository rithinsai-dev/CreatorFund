# ── Stage 1: Build ──────────────────────────────────────────────
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy Maven wrapper and pom first (layer caching for dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:resolve -B

# Copy source and build the JAR (skip tests for faster builds)
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# ── Stage 2: Run ───────────────────────────────────────────────
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Render injects PORT at runtime; default to 8080
ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
