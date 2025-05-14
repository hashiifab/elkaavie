import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:typed_data';
import 'package:http_parser/http_parser.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class WebEnabledApiService {
  String? _token;
  Map<String, dynamic>? userData;

  // Get the appropriate base URL based on platform
  String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8000/api';
    } else {
      // For Android emulator, use 10.0.2.2 instead of localhost
      return 'http://10.0.2.2:8000/api';
    }
  }

  // Add token getter
  String? get token => _token;

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

  // Helper method to check if token is expired or invalid
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

  // Get auth headers with option to skip error handling
  Future<Map<String, String>> _getAuthHeaders({bool skipErrorHandle = false}) async {
    String? token = await getToken();

    // Create base headers
    Map<String, String> headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    // Add auth token if exists
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
      // Store token in memory for faster access
      _token = token;
    } else if (!skipErrorHandle) {
      throw Exception('Unauthorized: No token found');
    }

    return headers;
  }

  // Login
  Future<void> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Check if user is admin
        if (data['user']['role'] != 'admin') {
          throw Exception('Unauthorized: Admin access required');
        }

        userData = data['user'];
        // Store token in memory
        _token = data['token'];
        // Store token and user data in persistent storage
        await setToken(data['token']);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userData', jsonEncode(data['user']));
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Failed to login');
      }
    } catch (e) {
      throw Exception('Failed to login: $e');
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      // Get token directly to ensure it's fresh
      final token = await getToken();
      if (token != null) {
        await http.post(
          Uri.parse('$baseUrl/logout'),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
      }

      // Clear the token from storage and memory
      _token = null;
      userData = null;
      await removeToken();
    } catch (e) {
      // Still clear the token even if the API call fails
      _token = null;
      userData = null;
      await removeToken();
      throw Exception('Failed to logout: $e');
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
        final data = jsonDecode(response.body);
        userData = data;
        return data;
      } else {
        throw Exception('Failed to get user data');
      }
    } catch (e) {
      throw Exception('Failed to get user data: $e');
    }
  }

  // Get all users
  Future<List<dynamic>> getUsers() async {
    try {
      // Get token directly to ensure it's fresh
      final token = await getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      print('Using token for users request: $token');

      final response = await http.get(
        Uri.parse('$baseUrl/users'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        print('Users response: $responseData');
        if (responseData['data'] != null) {
          return responseData['data'];
        } else {
          throw Exception('Invalid response format');
        }
      } else {
        print('Error response: ${response.body}');
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Failed to get users');
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

  // Delete room functionality removed to avoid ambiguity
  // Rooms should be managed through availability toggles instead of deletion

  // BOOKINGS API

  // Helper method to format image URLs
  String formatImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http')) return path;
    // Extract filename from path
    final filename = path.split('/').last;
    // Use the API endpoint to serve the image
    return '$baseUrl/identity-cards/$filename';
  }

  // Get all bookings
  Future<List<dynamic>> getBookings() async {
    try {
      final headers = await _getAuthHeaders();

      print('Getting bookings...');
      final response = await http.get(
        Uri.parse('$baseUrl/bookings'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        print('Got bookings successfully');
        final responseData = jsonDecode(response.body);

        // Handle Laravel API response format
        if (responseData is Map) {
          if (responseData.containsKey('data')) {
            final data = responseData['data'];
            if (data is List) {
              // Format image URLs in the list
              return data.map((booking) {
                if (booking is Map) {
                  if (booking.containsKey('identity_card')) {
                    booking['identity_card'] = formatImageUrl(booking['identity_card']);
                  }
                }
                return booking;
              }).toList();
            } else if (data is Map) {
              // Format image URL for single booking
              if (data.containsKey('identity_card')) {
                data['identity_card'] = formatImageUrl(data['identity_card']);
              }
              return [data];
            }
          }
        }

        // If we get here, something unexpected happened
        print('Unexpected response format: $responseData');
        throw Exception('Unexpected response format from server');
      } else {
        final error = response.body;
        print('Error getting bookings: $error');
        throw Exception('Failed to get bookings: ${response.statusCode}');
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
  Future<Map<String, dynamic>> updateBookingStatus(String bookingId, String status) async {
    final token = await getToken();
    if (token == null) {
      throw Exception('No authentication token found');
    }
    print('Using token for status update: $token');

    final response = await http.put(
      Uri.parse('$baseUrl/bookings/$bookingId/status'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'status': status}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print('Successfully updated booking status: $data');
      return data;
    } else {
      print('Error updating booking status: ${response.body}');
      throw Exception('Failed to update booking status: ${response.body}');
    }
  }

  // Delete booking functionality removed to avoid ambiguity
  // Bookings should be managed through status changes (cancelled, rejected, etc.)
  // rather than being deleted from the system

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

  // Toggle room availability
  Future<bool> toggleRoomAvailability(int id) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/rooms/$id/toggle-availability'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['is_available'] ?? false;
      } else {
        throw Exception('Failed to toggle room availability');
      }
    } catch (e) {
      print('Toggle room availability error: $e');
      throw Exception('Failed to toggle room availability: $e');
    }
  }

  Future<void> updateRoomPrice(int id, int price) async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/rooms/$id'),
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'price': price,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update room price');
      }
    } catch (e) {
      print('Update room price error: $e');
      throw Exception('Failed to update room price: $e');
    }
  }

  Future<void> initializeRooms() async {
    try {
      // No longer requires authentication headers
      final response = await http.post(
        Uri.parse('$baseUrl/rooms/initialize'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode != 200) {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Failed to initialize rooms');
      }
    } catch (e) {
      print('Initialize rooms error: $e');
      throw Exception('Failed to initialize rooms: $e');
    }
  }

  // Add a method to check if rooms are already initialized
  Future<bool> hasRoomsInitialized() async {
    try {
      final rooms = await getRooms();
      return rooms.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  // Update booking payment due date
  Future<Map<String, dynamic>> updateBookingPaymentDue(String bookingId, DateTime? dueDate) async {
    final token = await getToken();
    if (token == null) {
      throw Exception('No authentication token found');
    }
    print('Using token for payment due update: $token');

    final response = await http.post(
      Uri.parse('$baseUrl/bookings/$bookingId/payment-due'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'payment_due_at': dueDate?.toIso8601String()}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update payment due date: ${response.body}');
    }
  }

  // Get common headers
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
}