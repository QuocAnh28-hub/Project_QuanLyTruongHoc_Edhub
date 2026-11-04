import '../config/config.dart';
import 'di.dart' as di;

class LibBaseConfig extends Config {
  factory LibBaseConfig.getInstance() {
    return _instance;
  }

  LibBaseConfig._();

  static final LibBaseConfig _instance = LibBaseConfig._();

  @override
  Future<void> config() async {
    await di.configureInjection();
  }
}