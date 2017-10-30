pipeline {
  agent any
  tools { nodejs 'node-v6.11.3' }

  parameters {
      choice(choices: 'TEST\nPRODUCTION', description: 'Where are you deploying to?', name: 'EXTENSION_DEPLOY_TARGET_PARAM')
  }

  environment { 
      EXTENSION_DEPLOY_TARGET = "${params.EXTENSION_DEPLOY_TARGET_PARAM}"
  }
    
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
      when {
          environment name: 'EXTENSION_DEPLOY_TARGET', value: 'PRODUCTION'
      }
      steps {
        echo "Start Deploy $EXTENSION_DEPLOY_TARGET"
      }
    }
    
    stage('Done') {
      steps {
        echo 'Done build'
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
