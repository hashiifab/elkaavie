import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'services/web_enabled_api_service.dart';

/// Centralized color palette for consistent UI theming across the app
/// Follows a material design color scheme with primary, secondary, and accent colors
class AppColors {
  // Primary colors - deep indigo color theme
  static const Color primary = Color(0xFF1A237E); // Deep indigo
  static const Color primaryLight = Color(0xFF534BAE);
  static const Color primaryDark = Color(0xFF000051);
  
  // Secondary colors - light blue accents
  static const Color secondary = Color(0xFF0277BD); // Light blue
  static const Color secondaryLight = Color(0xFF58A5F0);
  static const Color secondaryDark = Color(0xFF004C8C);
  
  // Accent colors - cyan for highlighting
  static const Color accent = Color(0xFF00ACC1); // Cyan
  static const Color accentLight = Color(0xFF5DBCD2);
  static const Color accentDark = Color(0xFF007C91);
  
  // Status colors for notifications and alerts
  static const Color success = Color(0xFF2E7D32); // Green
  static const Color warning = Color(0xFFF57C00); // Orange
  static const Color error = Color(0xFFD32F2F); // Red
  static const Color info = Color(0xFF0288D1); // Blue
  
  // Neutral colors for backgrounds and text
  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color divider = Color(0xFFBDBDBD);
}

/// Application entry point - sets up the Flutter app
void main() {
   // Disable shader warm-up for faster startup
  PaintingBinding.shaderWarmUp = null;
  runApp(const MyApp());
}

/// Main application widget - sets up theme and initial route
/// Configures material design theme using consistent color palette
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Elkaavie Admin',
      debugShowCheckedModeBanner: false, // Remove debug banner
      theme: ThemeData(
        // Define app-wide color scheme based on AppColors
        colorScheme: ColorScheme.light(
          primary: AppColors.primary,
          onPrimary: Colors.white,
          primaryContainer: AppColors.primaryLight,
          onPrimaryContainer: Colors.white,
          secondary: AppColors.secondary,
          onSecondary: Colors.white,
          secondaryContainer: AppColors.secondaryLight,
          onSecondaryContainer: Colors.white,
          tertiary: AppColors.accent,
          onTertiary: Colors.white,
          tertiaryContainer: AppColors.accentLight,
          onTertiaryContainer: Colors.white,
          error: AppColors.error,
          onError: Colors.white,
          surface: AppColors.surface,
          onSurface: AppColors.textPrimary,
        ),
        useMaterial3: true, // Use Material 3 design system
        // Configure Poppins as the app font
        textTheme: GoogleFonts.poppinsTextTheme(
          ThemeData.light().textTheme,
        ).apply(
          bodyColor: AppColors.textPrimary,
          displayColor: AppColors.textPrimary,
        ),
        // App bar styling
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        // Elevated button styling
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 2,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        // Text button styling
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
        // Input field styling
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: AppColors.divider),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: AppColors.divider),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: AppColors.primary, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: AppColors.error),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
      ),
      // Start with authentication wrapper that checks login state
      home: const AuthWrapper(),
    );
  }
}

/// Authentication wrapper component
/// Handles token validation and routes to appropriate screen based on auth status
class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

/// AuthWrapper state - manages authentication check logic
/// Determines whether to show login screen or dashboard based on token validity
class _AuthWrapperState extends State<AuthWrapper> {
  final _apiService = WebEnabledApiService();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    // Check authentication state when component mounts
    _checkAuth();
  }

  /// Verifies if user has a valid authentication token
  /// Attempts to get user data with the token to confirm it's still valid
  Future<void> _checkAuth() async {
    try {
      final token = await _apiService.getToken();
      if (mounted) {
        if (token != null) {
          // Verify token by getting user data - if this fails, token is invalid
          try {
            await _apiService.getUser();
          } catch (e) {
            // Token is invalid, remove it from storage
            await _apiService.removeToken();
          }
          setState(() => _isLoading = false);
        } else {
          setState(() => _isLoading = false);
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Show loading indicator while checking authentication
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // Check for token and render appropriate screen
    return FutureBuilder<String?>(
      future: _apiService.getToken(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        // If token exists, show dashboard; otherwise show login screen
        return snapshot.hasData ? const DashboardScreen() : const LoginScreen();
      },
    );
  }
}
