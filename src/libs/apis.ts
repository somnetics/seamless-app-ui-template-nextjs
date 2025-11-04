export type Api = {
  name: string;
  title: string;
  service: string;
  description: string;
  icon: string;
};

export const Apis: Api[] = [
  {
    name: "content-classifier",
    title: "Content Classifier",
    service: "ai-ml",
    description: "Classify content using Large Language Model",
    icon: "/icons/services/search.svg"
  },
  {
    name: "tag-generator",
    title: "Tag Generator",
    service: "ai-ml",
    description: "Automatic tag generation using Large Language Model",
    icon: "/icons/services/capture.svg"
  },
  {
    name: "sentiment-analyzer",
    title: "Sentiment Analyzer",
    service: "ai-ml",
    description: "Analyse the sentiment of text using LLM",
    icon: "/icons/services/upload.svg"
  },
  {
    name: "content-summarizer",
    title: "Content Summarizer",
    service: "ai-ml",
    description: "Summarize the content using LLM",
    icon: "/icons/services/document.svg"
  },
  {
    name: "data-visualization",
    title: "Data Visualization",
    service: "reports",
    description: "Visualize the data using graphical way",
    icon: "/icons/services/report.svg"
  },
  {
    name: "bpmn-workflow",
    title: "BPMN Workflow",
    service: "automation",
    description: "BPMN base workflow modeler",
    icon: "/icons/services/workflow.svg"
  },
  {
    name: "form",
    title: "Form",
    service: "automation",
    description: "Dynamic form builder",
    icon: "/icons/services/document.svg"
  },
  {
    name: "iot",
    title: "IOT",
    service: "automation",
    description: "Intenet of things",
    icon: "/icons/services/iot.svg"
  },
  {
    name: "iam",
    title: "IAM",
    service: "management",
    description: "Identity and Access Management",
    icon: "/icons/services/user.svg"
  },
  {
    name: "licence-manager",
    title: "License Manager",
    service: "management",
    description: "Manage application licenses",
    icon: "/icons/services/document.svg"
  },
  {
    name: "postgresql",
    title: "PostgreSQL",
    service: "databases",
    description: "PostgreSQL Database Management System",
    icon: "/icons/services/postgresql.svg"
  },
  {
    name: "mariadb",
    title: "MariaDB",
    service: "databases",
    description: "MariaDB Database Management System",
    icon: "/icons/services/mariadb.svg"
  },
  {
    name: "mongodb",
    title: "MongoDB",
    service: "databases",
    description: "MongoDB NoSQL Services",
    icon: "/icons/services/mongodb.svg"
  },
  {
    name: "elasticsearch",
    title: "Elasticsearch",
    service: "databases",
    description: "NoSQL Search Engine",
    icon: "/icons/services/elasticsearch.svg"
  },
  {
    name: "redis",
    title: "Redis",
    service: "databases",
    description: "Manage application cache",
    icon: "/icons/services/redis.svg"
  },
  {
    name: "minio",
    title: "MinIO",
    service: "storage",
    description: "Object Storage Solution",
    icon: "/icons/services/document.svg"
  },
  {
    name: "rabbitmq",
    title: "RabbitMQ",
    service: "messaging",
    description: "Message Queuing Service",
    icon: "/icons/services/rabbitmq.svg"
  },
  {
    name: "mqtt",
    title: "MQTT",
    service: "messaging",
    description: "Message Queuing Telemetry Transport",
    icon: "/icons/services/mqtt.png"
  },
  {
    name: "mail",
    title: "Mail",
    service: "notification",
    description: "Email Notification Service",
    icon: "/icons/services/document.svg"
  },
  {
    name: "sms",
    title: "SMS",
    service: "notification",
    description: "SMS Notification Service",
    icon: "/icons/services/document.svg"
  },
  {
    name: "whatsapp",
    title: "WhatsApp",
    service: "notification",
    description: "WhatsApp Notification Service",
    icon: "/icons/services/document.svg"
  },
  {
    name: "push-notification",
    title: "Push Notification",
    service: "notification",
    description: "Push Notification Service",
    icon: "/icons/services/document.svg"
  },
  {
    name: "logging",
    title: "Logging",
    service: "reports",
    description: "Log management and analysis",
    icon: "/icons/services/document.svg"
  },
  {
    name: "monitoring",
    title: "Monitoring",
    service: "reports",
    description: "Infrastructure and application quality checks",
    icon: "/icons/services/document.svg"
  },
  {
    name: "office-to-pdf",
    title: "Office to PDF",
    service: "tools",
    description: "Convert office documents to PDF",
    icon: "/icons/services/document.svg"
  },
  {
    name: "text-extraction",
    title: "Text Extraction",
    service: "tools",
    description: "Extract text from inage and PDF",
    icon: "/icons/services/document.svg"
  }
]