import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class WebEnabledApiService {
  static const String baseUrl = 'http://localhost:8000/api';
  static const String tokenKey = 'admin_token';

  // Get stored token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }

  // Store token
  Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, token);
  }

  // Remove token
  Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
  }

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      // Prepare headers for web
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await setToken(data['token']);
        return data;
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Login failed');
      }
    } catch (e) {
      print('Login error: ${e.toString()}');
      throw Exception('Failed to connect to server: ${e.toString()}');
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      final token = await getToken();
      if (token != null) {
        final headers = {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        await http.post(
          Uri.parse('$baseUrl/logout'),
          headers: headers,
        );
      }
    } catch (e) {
      print('Logout error: ${e.toString()}');
    } finally {
      await removeToken();
    }
  }

  // Get user data
  Future<Map<String, dynamic>> getUser() async {
    try {
      final token = await getToken();
      if (token == null) throw Exception('Not authenticated');

      final headers = {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      final response = await http.get(
        Uri.parse('$baseUrl/user'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get user data');
      }
    } catch (e) {
      print('Get user error: ${e.toString()}');
      throw Exception('Failed to connect to server: ${e.toString()}');
    }
  }
} 