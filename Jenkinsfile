// Jenkins Docker Ecr: https://octopus.com/blog/jenkins-docker-ecr
// SSH Agent: https://www.jenkins.io/doc/pipeline/steps/ssh-agent/

pipeline {
    agent any

    environment {
        CODE_VERSION = sh(
            script: "cat ./package.json | grep -m 1 version | sed 's/[^0-9.]//g'", returnStdout: true
        ).trim()

        VERSION = "${CODE_VERSION}_${BUILD_TIMESTAMP}"

        ECR_HOST = '803614452193.dkr.ecr.ap-southeast-1.amazonaws.com'
        IMAGE_REPO = '803614452193.dkr.ecr.ap-southeast-1.amazonaws.com/creator-hub-image-generation-wrapper'
        AWS_CREDENTIAL = 'ecr:ap-southeast-1:aws-deployment-credentials'

        DEV_MACHINE_HOST = '139.180.138.240'
        DEV_MACHINE_SSH_PORT = '2232'
        DEV_MACHINE_SSH_CREDENTIAL = 'ssh-key-jenkins-dev'

        PROD_MACHINE_HOST = ''
        PROD_MACHINE_SSH_PORT = '22'
        
        BRANCH_DEV = 'dev'
        BRANCH_STAGING = 'stg'
        BRANCH_MASTER = 'master'
        BRANCH_OUTSOURCE = 'outsourcing'
    }

    stages {
        stage('Git SCM') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Build') {
            when {
                anyOf {
                    branch BRANCH_DEV
                    branch BRANCH_STAGING
                    branch BRANCH_MASTER
                    branch BRANCH_OUTSOURCE
                    branch pattern: 'release\\/.*', comparator: 'REGEXP'
                }
            }

            steps {
                script {
                    docker.withRegistry("https://${ECR_HOST}", AWS_CREDENTIAL) {
                        echo "Triggering build ${IMAGE_REPO}:${VERSION}"
                        def image = docker.build("${IMAGE_REPO}:${VERSION}", " -f Dockerfile .")

                        echo "publishing ${IMAGE_REPO}:${VERSION}"
                        image.push()
                    }
                }
            }
        }

        stage('Deploy Artifact') {
            when {
                anyOf {
                    branch BRANCH_DEV
                    branch BRANCH_STAGING
                    branch BRANCH_MASTER
                    branch BRANCH_OUTSOURCE
                    branch pattern: 'release\\/.*', comparator: 'REGEXP'
                }
            }
            steps {
                script {
                    if (BRANCH_NAME == BRANCH_DEV) {
                        remoteCmd = "\"cd /home/dev/visionlab/image-generation-wrapper/backend/dev && ./deploy.sh $VERSION\""

                        echo "Updating the Container on ${DEV_MACHINE_HOST} ${DEV_MACHINE_SSH_PORT} with cmd = \n ${remoteCmd}"
                        sshagent (credentials: [DEV_MACHINE_SSH_CREDENTIAL]) {
                          sh "ssh -o StrictHostKeyChecking=no -p ${DEV_MACHINE_SSH_PORT} -l dev ${DEV_MACHINE_HOST} ${remoteCmd}"
                        }
                    } else if (BRANCH_NAME == BRANCH_STAGING) {
                        remoteCmd = "\"cd /home/dev/visionlab/image-generation-wrapper/backend/stg && ./deploy.sh $VERSION\""

                        echo "Updating the Container on ${DEV_MACHINE_HOST} ${DEV_MACHINE_SSH_PORT} with cmd = \n ${remoteCmd}"
                        sshagent (credentials: [DEV_MACHINE_SSH_CREDENTIAL]) {
                          sh "ssh -o StrictHostKeyChecking=no -p ${DEV_MACHINE_SSH_PORT} -l dev ${DEV_MACHINE_HOST} ${remoteCmd}"
                        }
                    } else if (BRANCH_NAME == BRANCH_MASTER) {
                        echo 'Do Nothing on Master'
                    } else if ((BRANCH_NAME =~ 'release\\/.*').matches()) {
                        echo 'Release is not implemented yet'
                    } else if (BRANCH_NAME == BRANCH_OUTSOURCE) {
                        remoteCmd = "\"cd /home/dev/visionlab/image-generation-wrapper/backend/outsource && ./deploy.sh $VERSION\""

                        echo "Updating the Container on ${DEV_MACHINE_HOST} ${DEV_MACHINE_SSH_PORT} with cmd = \n ${remoteCmd}"
                        sshagent (credentials: [DEV_MACHINE_SSH_CREDENTIAL]) {
                          sh "ssh -o StrictHostKeyChecking=no -p ${DEV_MACHINE_SSH_PORT} -l dev ${DEV_MACHINE_HOST} ${remoteCmd}"
                        }
                    }
                }
            }
        }
    }
}
