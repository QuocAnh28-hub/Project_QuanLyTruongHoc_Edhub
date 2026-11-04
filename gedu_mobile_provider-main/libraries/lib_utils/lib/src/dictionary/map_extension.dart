extension MapExtension on Map<String, dynamic> {
  Map<String, dynamic> compact() {
    removeWhere(
            (key, value) => (value is String) ? value.isEmpty : value == null);

    return this;
  }
}