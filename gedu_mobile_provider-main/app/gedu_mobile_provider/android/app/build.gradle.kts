plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.gedu_mobile_provider"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = "27.0.12077973"
    
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
            applicationId = "com.example.gedu_mobile_provider.dev"
            versionName = "1.0.0-dev"
            versionCode = 1
            buildConfigField("String", "FLAVOR", "\"development\"")
            buildConfigField("String", "APP_NAME", "\"Gedu Provider Dev\"")
            buildConfigField("String", "API_BASE_URL", "\"https://demo.lazeout.com\"")
            manifestPlaceholders["appName"] = "Gedu Provider Dev"
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher_dev"
            manifestPlaceholders["applicationName"] = "io.flutter.app.FlutterApplication"
        }
        
        create("staging") {
            dimension = "environment"
            applicationId = "com.example.gedu_mobile_provider.staging"
            versionName = "1.0.0-staging"
            versionCode = 1
            buildConfigField("String", "FLAVOR", "\"staging\"")
            buildConfigField("String", "APP_NAME", "\"Gedu Provider Staging\"")
            buildConfigField("String", "API_BASE_URL", "\"https://staging.lazeout.com\"")
            manifestPlaceholders["appName"] = "Gedu Provider Staging"
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher_staging"
            manifestPlaceholders["applicationName"] = "io.flutter.app.FlutterApplication"
        }
        
        create("production") {
            dimension = "environment"
            applicationId = "com.example.gedu_mobile_provider"
            versionName = "1.0.0"
            versionCode = 1
            buildConfigField("String", "FLAVOR", "\"production\"")
            buildConfigField("String", "APP_NAME", "\"Gedu Provider\"")
            buildConfigField("String", "API_BASE_URL", "\"https://api.lazeout.com\"")
            manifestPlaceholders["appName"] = "Gedu Provider"
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
    source = "../.."
}
