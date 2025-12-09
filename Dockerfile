FROM node:22-slim
WORKDIR /app  
#sets the working directory inside the container
COPY package*.json ./ 
# copies package.json and package-lock.json to the working directory
RUN npm ci
COPY . . 
#opies the rest of the application code to the working directory
ENV PORT=5000 
#sets the PORT environment variable to 5000
EXPOSE 5000 
# exposes port 5000 for the application
CMD ["node", "app.js"] 
# starts the application by running app.js with Node.js