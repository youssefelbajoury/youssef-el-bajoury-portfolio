/**
 * Central technology image registry.
 *
 * One entry per technology shown in the interactive Skills explorer. The 104
 * supplied images are copied once into `public/images/technology-stack/`; the
 * handful of related technologies that intentionally share a supplied image
 * point at the same import here rather than creating duplicate physical files.
 *
 * Static imports are used deliberately, matching the project's other image
 * registries: Next.js supplies the intrinsic width and height, so a gallery
 * card can size its image box without layout shift. No Windows path ever
 * reaches the browser — `source` is audit metadata only.
 */

import agile from "@/public/images/technology-stack/agile.png";
import aiAgents from "@/public/images/technology-stack/ai-agents.png";
import androidDevelopment from "@/public/images/technology-stack/android-development.jpg";
import androidStudio from "@/public/images/technology-stack/android-studio.png";
import angular from "@/public/images/technology-stack/angular.jpg";
import ansible from "@/public/images/technology-stack/ansible.png";
import apacheKafka from "@/public/images/technology-stack/apache-kafka.png";
import apacheSpark from "@/public/images/technology-stack/apache-spark.png";
import apacheSuperset from "@/public/images/technology-stack/apache-superset.png";
import arduino from "@/public/images/technology-stack/arduino.png";
import awsS3 from "@/public/images/technology-stack/aws-s3.png";
import aws from "@/public/images/technology-stack/aws.png";
import cassandra from "@/public/images/technology-stack/cassandra.png";
import computerVision from "@/public/images/technology-stack/computer-vision.png";
import css3 from "@/public/images/technology-stack/css3.webp";
import dart from "@/public/images/technology-stack/dart.png";
import dbtCore from "@/public/images/technology-stack/dbt-core.png";
import deepLearning from "@/public/images/technology-stack/deep-learning.png";
import dockerCompose from "@/public/images/technology-stack/docker-compose.jpg";
import dockerSwarm from "@/public/images/technology-stack/docker-swarm.jpg";
import docker from "@/public/images/technology-stack/docker.png";
import eclipse from "@/public/images/technology-stack/eclipse.png";
import elasticsearch from "@/public/images/technology-stack/elasticsearch.png";
import elkStack from "@/public/images/technology-stack/elk-stack.png";
import esp32 from "@/public/images/technology-stack/esp32.png";
import expressjs from "@/public/images/technology-stack/expressjs.jpg";
import flutter from "@/public/images/technology-stack/flutter.png";
import forecasting from "@/public/images/technology-stack/forecasting.png";
import generativeAi from "@/public/images/technology-stack/generative-ai.png";
import git from "@/public/images/technology-stack/git.png";
import github from "@/public/images/technology-stack/github.png";
import gitlab from "@/public/images/technology-stack/gitlab.png";
import googleCloudPlatform from "@/public/images/technology-stack/google-cloud-platform.jpg";
import grafana from "@/public/images/technology-stack/grafana.png";
import grpc from "@/public/images/technology-stack/grpc.png";
import hdfs from "@/public/images/technology-stack/hdfs.jpg";
import hibernate from "@/public/images/technology-stack/hibernate.png";
import html5 from "@/public/images/technology-stack/html5.webp";
import intellijIdea from "@/public/images/technology-stack/intellij-idea.jpg";
import java from "@/public/images/technology-stack/java.png";
import javascript from "@/public/images/technology-stack/javascript.png";
import jenkins from "@/public/images/technology-stack/jenkins.jpg";
import jira from "@/public/images/technology-stack/jira.png";
import jms from "@/public/images/technology-stack/jms.png";
import jpa from "@/public/images/technology-stack/jpa.png";
import jwt from "@/public/images/technology-stack/jwt.png";
import keras from "@/public/images/technology-stack/keras.png";
import keycloak from "@/public/images/technology-stack/keycloak.jpg";
import kibana from "@/public/images/technology-stack/kibana.png";
import kubernetes from "@/public/images/technology-stack/kubernetes.png";
import laravel from "@/public/images/technology-stack/laravel.png";
import linux from "@/public/images/technology-stack/linux.png";
import merise from "@/public/images/technology-stack/merise.png";
import metabase from "@/public/images/technology-stack/metabase.png";
import microservices from "@/public/images/technology-stack/microservices.png";
import minio from "@/public/images/technology-stack/minio.png";
import mongodb from "@/public/images/technology-stack/mongodb.png";
import mqtt from "@/public/images/technology-stack/mqtt.png";
import multiAgentSystems from "@/public/images/technology-stack/multi-agent-systems.png";
import mysql from "@/public/images/technology-stack/mysql.png";
import naturalLanguageProcessing from "@/public/images/technology-stack/natural-language-processing.png";
import neo4j from "@/public/images/technology-stack/neo4j.png";
import nextjs from "@/public/images/technology-stack/nextjs.jpg";
import nodejs from "@/public/images/technology-stack/nodejs.png";
import numpy from "@/public/images/technology-stack/numpy.jpg";
import oauth2 from "@/public/images/technology-stack/oauth-2.png";
import ollama from "@/public/images/technology-stack/ollama.png";
import openapiSwagger from "@/public/images/technology-stack/openapi-swagger.png";
import openidConnect from "@/public/images/technology-stack/openid-connect.png";
import opentelemetry from "@/public/images/technology-stack/opentelemetry.png";
import oracle19c from "@/public/images/technology-stack/oracle19c.jpg";
import pandas from "@/public/images/technology-stack/pandas.png";
import parquet from "@/public/images/technology-stack/parquet.png";
import php from "@/public/images/technology-stack/php.png";
import postgresql from "@/public/images/technology-stack/postgresql.png";
import postman from "@/public/images/technology-stack/postman.png";
import powerBi from "@/public/images/technology-stack/power-bi.jpg";
import pycharm from "@/public/images/technology-stack/pycharm.jpg";
import pytest from "@/public/images/technology-stack/pytest.png";
import python from "@/public/images/technology-stack/python.jpg";
import pytorch from "@/public/images/technology-stack/pytorch.jpg";
import rag from "@/public/images/technology-stack/rag.jpg";
import raspberryPi from "@/public/images/technology-stack/raspberry-pi.png";
import reactNative from "@/public/images/technology-stack/react-native.png";
import react from "@/public/images/technology-stack/react.png";
import redis from "@/public/images/technology-stack/redis.png";
import restApi from "@/public/images/technology-stack/rest-api.png";
import rfid from "@/public/images/technology-stack/rfid.png";
import scikitLearn from "@/public/images/technology-stack/scikit-learn.png";
import scrum from "@/public/images/technology-stack/scrum.png";
import sensors from "@/public/images/technology-stack/sensors.png";
import serialCommunication from "@/public/images/technology-stack/serial-communication.png";
import socketIo from "@/public/images/technology-stack/socket-io.png";
import sonarqube from "@/public/images/technology-stack/sonarqube.png";
import springBoot from "@/public/images/technology-stack/spring-boot.jpg";
import springCloud from "@/public/images/technology-stack/spring-cloud.png";
import springSecurity from "@/public/images/technology-stack/spring-security.png";
import tailwindCss from "@/public/images/technology-stack/tailwind-css.jpg";
import tensorflow from "@/public/images/technology-stack/tensorflow.png";
import terraform from "@/public/images/technology-stack/terraform.png";
import typescript from "@/public/images/technology-stack/typescript.webp";
import uml from "@/public/images/technology-stack/uml.png";
import visualStudioCode from "@/public/images/technology-stack/visual-studio-code.jpg";
import websocket from "@/public/images/technology-stack/websocket.png";

