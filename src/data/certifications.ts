// Generado por scripts/fetch-credly.mjs — no editar a mano.
// Última sincronización: 2026-09-15

export type Certification = {
  id: string;
  slug: string;
  name: string;
  issuer: string;
  image: string;
  /** Fecha ISO de emisión */
  issuedAt: string;
  /** Fecha ISO de vencimiento, o null si la insignia no expira */
  expiresAt: string | null;
  level: string | null;
  /** true para certificaciones formales (las que vencen), false para skill badges */
  isCertification: boolean;
  /** Página pública de verificación en Credly */
  url: string;
  skills: string[];
};

export const credlyProfileUrl = "https://www.credly.com/users/gerardo-alberto-amaya-fuentes/badges";

export const certifications: Certification[] = [
  {
    id: "5f5e6a44-46f9-47f6-8a44-77912ad88abe",
    slug: "associate-cloud-engineer-certification",
    name: "Associate Cloud Engineer Certification",
    issuer: "Google Cloud",
    image: "/certifications/associate-cloud-engineer-certification.png",
    issuedAt: "2026-09-14",
    expiresAt: "2029-09-14",
    level: "Intermediate",
    isCertification: true,
    url: "https://www.credly.com/badges/5f5e6a44-46f9-47f6-8a44-77912ad88abe/public_url",
    skills: [
      "Cloud Architecture",
      "Cloud Computing",
      "Cloud Security",
      "Cloud Storage",
      "Compute Engine",
      "GKE",
      "Google Cloud Platform (GCP)",
      "Identity And Access Management (IAM)",
      "Infrastructure as Code (IaC)",
      "Networking",
      "Pub/sub",
      "SQL",
    ],
  },
  {
    id: "539b7bce-9e2e-4696-a187-2667f0e8b5e7",
    slug: "develop-serverless-applications-on-cloud-run",
    name: "Develop Serverless Applications on Cloud Run",
    issuer: "Google Cloud",
    image: "/certifications/develop-serverless-applications-on-cloud-run.png",
    issuedAt: "2026-02-27",
    expiresAt: null,
    level: "Intermediate",
    isCertification: false,
    url: "https://www.credly.com/badges/539b7bce-9e2e-4696-a187-2667f0e8b5e7/public_url",
    skills: [
      "Cloud Build",
      "Cloud Run",
      "Cloud Storage",
      "Containers",
      "Docker",
      "Firestore",
      "Microserverice",
      "Pub/sub",
      "REST API",
      "Serverless",
      "Service Account",
    ],
  },
  {
    id: "72b4831c-1c4b-4fc6-bb89-d22f492408ed",
    slug: "analyze-images-with-the-cloud-vision-api",
    name: "Analyze Images with the Cloud Vision API",
    issuer: "Google Cloud",
    image: "/certifications/analyze-images-with-the-cloud-vision-api.png",
    issuedAt: "2026-02-26",
    expiresAt: null,
    level: "Foundational",
    isCertification: false,
    url: "https://www.credly.com/badges/72b4831c-1c4b-4fc6-bb89-d22f492408ed/public_url",
    skills: ["API", "Cloud Vision API", "Image Processing"],
  },
  {
    id: "45cd7060-bc80-47a0-b378-ba435ae0e821",
    slug: "configure-service-accounts-and-iam-roles-for-google-cloud",
    name: "Configure Service Accounts and IAM Roles for Google Cloud",
    issuer: "Google Cloud",
    image: "/certifications/configure-service-accounts-and-iam-roles-for-google-cloud.png",
    issuedAt: "2026-02-26",
    expiresAt: null,
    level: "Foundational",
    isCertification: false,
    url: "https://www.credly.com/badges/45cd7060-bc80-47a0-b378-ba435ae0e821/public_url",
    skills: ["BigQuery", "IAM", "IAM Roles"],
  },
  {
    id: "394f5fb2-5cec-491c-b63e-68d3e60503d4",
    slug: "implement-ci-cd-pipelines-on-google-cloud",
    name: "Implement CI/CD Pipelines on Google Cloud",
    issuer: "Google Cloud",
    image: "/certifications/implement-ci-cd-pipelines-on-google-cloud.png",
    issuedAt: "2026-02-26",
    expiresAt: null,
    level: "Intermediate",
    isCertification: false,
    url: "https://www.credly.com/badges/394f5fb2-5cec-491c-b63e-68d3e60503d4/public_url",
    skills: ["Artifact Registry", "CI/CD", "Cloud Build", "Cloud Deploy"],
  },
  {
    id: "65227a26-90d4-4cd4-ba21-7f95a675a13d",
    slug: "build-infrastructure-with-terraform-on-google-cloud",
    name: "Build Infrastructure with Terraform on Google Cloud",
    issuer: "Google Cloud",
    image: "/certifications/build-infrastructure-with-terraform-on-google-cloud.png",
    issuedAt: "2025-07-22",
    expiresAt: null,
    level: "Intermediate",
    isCertification: false,
    url: "https://www.credly.com/badges/65227a26-90d4-4cd4-ba21-7f95a675a13d/public_url",
    skills: ["Google Cloud Platform (GCP)", "Infrastructure as Code (IaC)", "Terraform"],
  },
  {
    id: "ab187ea6-0aa5-4d56-b8ce-7a8cd0814eaa",
    slug: "develop-your-google-cloud-network",
    name: "Develop Your Google Cloud Network",
    issuer: "Google Cloud",
    image: "/certifications/develop-your-google-cloud-network.png",
    issuedAt: "2025-07-17",
    expiresAt: null,
    level: "Intermediate",
    isCertification: false,
    url: "https://www.credly.com/badges/ab187ea6-0aa5-4d56-b8ce-7a8cd0814eaa/public_url",
    skills: ["Cloud Functions", "Cloud Storage", "IAM", "Monitoring", "Pub/sub"],
  },
  {
    id: "2f45a70e-1541-49d7-aec5-f6bbb6675529",
    slug: "set-up-an-app-dev-environment-on-google-cloud",
    name: "Set Up an App Dev Environment on Google Cloud",
    issuer: "Google Cloud",
    image: "/certifications/set-up-an-app-dev-environment-on-google-cloud.png",
    issuedAt: "2025-07-10",
    expiresAt: null,
    level: "Foundational",
    isCertification: false,
    url: "https://www.credly.com/badges/2f45a70e-1541-49d7-aec5-f6bbb6675529/public_url",
    skills: ["Cloud Functions", "Cloud Storage", "IAM", "Monitoring", "Pub/sub"],
  },
  {
    id: "4add0970-de8e-4d39-b754-d6c939aaabe4",
    slug: "implement-load-balancing-on-compute-engine",
    name: "Implement Load Balancing on Compute Engine",
    issuer: "Google Cloud",
    image: "/certifications/implement-load-balancing-on-compute-engine.png",
    issuedAt: "2025-07-04",
    expiresAt: null,
    level: "Foundational",
    isCertification: false,
    url: "https://www.credly.com/badges/4add0970-de8e-4d39-b754-d6c939aaabe4/public_url",
    skills: ["Cloud Computing", "Compute Engine", "GKE", "Kubernetes", "Networking"],
  },
  {
    id: "5f1ae650-6a09-42d9-8e0e-5db9ca603a89",
    slug: "mta-database-fundamentals-certified-2022",
    name: "MTA: Database Fundamentals - Certified 2022",
    issuer: "Microsoft",
    image: "/certifications/mta-database-fundamentals-certified-2022.png",
    issuedAt: "2022-01-12",
    expiresAt: null,
    level: null,
    isCertification: true,
    url: "https://www.credly.com/badges/5f1ae650-6a09-42d9-8e0e-5db9ca603a89/public_url",
    skills: [
      "Core Database Concepts",
      "Creating Database Objects",
      "Data Manipulation",
      "Data Storage",
      "Database Administration",
    ],
  },
];
