import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/admin_drawer.dart';

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  bool _isLoading = true;
  String? _error;
  List<Map<String, dynamic>> _users = [];

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final apiService = ApiService();
      final users = await apiService.getAdminUsers();
      setState(() {
        _users = users.map((user) => {
          'id': user['id'],
          'email': user['email'],
          'coursesCount': user['courses_count'],
          'devicesCount': user['devices_count'],
        }).toList();
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AdminDrawer(),
      appBar: AppBar(title: const Text('Users')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text('Failed to load users: $_error'))
                : ListView.separated(
                    itemCount: _users.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final user = _users[index];
                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                        child: ListTile(
                          title: Text(user['email'], style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('Courses: ${user['coursesCount']} • Devices: ${user['devicesCount']}'),
                          leading: CircleAvatar(child: Text(user['id'].toString())),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
