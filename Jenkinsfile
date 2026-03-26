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
                git branch: 'features', url: 'https://github.com/Apu133/cash-tracker.git'
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
        stage('Pushing docker images to dockerhub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push apu133/cash-tracker-backend:0.1 
                        docker push apu133/cash-tracker-frontend:0.3
                        echo "Pushed images to dockerhub."
                        docker logout
                        echo "Logging out of the dockerhub..."
                    '''
                }
            }
        }
        stage('Starting kubernetes deployments and services via helm') {
            steps {
                sh '''
                    helm install cash-track-release ./cash-tracker-chart
                '''
            }
        }
    }
    post {
        success {
            sh 'echo "Application is live on port 30001."'
        }
        failure {
            sh 'echo "Build Failed."'
        }
    }

}