pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    options {
        timeout (time: 10, unit: 'MINUTES')
    }

    stages {
        stage("Checkout code") {
            steps {
                echo "Checking out code..."
                git branch: 'trial', url: 'https://github.com/Apu133/cash-tracker.git'
            }
        }

        stage('Installing frontend dependencies') {
            steps {
                sh '''
                    cd frontend
                    npm install
                    echo "Dependencies / packages installed successfully."
                    cd ..
                '''
            }
        }
        stage('Installing backend dependencies') {
            steps {
                sh '''
                    cd backend
                    npm install
                    echo "Dependencies / packages installed successfully."
                    cd ..
                '''
            }
        }

        stage('Build images') {
            steps {
                sh '''
                    docker compose build
                    echo "Docker images build successfully."
                '''
            }            
        }
        stage('Pushing images to dockerhub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                        docker push ${params.DOCKER_FRONT_IMAGE}:${params.IMAGE_TAG_FRONT}
                        docker push ${params.DOCKER_BACK_IMAGE}:${params.IMAGE_TAG_BACK}
                        echo "Pushed docker image to dockerhub"
                        docker logout
                        echo "Logging out of Dockerhub"
                    """
                }
            }
        }

        stage('Docker compose running') {
            steps {
                sh '''
                    docker compose up -d
                    echo "Docker compose is running."
                '''
            }
        }
    }
    post {
        success {
            sh 'echo "Application is live on port 3000."'
        }
        failure {
            sh 'echo "Build Failed."'
        }
    }

}