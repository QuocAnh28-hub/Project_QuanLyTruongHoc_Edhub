import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Message Tab - Hộp thư liên lạc Phụ huynh - Giáo viên & Nhà trường
class MessageTab extends StatefulWidget {
  const MessageTab({super.key});

  @override
  State<MessageTab> createState() => _MessageTabState();
}

class _MessageTabState extends State<MessageTab> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _conversations = [
    {
      'id': 'CHAT-01',
      'name': 'Cô Nguyễn Kiều Oanh',
      'role': 'Giáo viên Chủ nhiệm • Lớp 10A1',
      'subject': 'Toán học',
      'lastMessage': 'Dạ cô đã nhận được đơn xin phép của gia đình rồi ạ. Chúc con sớm bình phục nhé!',
      'time': '09:00',
      'unread': 2,
      'isOnline': true,
      'avatarColor': Colors.blue,
    },
    {
      'id': 'CHAT-02',
      'name': 'Thầy Ngô Vĩnh Hy',
      'role': 'Giáo viên Bộ môn • Tiếng Anh',
      'subject': 'Tiếng Anh',
      'lastMessage': 'Bài kiểm tra 15 phút vừa rồi của con làm rất tốt! Con phát âm chuẩn và tự tin lắm.',
      'time': 'Hôm qua',
      'unread': 1,
      'isOnline': false,
      'avatarColor': Colors.teal,
    },
    {
      'id': 'CHAT-03',
      'name': 'Thầy Nguyễn Văn Hùng',
      'role': 'Giáo viên Bộ môn • Vật lí',
      'subject': 'Vật lí',
      'lastMessage': 'Phụ huynh nhớ nhắc con chuẩn bị máy tính cầm tay mang theo trong các buổi học thực hành nhé.',
      'time': '02/11',
      'unread': 0,
      'isOnline': false,
      'avatarColor': Colors.indigo,
    },
    {
      'id': 'CHAT-04',
      'name': 'Phòng Y tế Học đường',
      'role': 'Cán bộ Y tế • THPT Nguyễn Siêu',
      'subject': 'Sức khỏe học đường',
      'lastMessage': 'Học sinh Trần Mỹ An đã được kiểm tra sức khỏe và thị lực định kỳ đầu năm học.',
      'time': '01/11',
      'unread': 0,
      'isOnline': true,
      'avatarColor': Colors.redAccent,
    },
    {
      'id': 'CHAT-05',
      'name': 'Điều phối Xe tuyến Đưa đón',
      'role': 'Phụ trách Xe Tuyến số 08',
      'subject': 'Dịch vụ đưa đón học sinh',
      'lastMessage': 'Xe số 08 đã đón học sinh lúc 07:10 tại điểm đón ngã tư Nguyễn Trãi.',
      'time': '31/10',
      'unread': 0,
      'isOnline': false,
      'avatarColor': Colors.orange,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Tin nhắn & Liên lạc',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_alt_1_outlined, color: AppColors.primary),
            tooltip: 'Liên hệ giáo viên mới',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Danh bạ toàn bộ Ban Giám hiệu và Giáo viên bộ môn Lớp 10A1'),
                  backgroundColor: AppColors.primary,
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search box
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Tìm kiếm thầy cô, môn học...',
                hintStyle: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                prefixIcon: const Icon(Icons.search, size: 20, color: AppColors.textSecondary),
                filled: true,
                fillColor: const Color(0xFFF1F3F4),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Conversation List
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: _conversations.length,
              separatorBuilder: (context, index) => const Divider(height: 1, indent: 76),
              itemBuilder: (context, index) {
                final item = _conversations[index];
                final hasUnread = (item['unread'] as int) > 0;

                return InkWell(
                  onTap: () {
                    context.push(
                      '/chat-detail',
                      extra: {
                        'teacherName': item['name'],
                        'role': item['role'],
                      },
                    );
                  },
                  child: Container(
                    color: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      children: [
                        // Avatar with online status badge
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 26,
                              backgroundColor: (item['avatarColor'] as Color).withValues(alpha: 0.15),
                              child: Text(
                                (item['name'] as String).split(' ').last[0],
                                style: TextStyle(
                                  color: item['avatarColor'] as Color,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                            if (item['isOnline'] as bool)
                              Positioned(
                                bottom: 0,
                                right: 0,
                                child: Container(
                                  width: 13,
                                  height: 13,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF137333),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: 2),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(width: 14),

                        // Chat preview info
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      item['name'],
                                      style: AppTypography.bodyMedium.copyWith(
                                        fontWeight: hasUnread ? FontWeight.bold : FontWeight.w600,
                                        color: AppColors.textPrimary,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    item['time'],
                                    style: AppTypography.bodySmall.copyWith(
                                      color: hasUnread ? AppColors.primary : AppColors.textSecondary,
                                      fontSize: 11,
                                      fontWeight: hasUnread ? FontWeight.bold : FontWeight.normal,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item['role'],
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                  fontSize: 11,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      item['lastMessage'],
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTypography.bodySmall.copyWith(
                                        color: hasUnread ? AppColors.textPrimary : AppColors.textSecondary,
                                        fontWeight: hasUnread ? FontWeight.w600 : FontWeight.normal,
                                      ),
                                    ),
                                  ),
                                  if (hasUnread) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: AppColors.primary,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Text(
                                        '${item['unread']}',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
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
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.edit, color: Colors.white),
        onPressed: () {
          context.push(
            '/chat-detail',
            extra: {
              'teacherName': 'Cô Nguyễn Kiều Oanh',
              'role': 'Giáo viên Chủ nhiệm • Lớp 10A1',
            },
          );
        },
      ),
    );
  }
}
