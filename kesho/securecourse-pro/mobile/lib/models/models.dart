class User {
  final int id;
  final String email;
  final bool isActive;

  User({required this.id, required this.email, required this.isActive});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      isActive: json['is_active'],
    );
  }
}

class Course {
  final int id;
  final String title;
  final String? description;
  final int videosCount;

  Course({
    required this.id,
    required this.title,
    this.description,
    required this.videosCount,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      videosCount: json['videos_count'],
    );
  }
}

class Video {
  final int id;
  final String title;
  final int duration;
  final int order;

  Video({
    required this.id,
    required this.title,
    required this.duration,
    required this.order,
  });

  factory Video.fromJson(Map<String, dynamic> json) {
    return Video(
      id: json['id'],
      title: json['title'],
      duration: json['duration'],
      order: json['order'],
    );
  }
}

class AuthResponse {
  final String accessToken;
  final String refreshToken;

  AuthResponse({required this.accessToken, required this.refreshToken});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['access_token'],
      refreshToken: json['refresh_token'],
    );
  }
}

class PaymentInfo {
  final String? vodafoneCash;
  final String? instapay;
  final String? fawry;

  PaymentInfo({
    this.vodafoneCash,
    this.instapay,
    this.fawry,
  });

  factory PaymentInfo.fromJson(Map<String, dynamic> json) {
    return PaymentInfo(
      vodafoneCash: json['vodafone_cash'],
      instapay: json['instapay'],
      fawry: json['fawry'],
    );
  }
}