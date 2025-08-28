pipeline {
    agent any
    
    environment {
        DOCKER_REPO = 'calculator-app'
        NODE_VERSION = '18'
        SONARQUBE_SERVER = 'SonarQube'  // Replace with your SonarQube server name
    }
    
    tools {
        nodejs "${NODE_VERSION}"
        dockerTool 'docker'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_HASH = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.BUILD_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_HASH}"
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        // stage('Lint and Code Quality') {
        //     parallel {
        //         stage('Backend Lint') {
        //             steps {
        //                 dir('backend') {
        //                     sh 'npm run lint || true'  // Don't fail build on lint errors
        //                 }
        //             }
        //         }
        //         stage('Frontend Lint') {
        //             steps {
        //                 dir('frontend') {
        //                     sh 'npm run lint || true'
        //                 }
        //             }
        //         }
        //     }
        // }
        
        // stage('Unit Tests') {
        //     parallel {
        //         stage('Backend Tests') {
        //             steps {
        //                 dir('backend') {
        //                     sh 'npm test'
        //                 }
        //             }
        //             post {
        //                 always {
        //                     publishTestResults testResultsPattern: 'backend/coverage/lcov.info'
        //                 }
        //             }
        //         }
        //         stage('Frontend Tests') {
        //             steps {
        //                 dir('frontend') {
        //                     sh 'npm test'
        //                 }
        //             }
        //             post {
        //                 always {
        //                     publishTestResults testResultsPattern: 'frontend/coverage/lcov.info'
        //                 }
        //             }
        //         }
        //     }
        // }
        
        // stage('Security Scan') {
        //     parallel {
        //         stage('Backend Security') {
        //             steps {
        //                 dir('backend') {
        //                     sh 'npm audit --audit-level=high'
        //                 }
        //             }
        //         }
        //         stage('Frontend Security') {
        //             steps {
        //                 dir('frontend') {
        //                     sh 'npm audit --audit-level=high'
        //                 }
        //             }
        //         }
        //     }
        // }
        
        // stage('SonarQube Analysis') {
        //     steps {
        //         script {
        //             def scannerHome = tool 'SonarQubeScanner'
        //             withSonarQubeEnv("${SONARQUBE_SERVER}") {
        //                 sh """
        //                     ${scannerHome}/bin/sonar-scanner \\
        //                     -Dsonar.projectKey=calculator-app \\
        //                     -Dsonar.sources=. \\
        //                     -Dsonar.exclusions=**/node_modules/**,**/coverage/** \\
        //                     -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
        //                 """
        //             }
        //         }
        //     }
        // }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = docker.build("${DOCKER_REPO}-backend:${BUILD_TAG}")
                                // No push to registry
                            }
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            script {
                                def frontendImage = docker.build("${DOCKER_REPO}-frontend:${BUILD_TAG}")
                                // No push to registry
                            }
                        }
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                script {
                    sh """
                        docker-compose -f docker-compose.yml up -d
                        sleep 30  # Wait for services to be ready
                    """

                    sh """
                        curl -f http://localhost:5000/api/health || exit 1
                        curl -f http://localhost/api/health || exit 1
                    """

                    dir('backend') {
                        sh 'npm run test:integration || true'
                    }

                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh """
                        docker-compose -f docker-compose.prod.yml down || true
                        docker-compose -f docker-compose.prod.yml pull
                        docker-compose -f docker-compose.prod.yml up -d
                    """
                    sleep(time: 30, unit: "SECONDS")
                    sh 'curl -f http://localhost:5000/api/health'
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                script {
                    sshagent(['production-server-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no user@production-server '
                                cd /opt/calculator-app &&
                                docker-compose -f docker-compose.prod.yml down &&
                                docker-compose -f docker-compose.prod.yml pull &&
                                docker-compose -f docker-compose.prod.yml up -d
                            '
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f'
            archiveArtifacts artifacts: '**/coverage/**', allowEmptyArchive: true
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'backend/coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Backend Coverage Report'
            ])
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'frontend/coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Frontend Coverage Report'
            ])
        }
        // success {
        //     slackSend channel: '#deployments',
        //               color: 'good',
        //               message: "✅ Calculator App deployment successful - Build #${env.BUILD_NUMBER}"
        // }
        // failure {
        //     slackSend channel: '#deployments',
        //               color: 'danger',
        //               message: "❌ Calculator App deployment failed - Build #${env.BUILD_NUMBER}"
        // }
    }
}



