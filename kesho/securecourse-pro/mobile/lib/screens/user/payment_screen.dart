import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../models/models.dart';
import '../../services/auth_service.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  PaymentInfo? _paymentInfo;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPaymentInfo();
  }

  Future<void> _loadPaymentInfo() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });
      final apiService = ApiService();
      final paymentInfo = await apiService.getPaymentInfo();
      setState(() {
        _paymentInfo = paymentInfo;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment Information'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Error: $_error'),
                      ElevatedButton(
                        onPressed: _loadPaymentInfo,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _paymentInfo == null
                  ? const Center(child: Text('No payment information available'))
                  : Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Choose your payment method:',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 20),
                          if (_paymentInfo!.vodafoneCash != null && _paymentInfo!.vodafoneCash!.isNotEmpty)
                            _buildPaymentMethod(
                              'Vodafone Cash',
                              _paymentInfo!.vodafoneCash!,
                              Icons.phone_android,
                              Colors.red,
                            ),
                          if (_paymentInfo!.instapay != null && _paymentInfo!.instapay!.isNotEmpty)
                            _buildPaymentMethod(
                              'InstaPay',
                              _paymentInfo!.instapay!,
                              Icons.account_balance,
                              Colors.blue,
                            ),
                          if (_paymentInfo!.fawry != null && _paymentInfo!.fawry!.isNotEmpty)
                            _buildPaymentMethod(
                              'Fawry',
                              _paymentInfo!.fawry!,
                              Icons.payment,
                              Colors.green,
                            ),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildPaymentMethod(String method, String value, IconData icon, Color color) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(icon, color: color, size: 40),
        title: Text(method, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(value, style: const TextStyle(fontSize: 16)),
        trailing: IconButton(
          icon: const Icon(Icons.copy),
          onPressed: () {
            // Copy to clipboard functionality can be added here
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('$method copied to clipboard')),
            );
          },
        ),
      ),
    );
  }
}