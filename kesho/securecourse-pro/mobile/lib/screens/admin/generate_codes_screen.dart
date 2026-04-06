import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/admin_drawer.dart';

class GenerateCodesScreen extends StatefulWidget {
  const GenerateCodesScreen({super.key});

  @override
  State<GenerateCodesScreen> createState() => _GenerateCodesScreenState();
}

class _GenerateCodesScreenState extends State<GenerateCodesScreen> {
  final _formKey = GlobalKey<FormState>();
  final _courseIdController = TextEditingController();
  final _countController = TextEditingController(text: '3');
  bool _isLoading = false;
  List<String> _codes = [];
  String? _message;

  @override
  void dispose() {
    _courseIdController.dispose();
    _countController.dispose();
    super.dispose();
  }

  Future<void> _generateCodes() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _message = null;
    });
    try {
      final apiService = ApiService();
      final response = await apiService.generateAdminCodes(int.parse(_courseIdController.text.trim()), int.parse(_countController.text.trim()));
      setState(() {
        _codes = response;
        _message = 'Generated ${_codes.length} codes successfully.';
      });
    } catch (e) {
      setState(() {
        _message = e.toString();
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
      appBar: AppBar(title: const Text('Generate Codes')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Generate Activation Codes', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Create secure activation codes for an existing course.', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _courseIdController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Course ID', border: OutlineInputBorder()),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Enter a valid course ID';
                      if (int.tryParse(value) == null) return 'Course ID must be a number';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _countController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Number of codes', border: OutlineInputBorder()),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Enter the number of codes';
                      final count = int.tryParse(value);
                      if (count == null || count < 1) return 'Count must be at least 1';
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _generateCodes,
                      style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                      child: _isLoading ? const CircularProgressIndicator() : const Text('Generate Codes'),
                    ),
                  ),
                ],
              ),
            ),
            if (_message != null) ...[
              const SizedBox(height: 24),
              Text(_message!, style: TextStyle(color: _codes.isEmpty ? Colors.red : Colors.green)),
            ],
            if (_codes.isNotEmpty) ...[
              const SizedBox(height: 24),
              const Text('Generated Codes', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
                child: Column(
                  children: _codes.map((code) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      children: [
                        Expanded(child: Text(code, style: const TextStyle(fontWeight: FontWeight.w500))),
                        IconButton(
                          icon: const Icon(Icons.copy),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code copied')));
                          },
                        )
                      ],
                    ),
                  )).toList(),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
