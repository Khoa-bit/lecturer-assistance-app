FROM node:18-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 curl && yarn global add pnpm

# Step 1. Rebuild the source code only when needed
FROM base AS nextbuilder

WORKDIR /app

# Fetch packages from a lockfile into virtual store, package manifest is ignored
# https://pnpm.io/cli/fetch
COPY package.json pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --silent --prod; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control."; \
  fi

# Install the packages from the local cache (above layer)
#RUN pnpm install -r --prod --offline

COPY src src
COPY public public
COPY config config
COPY next.config.mjs .eslintrc.json prettier.config.cjs postcss.config.cjs tailwind.config.cjs tsconfig.json ./

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
COPY .env.production .env.production

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN pnpm build

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Run playwright to screenshot components
FROM mcr.microsoft.com/playwright:v1.35.0-jammy AS mjmlbuilder

WORKDIR /app

RUN yarn global add pnpm

COPY --from=nextbuilder /app .
COPY playwright.config.ts .
COPY tests/screenshots tests

ENV CI 1

RUN pnpm exec playwright install --with-deps chromium && \
  pnpm remove sharp && \
  pnpm add sharp --silent && \
  pnpm add @playwright/test --silent && \
  pnpm exec playwright test --quiet --project chromium

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 3. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=mjmlbuilder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=mjmlbuilder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=mjmlbuilder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "server.js"]
