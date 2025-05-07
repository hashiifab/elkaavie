import 'api_service.dart';

/// Layanan autentikasi untuk mengelola login, logout, dan status autentikasi pengguna
/// Menggunakan ApiService untuk komunikasi dengan backend
class AuthService {
  // Singleton instance
  static final AuthService _instance = AuthService._internal();
  
  // Factory constructor
  factory AuthService() => _instance;
  
  // Internal constructor
  AuthService._internal();
  
  // Instance ApiService
  final ApiService _apiService = ApiService();
  
  // Data pengguna yang sedang login
  Map<String, dynamic>? _userData;
  
  // Getter untuk data pengguna
  Map<String, dynamic>? get userData => _userData;
  
  // Getter untuk status autentikasi
  Future<bool> get isAuthenticated async {
    final token = await _apiService.getToken();
    return token != null && await _apiService.isTokenValid();
  }
  
  /// Login dengan email dan password
  /// 
  /// Mengembalikan data pengguna jika berhasil
  /// Melempar exception jika gagal
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _apiService.post(
        'login',
        data: {
          'email': email,
          'password': password,
        },
      );
      
      // Periksa apakah pengguna adalah admin
      if (response['user']['role'] != 'admin') {
        await _apiService.removeToken();
        throw Exception('Unauthorized: Only admin users can access this application');
      }
      
      // Simpan token
      await _apiService.setToken(response['token']);
      
      // Simpan data pengguna
      _userData = response['user'];
      
      return response;
    } catch (e) {
      print('Login error: ${e.toString()}');
      throw Exception('Failed to login: ${e.toString()}');
    }
  }
  
  /// Logout pengguna
  /// 
  /// Menghapus token dan data pengguna
  Future<void> logout() async {
    try {
      await _apiService.post('logout');
    } catch (e) {
      print('Logout error: ${e.toString()}');
    } finally {
      // Hapus token dan data pengguna meskipun request gagal
      await _apiService.removeToken();
      _userData = null;
    }
  }
  
  /// Mendapatkan data pengguna yang sedang login
  /// 
  /// Mengembalikan data pengguna jika berhasil
  /// Melempar exception jika gagal
  Future<Map<String, dynamic>> getCurrentUser() async {
    try {
      if (_userData != null) return _userData!;
      
      final data = await _apiService.get('user');
      _userData = data;
      return data;
    } catch (e) {
      throw Exception('Failed to get user data: ${e.toString()}');
    }
  }
}