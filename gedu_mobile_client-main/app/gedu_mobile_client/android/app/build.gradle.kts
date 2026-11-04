plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.gedu.gedu_mobile_client"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = "28.2.13676358"
    
    buildFeatures {
        buildConfig = true
    }
    
    defaultConfig {
        minSdk = 24
        targetSdk = 36
    }
    
    experimentalProperties["android.ndk.suppressMinSdkVersionError"] = 24

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    flavorDimensions += "environment"

    productFlavors {
        create("development") {
            dimension = "environment"
            applicationId = "com.gedu.app.dev"
            versionName = "1.0.0-dev"
            versionCode = 1
            buildConfigField("String", "FLAVOR", "\"development\"")
            buildConfigField("String", "APP_NAME", "\"Gedu Dev\"")
            buildConfigField("String", "API_BASE_URL", "\"https://demo.lazeout.com\"")
            manifestPlaceholders["appName"] = "Gedu Dev"
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher_dev"
            manifestPlaceholders["applicationName"] = "io.flutter.app.FlutterApplication"
        }
        
        create("staging") {
            dimension = "environment"
            applicationId = "com.gedu.app.staging"
            versionName = "1.0.0-staging"
            versionCode = 1
            buildConfigField("String", "FLAVOR", "\"staging\"")
            buildConfigField("String", "APP_NAME", "\"Gedu Staging\"")
            buildConfigField("String", "API_BASE_URL", "\"https://staging.lazeout.com\"")
            manifestPlaceholders["appName"] = "Gedu Staging"
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher_staging"
            manifestPlaceholders["applicationName"] = "io.flutter.app.FlutterApplication"
        }
        
        create("production") {
            dimension = "environment"
            applicationId = "com.gedu.app"
            versionName = "1.0.0"
            versionCode = 1
            buildConfigField("String", "FLAVOR", "\"production\"")
            buildConfigField("String", "APP_NAME", "\"Gedu\"")
            buildConfigField("String", "API_BASE_URL", "\"https://api.lazeout.com\"")
            manifestPlaceholders["appName"] = "Gedu"
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher"
            manifestPlaceholders["applicationName"] = "io.flutter.app.FlutterApplication"
        }
    }

    buildTypes {
        debug {
            isDebuggable = true
            isMinifyEnabled = false
        }
        
        release {
            isDebuggable = false
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    // Flutter source will use default path
}
