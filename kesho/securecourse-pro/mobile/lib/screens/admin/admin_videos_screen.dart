import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/admin_drawer.dart';

class AdminVideosScreen extends StatefulWidget {
  const AdminVideosScreen({super.key});

  @override
  State<AdminVideosScreen> createState() => _AdminVideosScreenState();
}

class _AdminVideosScreenState extends State<AdminVideosScreen> {
  final _formKey = GlobalKey<FormState>();
  final _courseIdController = TextEditingController();
  final _titleController = TextEditingController();
  final _urlController = TextEditingController();
  final _durationController = TextEditingController(text: '0');
  final _orderController = TextEditingController(text: '1');
  bool _isSaving = false;
  bool _loadingVideos = false;
  String? _error;
  List<Map<String, dynamic>> _videos = [];

  @override
  void dispose() {
    _courseIdController.dispose();
    _titleController.dispose();
    _urlController.dispose();
    _durationController.dispose();
    _orderController.dispose();
    super.dispose();
  }

  Future<void> _loadVideos() async {
    if (_courseIdController.text.isEmpty) return;
    setState(() {
      _loadingVideos = true;
      _error = null;
    });
    try {
      final apiService = ApiService();
      final videos = await apiService.getCourseVideos(int.parse(_courseIdController.text.trim()));
      setState(() {
        _videos = videos
            .map((video) => {
                  'id': video.id,
                  'title': video.title,
                  'duration': video.duration,
                  'order': video.order,
                })
            .toList();
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loadingVideos = false;
      });
    }
  }

  Future<void> _createVideo() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    try {
      final apiService = ApiService();
      final video = await apiService.createAdminVideo(
        int.parse(_courseIdController.text.trim()),
        _titleController.text.trim(),
        _urlController.text.trim(),
        int.parse(_durationController.text.trim()),
        int.parse(_orderController.text.trim()),
      );
      setState(() {
        _videos.insert(0, {
          'id': video['id'],
          'title': video['title'],
          'duration': video['duration'],
          'order': video['order'],
        });
      });
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Video created successfully')));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AdminDrawer(),
      appBar: AppBar(title: const Text('Videos Management')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add a new video', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _courseIdController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Course ID', border: OutlineInputBorder()),
                      validator: (value) => value == null || value.isEmpty ? 'Enter a course ID' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _titleController,
                      decoration: const InputDecoration(labelText: 'Video Title', border: OutlineInputBorder()),
                      validator: (value) => value == null || value.isEmpty ? 'Enter a video title' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _urlController,
                      decoration: const InputDecoration(labelText: 'Video URL', border: OutlineInputBorder()),
                      validator: (value) => value == null || value.isEmpty ? 'Enter a video URL' : null,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _durationController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Duration (sec)', border: OutlineInputBorder()),
                            validator: (value) => value == null || value.isEmpty ? 'Duration required' : null,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextFormField(
                            controller: _orderController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Order', border: OutlineInputBorder()),
                            validator: (value) => value == null || value.isEmpty ? 'Order required' : null,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isSaving ? null : _createVideo,
                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                        child: _isSaving ? const CircularProgressIndicator() : const Text('Add Video'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),
              const Text('Course videos', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _courseIdController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Course ID to load', border: OutlineInputBorder()),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _loadingVideos ? null : _loadVideos,
                    style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 24)),
                    child: _loadingVideos ? const CircularProgressIndicator() : const Text('Load Videos'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              if (_error != null)
                Text('Failed to load videos: $_error', style: const TextStyle(color: Colors.red))
              else if (_loadingVideos)
                const Center(child: CircularProgressIndicator())
              else if (_videos.isEmpty)
                const Padding(padding: EdgeInsets.symmetric(vertical: 20), child: Text('No videos loaded.'))
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _videos.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final video = _videos[index];
                    return Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      child: ListTile(
                        title: Text(video['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('Duration: ${video['duration']}s - Order ${video['order']}'),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}
