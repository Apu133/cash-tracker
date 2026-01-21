pipeline {
    agent { label 'windows' }

    tools {
        nodejs 'Node_25.3.0'
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

        stage('Tests') {
            steps {
                bat '''
                    cd backend
                    npm run test
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
                bat '''
                    docker push apu133/cash-tracker-backend:0.1 apu133/cash-tracker-frontend:0.1
                '''
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











