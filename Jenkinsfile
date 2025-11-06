pipeline {
    agent any

    environment {
        NODE_VERSION = '24.2.0'
        GIT_URI = 'https://github.com/Apu133/cash-tracker.git'
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
    }
    stages {
        stage ("Checkout code") {
            steps {
                echo 'Checking out code...'
                git branch: 'main',
                git url: '$GIT_URI'
            }
        }

        stage ('Setting up Node') {
            steps {
                sh '''
                    . ~/.nvm/nvm.sh
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    node -v
                    npm -v
                '''
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
                            sh """
                                echo 'Installing Backend Dependencies...'
                                npm install
                            """
                        }
                    }
                }
                stage ("Frontend Dependencies") {
                    when {
                        expression { fileExists("${FRONTEND_DIR}/package.json") }
                    }
                    steps {
                        dir ('${FRONTEND_DIR}') {
                            sh """
                                echo 'Installing Frontend Dependencies...'
                                npm install
                            """
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
                            sh """
                                echo 'Running test on frontend side'
                                npm test
                            """
                        }
                    }
                }
                stage ("Backend Testing") {
                    when {
                        expression { fileExists('${BACKEND_DIR}/package.json') }
                    }
                    steps {
                        dir ('${BACKEND_DIR}') {
                            sh """
                                echo 'Running test on backend side'
                                npm test
                            """
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
                            sh """
                                echo 'Building the Frontend application'
                                npm run build
                            """
                        }
                    }
                }
                stage ("Building Backend") {
                    steps {
                        dir ('${BACKEND_DIR}') {
                            sh """
                                echo 'Building the application'
                                npm run build
                            """
                        }
                    }
                }
            }
            
        }
    }
    post {
        success {
            sh "echo 'Build Successful.'"
        }
        failure {
            sh "echo 'Build Failed.'"
        }
    }
}