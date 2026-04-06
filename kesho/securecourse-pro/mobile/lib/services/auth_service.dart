import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'api_service.dart';
import '../models/models.dart';

class AuthService extends ChangeNotifier {
  final ApiService _apiService;
  final _storage = const FlutterSecureStorage();
  bool _isAuthenticated = false;
  bool _isAdmin = false;
  String? _userEmail;

  AuthService() : _apiService = ApiService() {
    _checkAuthStatus();
  }

  bool get isAuthenticated => _isAuthenticated;
  bool get isAdmin => _isAdmin;
  String? get userEmail => _userEmail;

  Future<void> _checkAuthStatus() async {
    final token = await _storage.read(key: 'access_token');
    final email = await _storage.read(key: 'user_email');
    final adminFlag = await _storage.read(key: 'is_admin');

    _isAuthenticated = token != null;
    _userEmail = email;
    _isAdmin = adminFlag == 'true' || _determineAdmin(email);
    notifyListeners();
  }

  bool _determineAdmin(String? email) {
    if (email == null) return false;
    final normalized = email.toLowerCase();
    if (normalized.contains('admin')) return true;
    return ApiService.adminEmails.contains(normalized);
  }

  Future<String> getDeviceId() async {
    final deviceInfo = DeviceInfoPlugin();
    final androidInfo = await deviceInfo.androidInfo;
    return androidInfo.id;
  }

  Future<String> getDeviceInfo() async {
    final deviceInfo = DeviceInfoPlugin();
    final androidInfo = await deviceInfo.androidInfo;
    return '${androidInfo.model} (${androidInfo.version.release})';
  }

  Future<void> register(String email, String password) async {
    final deviceId = await getDeviceId();
    final deviceInfo = await getDeviceInfo();

    final authResponse = await _apiService.register(email, password, deviceId, deviceInfo);

    await _storage.write(key: 'access_token', value: authResponse.accessToken);
    await _storage.write(key: 'refresh_token', value: authResponse.refreshToken);
    await _storage.write(key: 'user_email', value: email);
    await _storage.write(key: 'is_admin', value: _determineAdmin(email) ? 'true' : 'false');

    _isAuthenticated = true;
    _userEmail = email;
    _isAdmin = _determineAdmin(email);
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    final deviceId = await getDeviceId();

    final authResponse = await _apiService.login(email, password, deviceId);

    await _storage.write(key: 'access_token', value: authResponse.accessToken);
    await _storage.write(key: 'refresh_token', value: authResponse.refreshToken);
    await _storage.write(key: 'user_email', value: email);
    await _storage.write(key: 'is_admin', value: _determineAdmin(email) ? 'true' : 'false');

    _isAuthenticated = true;
    _userEmail = email;
    _isAdmin = _determineAdmin(email);
    notifyListeners();
  }

  Future<void> logout() async {
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'refresh_token');
    await _storage.delete(key: 'user_email');
    await _storage.delete(key: 'is_admin');
    _isAuthenticated = false;
    _isAdmin = false;
    _userEmail = null;
    notifyListeners();
  }

  Future<void> activateCode(String code) async {
    await _apiService.activateCode(code);
  }

  Future<void> refreshAccessToken() async {
    try {
      final authResponse = await _apiService.refreshToken();
      await _storage.write(key: 'access_token', value: authResponse.accessToken);
      await _storage.write(key: 'refresh_token', value: authResponse.refreshToken);
    } catch (e) {
      await logout();
      throw e;
    }
  }
}