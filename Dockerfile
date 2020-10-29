FROM node:14.15.0

WORKDIR /usr/src/Face-Detectify-API-BeforeDeployment

COPY ./ ./

RUN npm install 

CMD ["/bin/bash"]