/**
 * The technology explorer's dataset.
 *
 * Every category and every name below comes from the updated CV supplied for
 * this portfolio. This is intentionally separate from the older `skills.ts`
 * registry, which remains the assistant's validated source: the explorer needs
 * the finer, exact CV grouping, and changing the assistant's records here
 * would change what its answers are allowed to say.
 *
 * No proficiency, rating, year count or project badge lives here. A gallery
 * card states only that the technology belongs to the named category, and the
 * panel's descriptions are organisational, never claims of mastery.
 */

export interface TechnicalSkillCategory {
  /** Stable key for icons and React lists. */
  id: string;
  /** The exact category title shown in the section and the panel. */
  title: string;
  /** A short, neutral description of what the grouping contains. */
  description: string;
  /** Exact technology names, in the order supplied by the CV. */
  technologies: readonly string[];
}

export const TECHNICAL_SKILL_CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Interfaces, component systems and styling.",
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Angular",
      "Tailwind CSS",
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Services, frameworks and server-side data access.",
    technologies: [
      "Node.js",
      "Express.js",
      "PHP",
      "Laravel",
      "Java",
      "Spring Boot",
      "Spring MVC",
      "Spring Security",
      "Spring Cloud",
      "JPA",
      "Hibernate",
    ],
  },
  {
    id: "databases",
    title: "Databases and Storage",
    description: "Relational, document, cache, search and object storage.",
    technologies: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Oracle 19c",
      "Redis",
      "Cassandra",
      "Neo4j",
      "Elasticsearch",
      "MinIO",
      "AWS S3",
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Cross-platform and native mobile toolchains.",
    technologies: ["Dart", "Flutter", "React Native", "Android Development"],
  },
  {
    id: "ai",
    title: "AI and Machine Learning",
    description: "Models, libraries and applied AI workflows.",
    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Forecasting",
      "Generative AI",
      "RAG",
      "Ollama",
      "AI Agents",
      "Multi-Agent Systems",
    ],
  },
  {
    id: "big-data",
    title: "Big Data and Data Engineering",
    description: "Distributed processing, streaming and warehouse modelling.",
    technologies: [
      "Apache Spark",
      "Spark Streaming",
      "Spark Structured Streaming",
      "Apache Kafka",
      "Kafka Streams",
      "dbt Core",
      "HDFS",
      "Parquet",
    ],
  },
  {
    id: "cloud",
    title: "Cloud and DevOps",
    description: "Cloud platforms, containers, delivery and operations.",
    technologies: [
      "AWS",
      "Google Cloud Platform",
      "Docker",
      "Docker Compose",
      "Docker Swarm",
      "Kubernetes",
      "Ansible",
      "Terraform",
      "Jenkins",
      "Linux",
    ],
  },
  {
    id: "api",
    title: "API and Software Architecture",
    description: "Contracts, transports, identity and service patterns.",
    technologies: [
      "REST API",
      "OpenAPI / Swagger",
      "WebSocket",
      "Socket.IO",
      "JWT",
      "OAuth 2",
      "OpenID Connect",
      "Keycloak",
      "Microservices",
      "gRPC",
      "JMS",
    ],
  },
  {
    id: "bi",
    title: "Business Intelligence and Observability",
    description: "Dashboards, metrics, logs and tracing.",
    technologies: [
      "Power BI",
      "Metabase",
      "Apache Superset",
      "Kibana",
      "Grafana",
      "ELK Stack",
      "OpenTelemetry",
    ],
  },
  {
    id: "iot",
    title: "IoT and Embedded Systems",
    description: "Boards, protocols and device connectivity.",
    technologies: [
      "ESP32",
      "Arduino",
      "Raspberry Pi",
      "MQTT",
      "RFID",
      "Sensors",
      "Serial Communication",
    ],
  },
  {
    id: "tools",
    title: "Development Environments and Tools",
    description: "Editors, version control, testing and delivery practices.",
    technologies: [
      "Visual Studio Code",
      "IntelliJ IDEA",
      "PyCharm",
      "Android Studio",
      "Eclipse",
      "Git",
      "GitHub",
      "GitLab",
      "Postman",
      "pytest",
      "SonarQube",
      "UML",
      "MERISE",
      "Scrum",
      "Agile",
      "JIRA",
    ],
  },
] as const satisfies readonly TechnicalSkillCategory[];