import type { StaticImageData } from "next/image";

export interface TechnologyAsset {
  /** Stable slug, reused as the React key and the public filename stem. */
  id: string;
  /** Exact display label from the Skills dataset. */
  name: string;
  /** Stable category id from `skills-data.ts`. */
  category: string;
  /** Supplied filename. Audit metadata only; never used as a browser URL. */
  source: string;
  /** Statically imported public image with intrinsic dimensions. */
  image: StaticImageData;
  /** Meaningful alternative text for the logo. */
  alt: string;
}

function asset(
  id: string,
  name: string,
  category: string,
  source: string,
  image: StaticImageData
): TechnologyAsset {
  return { id, name, category, source, image, alt: `${name} logo` };
}

export const TECHNOLOGY_ASSETS: readonly TechnologyAsset[] = [
  asset("html5", "HTML5", "frontend", "HTML5.webp", html5),
  asset("css3", "CSS3", "frontend", "CSS3.svg.webp", css3),
  asset("javascript", "JavaScript", "frontend", "JAVASCRIPT.png", javascript),
  asset("typescript", "TypeScript", "frontend", "TYPESCRIPT.webp", typescript),
  asset("react", "React", "frontend", "REACT.png", react),
  asset("nextjs", "Next.js", "frontend", "NEXTJS.jpg", nextjs),
  asset("angular", "Angular", "frontend", "ANGULAR.jpg", angular),
  asset("tailwind-css", "Tailwind CSS", "frontend", "tailwindCss.jpg", tailwindCss),

  asset("nodejs", "Node.js", "backend", "NODE.JS.png", nodejs),
  asset("expressjs", "Express.js", "backend", "EXPRESSJS.jpg", expressjs),
  asset("php", "PHP", "backend", "PHP.png", php),
  asset("laravel", "Laravel", "backend", "LARAVEL.png", laravel),
  asset("java", "Java", "backend", "JAVA.png", java),
  asset("spring-boot", "Spring Boot", "backend", "SPRINGBOOT.jpg", springBoot),
  /* Spring MVC intentionally reuses the supplied Spring Boot image. */
  asset("spring-boot", "Spring MVC", "backend", "SPRINGBOOT.jpg", springBoot),
  asset("spring-security", "Spring Security", "backend", "SPRING SCURITY.png", springSecurity),
  asset("spring-cloud", "Spring Cloud", "backend", "SPRING CLOUD.png", springCloud),
  asset("jpa", "JPA", "backend", "JPA.png", jpa),
  asset("hibernate", "Hibernate", "backend", "HIBERNATE.png", hibernate),

  asset("postgresql", "PostgreSQL", "databases", "POSTGRESQL.png", postgresql),
  asset("mysql", "MySQL", "databases", "MYSQL.png", mysql),
  asset("mongodb", "MongoDB", "databases", "MONGODB.png", mongodb),
  asset("oracle19c", "Oracle 19c", "databases", "ORACLE19C.jpg", oracle19c),
  asset("redis", "Redis", "databases", "REDIS.png", redis),
  asset("cassandra", "Cassandra", "databases", "CASSANDRA.png", cassandra),
  asset("neo4j", "Neo4j", "databases", "NEO4J.png", neo4j),
  asset("elasticsearch", "Elasticsearch", "databases", "Elasticsearch.png", elasticsearch),
  asset("minio", "MinIO", "databases", "MINIO.png", minio),
  asset("aws-s3", "AWS S3", "databases", "AWS S3.png", awsS3),

  asset("dart", "Dart", "mobile", "DART.png", dart),
  asset("flutter", "Flutter", "mobile", "FLUTTER.png", flutter),
  /* The space before `.png` in the supplied filename is intentional. */
  asset("react-native", "React Native", "mobile", "REACT NATIVE .png", reactNative),
  asset(
    "android-development",
    "Android Development",
    "mobile",
    "Android Development.jpg",
    androidDevelopment
  ),

  asset("python", "Python", "ai", "python.jpg", python),
  asset("pandas", "Pandas", "ai", "PANDAS.png", pandas),
  asset("numpy", "NumPy", "ai", "NUMPY.jpg", numpy),
  asset("scikit-learn", "Scikit-learn", "ai", "Scikit-learn.png", scikitLearn),
  asset("tensorflow", "TensorFlow", "ai", "TENSORFLOW.png", tensorflow),
  asset("keras", "Keras", "ai", "KERAS.png", keras),
  asset("pytorch", "PyTorch", "ai", "PYTORCH.jpg", pytorch),
  asset("deep-learning", "Deep Learning", "ai", "DEEPLEARNING.png", deepLearning),
  asset(
    "natural-language-processing",
    "Natural Language Processing",
    "ai",
    "Natural Language Processing.png",
    naturalLanguageProcessing
  ),
  asset("computer-vision", "Computer Vision", "ai", "Computer Vision.png", computerVision),
  asset("forecasting", "Forecasting", "ai", "FORECASTING.png", forecasting),
  asset("generative-ai", "Generative AI", "ai", "GENERATIVE AI.png", generativeAi),
  asset("rag", "RAG", "ai", "RAG.jpg", rag),
  asset("ollama", "Ollama", "ai", "OLLAMA.png", ollama),
  asset("ai-agents", "AI Agents", "ai", "AI AGENTS.png", aiAgents),
  asset(
    "multi-agent-systems",
    "Multi-Agent Systems",
    "ai",
    "MULTI AGENT SYSTEMS.png",
    multiAgentSystems
  ),

  /* The three Spark technologies and the two Kafka technologies intentionally
     share their supplied images. */
  asset("apache-spark", "Apache Spark", "big-data", "APACHE SPARK.png", apacheSpark),
  asset("apache-spark", "Spark Streaming", "big-data", "APACHE SPARK.png", apacheSpark),
  asset("apache-spark", "Spark Structured Streaming", "big-data", "APACHE SPARK.png", apacheSpark),
  asset("apache-kafka", "Apache Kafka", "big-data", "APACHE KAFKA.png", apacheKafka),
  asset("apache-kafka", "Kafka Streams", "big-data", "APACHE KAFKA.png", apacheKafka),
  asset("dbt-core", "dbt Core", "big-data", "DBT CORE.png", dbtCore),
  asset("hdfs", "HDFS", "big-data", "HDFS.jpg", hdfs),
  asset("parquet", "Parquet", "big-data", "PARQUET.png", parquet),

  asset("aws", "AWS", "cloud", "AWS.png", aws),
  asset(
    "google-cloud-platform",
    "Google Cloud Platform",
    "cloud",
    "GOOGLE CLOUD PLATFORM.jpg",
    googleCloudPlatform
  ),
  asset("docker", "Docker", "cloud", "DOCKER.png", docker),
  asset("docker-compose", "Docker Compose", "cloud", "DOCKER COMPOSE.jpg", dockerCompose),
  asset("docker-swarm", "Docker Swarm", "cloud", "DOCKER SWARM.jpg", dockerSwarm),
  asset("kubernetes", "Kubernetes", "cloud", "KUBERNETES.png", kubernetes),
  asset("ansible", "Ansible", "cloud", "ANSIBLE.png", ansible),
  asset("terraform", "Terraform", "cloud", "TERRAFORM.png", terraform),
  asset("jenkins", "Jenkins", "cloud", "JENKINS.jpg", jenkins),
  asset("linux", "Linux", "cloud", "LINUX.png", linux),

  asset("rest-api", "REST API", "api", "REST API.png", restApi),
  asset("openapi-swagger", "OpenAPI / Swagger", "api", "OPENAPI SWAGGER.png", openapiSwagger),
  asset("websocket", "WebSocket", "api", "WEBSOCKET.png", websocket),
  asset("socket-io", "Socket.IO", "api", "SOCKET.IO.png", socketIo),
  asset("jwt", "JWT", "api", "JWT.png", jwt),
  asset("oauth-2", "OAuth 2", "api", "OAUTH 2.png", oauth2),
  asset("openid-connect", "OpenID Connect", "api", "OPENID CONNECT.png", openidConnect),
  asset("keycloak", "Keycloak", "api", "KEYCLOAK.jpg", keycloak),
  asset("microservices", "Microservices", "api", "MICROSERVICE.png", microservices),
  asset("grpc", "gRPC", "api", "GRPC.png", grpc),
  asset("jms", "JMS", "api", "JMS.png", jms),

  asset("power-bi", "Power BI", "bi", "POWERBI.jpg", powerBi),
  asset("metabase", "Metabase", "bi", "METABASE.png", metabase),
  asset("apache-superset", "Apache Superset", "bi", "APACHE SUPERSET.png", apacheSuperset),
  asset("kibana", "Kibana", "bi", "KIBANA.png", kibana),
  asset("grafana", "Grafana", "bi", "GRAFANA.png", grafana),
  asset("elk-stack", "ELK Stack", "bi", "ELK STACK.png", elkStack),
  asset("opentelemetry", "OpenTelemetry", "bi", "OPENTELEMETRY.png", opentelemetry),

  asset("esp32", "ESP32", "iot", "ESP32.png", esp32),
  asset("arduino", "Arduino", "iot", "ARDUINO.png", arduino),
  asset("raspberry-pi", "Raspberry Pi", "iot", "RASPBERRY PI.png", raspberryPi),
  asset("mqtt", "MQTT", "iot", "MQTT.png", mqtt),
  asset("rfid", "RFID", "iot", "RFID.png", rfid),
  asset("sensors", "Sensors", "iot", "SENSORS.png", sensors),
  asset(
    "serial-communication",
    "Serial Communication",
    "iot",
    "SERIAL COMMUNICATION.png",
    serialCommunication
  ),

  asset("visual-studio-code", "Visual Studio Code", "tools", "VS CODE.jpg", visualStudioCode),
  asset("intellij-idea", "IntelliJ IDEA", "tools", "INTELLIJ IDEA.jpg", intellijIdea),
  asset("pycharm", "PyCharm", "tools", "PYCHARM.jpg", pycharm),
  asset("android-studio", "Android Studio", "tools", "ANDROID STUDIO.png", androidStudio),
  asset("eclipse", "Eclipse", "tools", "ECLIPSE.png", eclipse),
  asset("git", "Git", "tools", "GIT.png", git),
  asset("github", "GitHub", "tools", "GITHUB.png", github),
  asset("gitlab", "GitLab", "tools", "GITLAB.png", gitlab),
  asset("postman", "Postman", "tools", "POSTMAN.png", postman),
  asset("pytest", "pytest", "tools", "PYTEST.png", pytest),
  asset("sonarqube", "SonarQube", "tools", "SONARQUBE.png", sonarqube),
  asset("uml", "UML", "tools", "UML.png", uml),
  asset("merise", "MERISE", "tools", "MERISE.png", merise),
  asset("scrum", "Scrum", "tools", "SCRUM.png", scrum),
  asset("agile", "Agile", "tools", "AGILE.png", agile),
  asset("jira", "JIRA", "tools", "JIRA.png", jira),
];

const ASSET_BY_NAME = new Map(TECHNOLOGY_ASSETS.map((item) => [item.name, item]));

/** Looks up the supplied image for a technology label from `skills-data.ts`. */
export function getTechnologyAsset(name: string): TechnologyAsset | undefined {
  return ASSET_BY_NAME.get(name);
}
