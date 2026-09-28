export const SITE_NAME = "LyteDev";

export const SITE_URL = "https://lytedev.ca";

export const SITE_DESCRIPTION =
  "I’m Kevin Morrison, a software engineer. These are my apps, developer tools, graphics projects, and notes on what I’m learning.";

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
