pipeline {
    agent any

    tools {
        nodejs 'Node_25.1.0'
    }
    
    environment {
        // NODE_VERSION = '25.1.0'
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
    }

    options {
        timeout (time: 15, unit: 'MINUTES')
    }

    stages {
        stage ("Checkout code") {
            steps {
                echo 'Checking out code...'
                git branch: 'main',
                url: 'https://github.com/Apu133/cash-tracker.git'
            }
        }

        stage ("Installing Dependencies") {
            parallel {
                stage ("Backend Dependencies") {
                    when {
                        expression { fileExists("${BACKEND_DIR}/package.json") }
                    }
                    steps {
                        dir ('${BACKEND_DIR}') {
                            bat '''
                                echo "Installing Backend Dependencies..."
                                npm ci
                                echo "Backend Dependencies Installated Successfully."
                            '''
                        }
                    }
                }
                stage ("Frontend Dependencies") {
                    when {
                        expression { fileExists("${FRONTEND_DIR}/package.json") }
                    }
                    steps {
                        dir ('${FRONTEND_DIR}') {
                            bat '''
                                echo "Installing Frontend Dependencies..."
                                npm ci
                                echo "Frontend Dependencies Installed Successfully."
                            '''
                        }
                    }    
                }
            }
        }

        stage ("Tests") {
            parallel {
                stage ("Frontend Testing") {
                    when {
                        expression { fileExists('${FRONTEND_DIR}/package.json') }
                    }
                    steps {
                        dir ('${FRONTEND_DIR}') {
                            bat '''
                                echo "Running test on frontend side"
                                npm test
                            '''
                        }
                    }
                }
                stage ("Backend Testing") {
                    when {
                        expression { fileExists('${BACKEND_DIR}/package.json') }
                    }
                    steps {
                        dir ('${BACKEND_DIR}') {
                            bat '''
                                echo "Running test on backend side"
                                npm test
                            '''
                        }
                    }
                }
            }
        }

        stage ("Build") {
            parallel {
                stage ("Building Frontend") {
                    steps {
                        dir ('${FRONTEND_DIR}') {
                            bat '''
                                echo "Building the Frontend application"
                                npm run build
                            '''
                        }
                    }
                }
                stage ("Building Backend") {
                    steps {
                        dir ('${BACKEND_DIR}') {
                            bat '''
                                echo "Building the application"
                                npm run build
                            '''
                        }
                    }
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






