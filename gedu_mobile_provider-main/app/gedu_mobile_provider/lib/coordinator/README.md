# Coordinator and Router System

This directory contains the coordinator and router system for the GEDU Mobile Client application. The system provides a centralized way to manage navigation, feature coordination, and routing throughout the app.

## Architecture Overview

The coordinator system follows a hierarchical structure:

```
CoordinatorManager (Main Manager)
├── AppCoordinator (Main App Coordinator)
├── AuthCoordinator (Authentication Feature)
├── UserCoordinator (User Management Feature)
└── CourseCoordinator (Course Management Feature)
```

## Components

### 1. AppCoordinator (`app_coordinator.dart`)

The main application coordinator that manages:
- **Router Configuration**: Sets up GoRouter with all application routes
- **Authentication Redirects**: Handles route redirection based on authentication status
- **Global Navigation**: Provides methods for navigating to main app sections
- **UI Utilities**: Shows snackbars, dialogs, and other UI interactions

**Key Features:**
- Automatic authentication-based route redirection
- Centralized error handling
- Flavor-aware configuration
- Global navigation state management

### 2. Feature Coordinators

#### AuthCoordinator (`features/auth_coordinator.dart`)
Manages authentication-related navigation and operations:
- Login/logout flows
- Registration and password reset
- Authentication state management
- User data access

#### UserCoordinator (`features/user_coordinator.dart`)
Handles user profile and settings navigation:
- Profile management
- User preferences
- Settings navigation
- User data operations

#### CourseCoordinator (`features/course_coordinator.dart`)
Manages course-related navigation:
- Course listing and details
- Enrollment flows
- Progress tracking
- Quiz and certificate access

### 3. CoordinatorManager (`coordinator_manager.dart`)

The central manager that:
- Initializes all coordinators
- Provides unified access to all feature coordinators
- Manages global application state
- Handles cross-feature coordination

### 4. AppRoutes (`routes/app_routes.dart`)

Defines all application routes with:
- **Route Configuration**: Paths, names, and parameters
- **Feature Grouping**: Organized by feature modules
- **Type Safety**: Strongly typed route definitions
- **Parameter Support**: Dynamic route parameters

## Usage Examples

### Basic Navigation

```dart
// Get coordinator manager
final coordinatorManager = getIt.get<CoordinatorManager>();

// Navigate to different sections
coordinatorManager.goToHome();
coordinatorManager.goToProfile();
coordinatorManager.goToSettings();

// Feature-specific navigation
coordinatorManager.auth.goToLogin();
coordinatorManager.user.goToEditProfile();
coordinatorManager.course.goToCourseDetail('course-123');
```

### Authentication Handling

```dart
// Handle login success
coordinatorManager.onLoginSuccess();

// Handle login failure
coordinatorManager.onLoginFailure('Invalid credentials');

// Handle logout
coordinatorManager.onLogout();
```

### UI Interactions

```dart
// Show messages
coordinatorManager.showSnackBar('Operation successful!');
coordinatorManager.showSnackBar('Error occurred', isError: true);

// Show dialogs
final confirmed = await coordinatorManager.showDialog<bool>(
  title: 'Confirm Action',
  content: 'Are you sure?',
  confirmText: 'Yes',
  cancelText: 'No',
);
```

### Route Management

```dart
// Get current location
String currentPath = coordinatorManager.currentLocation;

// Check if can go back
if (coordinatorManager.canPop) {
  coordinatorManager.pop();
}

// Push new route
await coordinatorManager.push('/new-route');

// Replace current route
coordinatorManager.replace('/replacement-route');
```

## Route Configuration

### Main Routes
- `/` - Initial route (splash/loading)
- `/login` - Login page
- `/home` - Home page
- `/profile` - User profile
- `/settings` - App settings
- `/error` - Error page

### Auth Routes
- `/auth/logout` - Logout
- `/auth/register` - Registration
- `/auth/forgot-password` - Password reset
- `/auth/reset-password` - Password reset confirmation
- `/auth/verify-email` - Email verification

### User Routes
- `/user/edit-profile` - Edit profile
- `/user/change-password` - Change password
- `/user/settings` - User settings
- `/user/preferences` - User preferences

### Course Routes
- `/courses` - Course list
- `/courses/:id` - Course detail
- `/courses/:id/enroll` - Course enrollment
- `/courses/:id/progress` - Course progress
- `/courses/:id/content` - Course content
- `/courses/:id/quiz` - Course quiz
- `/courses/:id/certificate` - Course certificate

## Integration with DI

The coordinator system integrates with the dependency injection system:

```dart
// In your DI configuration
@injectable
class YourService {
  final CoordinatorManager _coordinatorManager;
  
  YourService(this._coordinatorManager);
  
  void someMethod() {
    _coordinatorManager.goToHome();
  }
}
```

## Benefits

1. **Centralized Navigation**: All navigation logic is centralized and consistent
2. **Type Safety**: Strongly typed routes and parameters
3. **Feature Isolation**: Each feature has its own coordinator
4. **Testability**: Easy to mock and test navigation flows
5. **Maintainability**: Clear separation of concerns
6. **Scalability**: Easy to add new features and routes
7. **Authentication Integration**: Automatic route protection
8. **Error Handling**: Centralized error management

## Best Practices

1. **Always use coordinators for navigation**: Don't use Navigator directly
2. **Use feature-specific coordinators**: Access auth, user, or course coordinators for feature-specific operations
3. **Handle errors gracefully**: Use the coordinator's error handling methods
4. **Keep routes organized**: Group routes by feature in AppRoutes
5. **Use type-safe navigation**: Leverage the strongly typed route system
6. **Test coordinator flows**: Write tests for navigation scenarios

## Migration from Old Navigation

To migrate from the old navigation system:

1. Replace `Navigator.pushNamed()` with `coordinatorManager.push()`
2. Replace `Navigator.pop()` with `coordinatorManager.pop()`
3. Replace `Navigator.pushReplacementNamed()` with `coordinatorManager.replace()`
4. Replace `ScaffoldMessenger.showSnackBar()` with `coordinatorManager.showSnackBar()`
5. Replace `showDialog()` with `coordinatorManager.showDialog()`

## Future Enhancements

- **Deep Linking**: Support for deep linking and URL handling
- **Route Guards**: More sophisticated route protection
- **Navigation History**: Track and manage navigation history
- **Analytics Integration**: Track navigation events
- **Offline Support**: Handle navigation when offline
- **Animation Support**: Custom transition animations 