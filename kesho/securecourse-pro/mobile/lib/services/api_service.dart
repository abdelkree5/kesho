import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/models.dart';

class ApiService {
  final String baseUrl = dotenv.env['API_BASE_URL'] ?? 'http://localhost:8000';
  final _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: 'access_token');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<AuthResponse> register(String email, String password, String deviceId, String deviceInfo) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'device_id': deviceId,
        'device_info': deviceInfo,
      }),
    );

    if (response.statusCode == 200) {
      return AuthResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  Future<AuthResponse> login(String email, String password, String deviceId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: {
        'email': email,
        'password': password,
        'device_id': deviceId,
      },
    );

    if (response.statusCode == 200) {
      return AuthResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  Future<AuthResponse> refreshToken() async {
    final refreshToken = await _storage.read(key: 'refresh_token');
    if (refreshToken == null) throw Exception('No refresh token');

    final response = await http.post(
      Uri.parse('$baseUrl/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh_token': refreshToken}),
    );

    if (response.statusCode == 200) {
      return AuthResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Token refresh failed');
    }
  }

  Future<void> activateCode(String code) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/courses/activate'),
      headers: headers,
      body: jsonEncode({'code': code}),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  Future<List<Course>> getCourses() async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/courses/'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Course.fromJson(json)).toList();
    } else {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  Future<List<Video>> getCourseVideos(int courseId) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/videos/course/$courseId'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Video.fromJson(json)).toList();
    } else {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  Future<Map<String, dynamic>> getVideoStream(int videoId) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/videos/$videoId/stream'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  Future<Map<String, dynamic>> getAdminStats() async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$baseUrl/admin/stats'), headers: headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw Exception(jsonDecode(response.body)['detail']);
  }

  Future<List<String>> generateAdminCodes(int courseId, int count) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/admin/codes/generate'),
      headers: headers,
      body: jsonEncode({'course_id': courseId, 'count': count}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<String>.from(data['codes'] as List<dynamic>);
    }
    throw Exception(jsonDecode(response.body)['detail']);
  }

  Future<dynamic> createAdminCourse(String title, String description, int price) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/admin/courses'),
      headers: headers,
      body: jsonEncode({'title': title, 'description': description, 'price': price}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception(jsonDecode(response.body)['detail']);
  }

  Future<dynamic> createAdminVideo(int courseId, String title, String url, int duration, int order) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/admin/videos'),
      headers: headers,
      body: jsonEncode({'course_id': courseId, 'title': title, 'url': url, 'duration': duration, 'order': order}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception(jsonDecode(response.body)['detail']);
  }

  Future<List<dynamic>> getAdminUsers() async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$baseUrl/admin/users'), headers: headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    throw Exception(jsonDecode(response.body)['detail']);
  }

  Future<PaymentInfo> getPaymentInfo() async {
    final response = await http.get(Uri.parse('$baseUrl/payment/info'));
    if (response.statusCode == 200) {
      return PaymentInfo.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load payment info');
    }
  }

  Future<void> updatePaymentSettings(String vodafoneCash, String instapay, String fawry) async {
    final headers = await _getHeaders();
    final response = await http.put(
      Uri.parse('$baseUrl/admin/payment/update'),
      headers: headers,
      body: jsonEncode({
        'vodafone_cash': vodafoneCash,
        'instapay': instapay,
        'fawry': fawry,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['detail']);
    }
  }

  static List<String> get adminEmails {
    final raw = dotenv.env['ADMIN_EMAILS'] ?? '';
    return raw.split(',').map((item) => item.trim().toLowerCase()).where((item) => item.isNotEmpty).toList();
  }
}
