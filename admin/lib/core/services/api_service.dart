import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:typed_data';
import 'package:http_parser/http_parser.dart';

/// Layanan API untuk komunikasi dengan backend
/// Mengimplementasikan pola singleton untuk memastikan hanya ada satu instance
class ApiService {
  // Singleton instance
  static final ApiService _instance = ApiService._internal();
  
  // Factory constructor
  factory ApiService() => _instance;
  
  // Internal constructor
  ApiService._internal();
  
  // Token untuk autentikasi
  String? _token;
  
  // Data pengguna yang sedang login
  Map<String, dynamic>? userData;
  
  // Kunci untuk menyimpan token di SharedPreferences
  static const String tokenKey = 'admin_token';
  
  // Mendapatkan base URL berdasarkan platform
  static String get baseUrl => kIsWeb ? 'http://localhost:8000/api' : 'http://10.0.2.2:8000/api';
  
  // Getter untuk token
  String? get token => _token;
  
  // Mendapatkan token dari penyimpanan
  Future<String?> getToken() async {
    if (_token != null) return _token;
    
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(tokenKey);
    return _token;
  }
  
  // Menyimpan token
  Future<void> setToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, token);
  }
  
  // Menghapus token
  Future<void> removeToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
  }
  
  // Memeriksa apakah token valid
  Future<bool> isTokenValid() async {
    try {
      final headers = await _getAuthHeaders(skipErrorHandle: true);
      if (headers['Authorization'] == null) {
        return false;
      }
      
      final response = await http.get(
        Uri.parse('$baseUrl/user'),
        headers: headers,
      );
      
      return response.statusCode == 200;
    } catch (e) {
      print('Token validation error: $e');
      return false;
    }
  }
  
  // Mendapatkan header umum
  Map<String, String> getCommonHeaders({String? token}) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }
  
  // Mendapatkan header autentikasi
  Future<Map<String, String>> _getAuthHeaders({bool skipErrorHandle = false}) async {
    String? token = await getToken();
    
    // Membuat header dasar
    Map<String, String> headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    // Menambahkan token autentikasi jika ada
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    } else if (!skipErrorHandle) {
      throw Exception('Unauthorized: No token found');
    }
    
    return headers;
  }
  
  // Metode umum untuk melakukan request GET
  Future<dynamic> get(String endpoint) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/$endpoint'),
        headers: headers,
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to perform GET request: ${e.toString()}');
    }
  }
  
  // Metode umum untuk melakukan request POST
  Future<dynamic> post(String endpoint, {Map<String, dynamic>? data}) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/$endpoint'),
        headers: headers,
        body: data != null ? jsonEncode(data) : null,
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to perform POST request: ${e.toString()}');
    }
  }
  
  // Metode umum untuk melakukan request PUT
  Future<dynamic> put(String endpoint, {Map<String, dynamic>? data}) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/$endpoint'),
        headers: headers,
        body: data != null ? jsonEncode(data) : null,
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to perform PUT request: ${e.toString()}');
    }
  }
  
  // Metode umum untuk melakukan request DELETE
  Future<dynamic> delete(String endpoint) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/$endpoint'),
        headers: headers,
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to perform DELETE request: ${e.toString()}');
    }
  }
  
  // Menangani respons dari server
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {};
      return jsonDecode(response.body);
    } else if (response.statusCode == 401) {
      // Token tidak valid atau kedaluwarsa
      removeToken();
      throw Exception('Unauthorized: Please login again');
    } else {
      try {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Request failed with status: ${response.statusCode}');
      } catch (e) {
        throw Exception('Request failed with status: ${response.statusCode}');
      }
    }
  }
  
  // Upload file
  Future<dynamic> uploadFile(String endpoint, Uint8List fileBytes, String fileName, String fieldName, {String? mimeType}) async {
    try {
      final token = await getToken();
      if (token == null) throw Exception('Not authenticated');
      
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/$endpoint'));
      
      // Tambahkan header autentikasi
      request.headers['Authorization'] = 'Bearer $token';
      request.headers['Accept'] = 'application/json';
      
      // Tambahkan file
      request.files.add(
        http.MultipartFile.fromBytes(
          fieldName,
          fileBytes,
          filename: fileName,
          contentType: mimeType != null ? MediaType.parse(mimeType) : null,
        ),
      );
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to upload file: ${e.toString()}');
    }
  }
}