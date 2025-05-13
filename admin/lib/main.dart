import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'services/web_enabled_api_service.dart';

class AppColors {
  static const Color primary = Color(0xFF1A237E);
  static const Color primaryLight = Color(0xFF534BAE);
  static const Color primaryDark = Color(0xFF000051);

  static const Color secondary = Color(0xFF0277BD);
  static const Color secondaryLight = Color(0xFF58A5F0);
  static const Color secondaryDark = Color(0xFF004C8C);

  static const Color accent = Color(0xFF00ACC1);
  static const Color accentLight = Color(0xFF5DBCD2);
  static const Color accentDark = Color(0xFF007C91);

  static const Color success = Color(0xFF2E7D32);
  static const Color warning = Color(0xFFF57C00);
  static const Color error = Color(0xFFD32F2F);
  static const Color info = Color(0xFF0288D1);

  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color divider = Color(0xFFBDBDBD);
}

void main() {
  PaintingBinding.shaderWarmUp = null;
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Elkaavie Admin',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
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
        useMaterial3: true,
        textTheme: GoogleFonts.poppinsTextTheme(
          ThemeData.light().textTheme,
        ).apply(
          bodyColor: AppColors.textPrimary,
          displayColor: AppColors.textPrimary,
        ),
        scaffoldBackgroundColor: AppColors.background,
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 2,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8)),
            ),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
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
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  final _apiService = WebEnabledApiService();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    try {
      final token = await _apiService.getToken();
      if (mounted) {
        if (token != null) {
          try {
            await _apiService.getUser();
          } catch (_) {
            await _apiService.removeToken();
          }
        }
        setState(() => _isLoading = false);
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }

    return FutureBuilder<String?>(
      future: _apiService.getToken(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            backgroundColor: AppColors.background,
            body: Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            ),
          );
        }

        return snapshot.hasData
            ? const DashboardScreen()
            : const LoginScreen();
      },
    );
  }
}
