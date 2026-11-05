import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// News Feed Tab - Bảng tin hoạt động & tin tức nhà trường
class NewsFeedTab extends StatefulWidget {
  const NewsFeedTab({super.key});

  @override
  State<NewsFeedTab> createState() => _NewsFeedTabState();
}

class _NewsFeedTabState extends State<NewsFeedTab> {
  int _selectedCategoryIndex = 0;

  final List<String> _categories = [
    'Tất cả',
    'Tin nổi bật',
    'Thành tích học sinh',
    'Hoạt động ngoại khóa',
    'Thông báo chung',
  ];

  final List<Map<String, dynamic>> _posts = [
    {
      'id': 'POST-01',
      'title': 'Vinh danh 25 Học sinh THPT Nguyễn Siêu Đạt giải Nhất, Nhì Kỳ thi Học sinh Giỏi cấp Thành phố 2026',
      'category': 'Thành tích học sinh',
      'categoryColor': Colors.amber,
      'date': 'Hôm nay lúc 08:30',
      'author': 'Ban Giám hiệu Nhà trường',
      'content': 'Sáng nay, trong buổi lễ chào cờ đầu tuần, nhà trường đã long trọng tổ chức vinh danh và trao học bổng khuyến học cho 25 học sinh xuất sắc đạt giải cao tại kỳ thi HSG cấp Thành phố năm học 2026 - 2027. Thành tích rực rỡ này khẳng định chất lượng đào tạo mũi nhọn của nhà trường.',
      'likes': 158,
      'comments': 24,
      'isLiked': false,
      'icon': Icons.emoji_events,
    },
    {
      'id': 'POST-02',
      'title': 'Khai mạc Hội khỏe Phù Đổng Năm học 2026 - 2027: Bùng nổ nhiệt huyết thể thao học đường',
      'category': 'Hoạt động ngoại khóa',
      'categoryColor': Colors.green,
      'date': '02/11/2026',
      'author': 'Đoàn Thanh niên Trường',
      'content': 'Hội khỏe Phù Đổng diễn ra với sự tham gia của hơn 1.200 vận động viên học sinh tranh tài ở 6 bộ môn: Bóng đá, Bóng rổ, Cầu lông, Bơi lội, Điền kinh và Kéo co. Chúc các tập thể lớp thi đấu hết mình với tinh thần đoàn kết và fair-play!',
      'likes': 92,
      'comments': 15,
      'isLiked': true,
      'icon': Icons.sports_basketball,
    },
    {
      'id': 'POST-03',
      'title': 'Ngày hội Khởi nghiệp Trẻ & Trải nghiệm Ứng dụng Trí tuệ Nhân tạo (AI) trong Học tập',
      'category': 'Tin nổi bật',
      'categoryColor': Colors.purple,
      'date': '29/10/2026',
      'author': 'Tổ Chuyên môn Tin học & STEM',
      'content': 'Hơn 20 gian hàng dự án công nghệ của các em học sinh khối 10 và 11 đã được trưng bày và thuyết trình bằng tiếng Anh trước hội đồng chuyên gia quốc tế. Các giải pháp về trường học xanh và trợ lý học tập AI được đánh giá rất cao.',
      'likes': 114,
      'comments': 19,
      'isLiked': false,
      'icon': Icons.smart_toy,
    },
    {
      'id': 'POST-04',
      'title': 'Phát động Phong trào "Trường học Hạnh phúc & Giữ gìn Môi trường Xanh - Sạch - Đẹp"',
      'category': 'Thông báo chung',
      'categoryColor': Colors.teal,
      'date': '25/10/2026',
      'author': 'Ban Chấp hành Công đoàn Trường',
      'content': 'Chiến dịch thu gom pin cũ, phân loại rác thải tại nguồn và trồng cây xanh ban công lớp học đã nhận được sự hưởng ứng nhiệt tình từ 100% các chi đoàn lớp. Mỗi hành động nhỏ tạo nên ngôi trường xanh bền vững.',
      'likes': 77,
      'comments': 8,
      'isLiked': false,
      'icon': Icons.eco,
    },
  ];

  void _showPostDetail(Map<String, dynamic> post) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.85,
          ),
          padding: const EdgeInsets.all(AppSpacing.space6x),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: (post['categoryColor'] as Color).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    post['category'],
                    style: TextStyle(
                      color: post['categoryColor'] as Color,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  post['title'],
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 12,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.account_circle_outlined, size: 16, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          post['author'],
                          style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.access_time, size: 16, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          post['date'],
                          style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
                const Divider(height: 24),
                Text(
                  post['content'],
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                    height: 1.6,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Đóng bài viết', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Bảng tin Trường học',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: Column(
        children: [
          // Category horizontal scroll
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: List.generate(_categories.length, (index) {
                  final isSelected = _selectedCategoryIndex == index;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      selected: isSelected,
                      label: Text(
                        _categories[index],
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 12,
                        ),
                      ),
                      backgroundColor: const Color(0xFFF1F3F4),
                      selectedColor: AppColors.primary,
                      checkmarkColor: Colors.white,
                      onSelected: (_) {
                        setState(() => _selectedCategoryIndex = index);
                      },
                    ),
                  );
                }),
              ),
            ),
          ),

          // News Feed list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(AppSpacing.space4x),
              itemCount: _posts.length,
              itemBuilder: (context, index) {
                final post = _posts[index];
                final isLiked = post['isLiked'] as bool;

                return GestureDetector(
                  onTap: () => _showPostDetail(post),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: AppSpacing.space4x),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Post Header banner
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: (post['categoryColor'] as Color).withValues(alpha: 0.08),
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: (post['categoryColor'] as Color).withValues(alpha: 0.2),
                                child: Icon(post['icon'] as IconData, color: post['categoryColor'] as Color, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      post['author'],
                                      style: AppTypography.bodySmall.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                    Text(
                                      post['date'],
                                      style: AppTypography.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: (post['categoryColor'] as Color).withValues(alpha: 0.3)),
                                ),
                                child: Text(
                                  post['category'],
                                  style: TextStyle(
                                    color: post['categoryColor'] as Color,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Post Content
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                post['title'],
                                style: AppTypography.titleSmall.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                  height: 1.3,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                post['content'],
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                  height: 1.4,
                                ),
                              ),
                              const SizedBox(height: 12),
                              const Divider(height: 1),
                              const SizedBox(height: 8),

                              // Like & Comment Row
                              Row(
                                children: [
                                  IconButton(
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                    icon: Icon(
                                      isLiked ? Icons.favorite : Icons.favorite_border,
                                      color: isLiked ? Colors.red : AppColors.textSecondary,
                                      size: 18,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        post['isLiked'] = !isLiked;
                                        post['likes'] = isLiked ? (post['likes'] as int) - 1 : (post['likes'] as int) + 1;
                                      });
                                    },
                                  ),
                                  const SizedBox(width: 4),
                                  Text('${post['likes']} yêu thích', style: AppTypography.bodySmall),
                                  const SizedBox(width: 12),
                                  const Icon(Icons.mode_comment_outlined, size: 16, color: AppColors.textSecondary),
                                  const SizedBox(width: 4),
                                  Text('${post['comments']}', style: AppTypography.bodySmall),
                                  const Spacer(),
                                  TextButton(
                                    style: TextButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    onPressed: () => _showPostDetail(post),
                                    child: const Text('Xem thêm', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
