###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli

RUN npm install --force

COPY . .

RUN npx prisma generate --schema=./libs/modules/prisma/schema.prisma

RUN npm run build

###################
# BUILD FOR PRODUCTION
###################

FROM node:20 As build

WORKDIR /usr/src/app

COPY package*.json ./

# Install Nest-Cli
RUN npm i -g @nestjs/cli

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm install --only=production --force && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:20 As production

WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
COPY libs ./libs

RUN npm install -g npm@10.8.2

CMD  npx prisma migrate deploy --schema=libs/modules/prisma/schema.prisma && node dist/apps/api-core/src/main.js