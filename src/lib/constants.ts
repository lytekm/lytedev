export const SITE_NAME = "LyteDev";

export const SITE_URL = "https://lytedev.ca";

export const SITE_DESCRIPTION =
  "Personal software engineering portfolio and project site for Kevin Morrison, covering developer tools, applications, graphics work, experiments, and technical writing.";

export const GITHUB_URL = "https://github.com/lytekm";

export const LOGO_PATH = "/branding/lyte-logo.png";

export const PROJECT_STATUSES = [
  "Active",
  "Released",
  "Experimental",
  "Archived",
  "In Development",
] as const;

export const STORAGE_BUCKET = "media";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;
