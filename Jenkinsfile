pipeline {
    agent any

    environment {
        DOCKER_REPO = 'calculator-app'
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            script {
                                docker.build("${DOCKER_REPO}-backend:${BUILD_TAG}")
                            }
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            script {
                                docker.build("${DOCKER_REPO}-frontend:${BUILD_TAG}")
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy Using Docker Compose') {
            steps {
                sh """
                    docker-compose -f docker-compose.yml down || true
                    docker-compose -f docker-compose.yml up -d
                """
            }
        }
    }
    
    post {
        always {
            // Clean unused docker data
            sh 'docker system prune -f'
        }
    }
}
