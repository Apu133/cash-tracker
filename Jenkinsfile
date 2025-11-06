pipeline {
    agent any

    tools {
        nodejs 'Node_25.1.0'
    }
    
    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        npm_config_cache = "${WORKSPACE}\\npm-cache"
    }

    options {
        timeout (time: 10, unit: 'MINUTES')
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
                        dir ("${BACKEND_DIR}") {
                            bat '''
                                echo "Installing Backend Dependencies..."
                                npm install --no-audit --no-fund --prefer-offline --progress=false
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
                        dir ("${FRONTEND_DIR}") {
                            bat '''
                                echo "Installing Frontend Dependencies..."
                                npm install --no-audit --no-fund --prefer-offline --progress=false
                                echo "Frontend Dependencies Installed Successfully."
                            '''
                        }
                    }    
                }
            }
        }

        stage ("Tests") {
            steps {
                bat '''
                    echo "Reached Testing Stage."
                '''
            }
        }

        stage ("Build") {
            parallel {
                stage ("Building Frontend") {
                    steps {
                        dir ("${FRONTEND_DIR}") {
                            bat '''
                                echo "Building the Frontend application"
                                npm run build
                            '''
                        }
                    }
                }
                // stage ("Building Backend") {
                    // steps {
                        // dir ("${BACKEND_DIR}") {
                            // bat '''
                                // echo "Building the application"
                                // npm start
                            // '''
                        // }
                    // }
                // }
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











