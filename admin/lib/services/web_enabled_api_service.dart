import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:typed_data';
import 'package:http_parser/http_parser.dart';
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;

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

  // Get common headers
  Future<Map<String, String>> _getAuthHeaders() async {
    final token = await getToken();
    if (token == null) throw Exception('Not authenticated');
    
    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
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
      final headers = await _getAuthHeaders();
      await http.post(
        Uri.parse('$baseUrl/logout'),
        headers: headers,
      );
    } catch (e) {
      print('Logout error: ${e.toString()}');
    } finally {
      await removeToken();
    }
  }

  // Get user data
  Future<Map<String, dynamic>> getUser() async {
    try {
      final headers = await _getAuthHeaders();
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
  
  // Get all users
  Future<List<dynamic>> getUsers() async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/users'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get users');
      }
    } catch (e) {
      print('Get users error: ${e.toString()}');
      throw Exception('Failed to get users: ${e.toString()}');
    }
  }
  
  // ROOMS API
  
  // Get all rooms
  Future<List<dynamic>> getRooms() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/rooms'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get rooms');
      }
    } catch (e) {
      print('Get rooms error: ${e.toString()}');
      throw Exception('Failed to get rooms: ${e.toString()}');
    }
  }
  
  // Get room details
  Future<Map<String, dynamic>> getRoom(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/rooms/$id'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get room details');
      }
    } catch (e) {
      print('Get room error: ${e.toString()}');
      throw Exception('Failed to get room details: ${e.toString()}');
    }
  }
  
  // Create room
  Future<Map<String, dynamic>> createRoom(Map<String, dynamic> roomData) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/rooms'),
        headers: headers,
        body: jsonEncode(roomData),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to create room');
      }
    } catch (e) {
      print('Create room error: ${e.toString()}');
      throw Exception('Failed to create room: ${e.toString()}');
    }
  }
  
  // Update room
  Future<Map<String, dynamic>> updateRoom(int id, Map<String, dynamic> roomData) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/rooms/$id'),
        headers: headers,
        body: jsonEncode(roomData),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to update room');
      }
    } catch (e) {
      print('Update room error: ${e.toString()}');
      throw Exception('Failed to update room: ${e.toString()}');
    }
  }
  
  // Delete room
  Future<void> deleteRoom(int id) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/rooms/$id'),
        headers: headers,
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to delete room');
      }
    } catch (e) {
      print('Delete room error: ${e.toString()}');
      throw Exception('Failed to delete room: ${e.toString()}');
    }
  }
  
  // BOOKINGS API
  
  // Get all bookings
  Future<List<dynamic>> getBookings() async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/bookings'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get bookings');
      }
    } catch (e) {
      print('Get bookings error: ${e.toString()}');
      throw Exception('Failed to get bookings: ${e.toString()}');
    }
  }
  
  // Get booking details
  Future<Map<String, dynamic>> getBooking(int id) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/bookings/$id'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get booking details');
      }
    } catch (e) {
      print('Get booking error: ${e.toString()}');
      throw Exception('Failed to get booking details: ${e.toString()}');
    }
  }
  
  // Update booking status
  Future<Map<String, dynamic>> updateBooking(int id, Map<String, dynamic> bookingData) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/bookings/$id'),
        headers: headers,
        body: jsonEncode(bookingData),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to update booking');
      }
    } catch (e) {
      print('Update booking error: ${e.toString()}');
      throw Exception('Failed to update booking: ${e.toString()}');
    }
  }
  
  // Delete booking
  Future<void> deleteBooking(int id) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/bookings/$id'),
        headers: headers,
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to delete booking');
      }
    } catch (e) {
      print('Delete booking error: ${e.toString()}');
      throw Exception('Failed to delete booking: ${e.toString()}');
    }
  }

  // Create room with image
  Future<Map<String, dynamic>> createRoomWithImage(Map<String, dynamic> roomData, Uint8List imageBytes, String filename) async {
    try {
      final headers = await _getAuthHeaders();
      
      // Remove auth header as we'll use a multipart request
      headers.remove('Authorization');
      
      final token = await getToken();
      if (token == null) throw Exception('Not authenticated');
      
      final uri = Uri.parse('$baseUrl/rooms');
      
      final request = http.MultipartRequest('POST', uri)
        ..headers.addAll({
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        })
        ..fields['name'] = roomData['name']
        ..fields['type'] = roomData['type']
        ..fields['price'] = roomData['price'].toString()
        ..fields['capacity'] = roomData['capacity'].toString()
        ..fields['description'] = roomData['description']
        ..fields['is_available'] = roomData['is_available'].toString();
      
      final multipartFile = http.MultipartFile.fromBytes(
        'image',
        imageBytes,
        filename: filename,
        contentType: MediaType('image', 'jpeg'),
      );
      
      request.files.add(multipartFile);
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to create room');
      }
    } catch (e) {
      print('Create room with image error: ${e.toString()}');
      throw Exception('Failed to create room with image: ${e.toString()}');
    }
  }
  
  // Update room with image
  Future<Map<String, dynamic>> updateRoomWithImage(int id, Map<String, dynamic> roomData, Uint8List? imageBytes, String? filename) async {
    try {
      final token = await getToken();
      if (token == null) throw Exception('Not authenticated');
      
      final uri = Uri.parse('$baseUrl/rooms/$id');
      
      final request = http.MultipartRequest('POST', uri) // Using POST with _method=PUT
        ..headers.addAll({
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        })
        ..fields['_method'] = 'PUT' // Laravel form method spoofing
        ..fields['name'] = roomData['name']
        ..fields['type'] = roomData['type']
        ..fields['price'] = roomData['price'].toString()
        ..fields['capacity'] = roomData['capacity'].toString()
        ..fields['description'] = roomData['description']
        ..fields['is_available'] = roomData['is_available'].toString();
      
      if (imageBytes != null && filename != null) {
        final multipartFile = http.MultipartFile.fromBytes(
          'image',
          imageBytes,
          filename: filename,
          contentType: MediaType('image', 'jpeg'),
        );
        
        request.files.add(multipartFile);
      }
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to update room');
      }
    } catch (e) {
      print('Update room with image error: ${e.toString()}');
      throw Exception('Failed to update room with image: ${e.toString()}');
    }
  }
} 