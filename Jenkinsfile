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
  post {
    // Always runs. And it runs before any of the other post conditions.
    always {
      // Let's wipe out the workspace before we finish!
      deleteDir()
    }

    success {
      slackSend channel: '#crew-extensions-build',
                color: 'good',
                message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."
    }

    failure {
      slackSend channel: '#crew-extensions-build',
                color: 'danger',
                message: "The pipeline ${currentBuild.fullDisplayName} has failed."

    }
  }

  // The options directive is for configuration that applies to the whole job.
  options {
    // For example, we'd like to make sure we only keep 10 builds at a time, so
    // we don't fill up our storage!
    buildDiscarder(logRotator(numToKeepStr:'10'))

    // And we'd really like to be sure that this build doesn't hang forever, so
    // let's time it out after an hour.
    timeout(time: 30, unit: 'MINUTES')
  }
}