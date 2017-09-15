pipeline {
  agent any
  tools { nodejs 'node-v6.11.3' }

  stages {
    stage('Checkout') {
      steps {
          checkout scm
      }
    }
    stage('Install dependencies') {
      steps {
        sh 'yarn install --ignore-engines'
      }
    }
    stage('Lint') {
      steps {
         echo 'ToDo'
      }
    }
    stage('Test') {
      steps {
          echo 'yarn run test'
      }
    }
    stage('Build') {
      steps {
        sh 'yarn run build'
      }
    }
    stage('Deploy') {
      steps {
          echo 'Deploying....'
      }
    }
  }
}