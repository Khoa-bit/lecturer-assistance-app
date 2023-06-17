# Start from the latest golang base image
FROM golang:alpine3.18 AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY cronFunc cronFunc
COPY handlers handlers
COPY utils utils
COPY .env.production.local .env
COPY main.go .

# Build the Go app
RUN go build -o main .

# Step 2. Production image, copy all the files and run next
FROM base AS runner

COPY --from=builder main .

# Note: Don't expose ports or declare volumes here, Compose will handle that for us

# Run the binary program produced by `go build`
CMD ["./main", "serve", "--http", "0.0.0.0:8090"]
