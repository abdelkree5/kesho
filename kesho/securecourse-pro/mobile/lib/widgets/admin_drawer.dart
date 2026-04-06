import 'package:flutter/material.dart';

class AdminDrawer extends StatelessWidget {
  const AdminDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Colors.blue, Colors.indigo]),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(radius: 28, backgroundColor: Colors.white, child: Icon(Icons.admin_panel_settings, color: Colors.blue)),
                  SizedBox(height: 16),
                  Text('Admin Console', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text('SecureCourse Pro', style: TextStyle(color: Colors.white70)),
                ],
              ),
            ),
            _buildTile(context, icon: Icons.dashboard, label: 'Dashboard', route: '/admin'),
            _buildTile(context, icon: Icons.vpn_key, label: 'Generate Codes', route: '/admin/generate-codes'),
            _buildTile(context, icon: Icons.book, label: 'Courses', route: '/admin/courses'),
            _buildTile(context, icon: Icons.video_collection, label: 'Videos', route: '/admin/videos'),
            _buildTile(context, icon: Icons.group, label: 'Users', route: '/admin/users'),
          ],
        ),
      ),
    );
  }

  Widget _buildTile(BuildContext context, {required IconData icon, required String label, required String route}) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      onTap: () {
        Navigator.of(context).pop();
        if (ModalRoute.of(context)?.settings.name != route) {
          Navigator.of(context).pushReplacementNamed(route);
        }
      },
    );
  }
}
