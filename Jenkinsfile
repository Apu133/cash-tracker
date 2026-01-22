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
                git branch: 'features',
                url: 'https://github.com/Apu133/cash-tracker.git'
            }
        }

        stage('Installing frontend dependencies') {
            steps {
                bat '''
                    cd frontend
                    npm install
                    echo "Dependencies / packages installed successfully."
                    cd ..
                '''
            }
        }
        stage('Installing backend dependencies') {
            steps {
                bat '''
                    cd backend
                    npm install
                    echo "Dependencies / packages installed successfully."
                    cd ..
                '''
            }
        }

        stage('Build images') {
            steps {
                bat '''
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
                    bat '''
                        docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                        docker push apu133/cash-tracker-backend:0.1 
                        docker push apu133/cash-tracker-frontend:0.1
                        echo "Pushed images to dockerhub."
                        docker logout
                        echo "Logging out of the dockerhub..."
                    '''
                }
            }
        }
    }
    post {
        success {
            bat 'echo "Build Successful."'
        }
        failure {
            bat 'echo "Build Failed."'
        }
    }

}