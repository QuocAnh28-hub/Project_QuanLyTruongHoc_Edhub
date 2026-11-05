import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Chat chi tiết giữa Phụ huynh và Giáo viên
class ChatDetailPage extends StatefulWidget {
  final String? teacherName;
  final String? role;

  const ChatDetailPage({
    super.key,
    this.teacherName,
    this.role,
  });

  @override
  State<ChatDetailPage> createState() => _ChatDetailPageState();
}

class _ChatDetailPageState extends State<ChatDetailPage> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<Map<String, dynamic>> _messages = [
    {
      'isMe': false,
      'sender': 'Cô Nguyễn Kiều Oanh (GVCN)',
      'text': 'Chào gia đình em Mỹ An ạ! Cô gửi phụ huynh thông tin kết quả rèn luyện và chuyên cần tuần vừa qua của con nhé.',
      'time': '08:30',
    },
    {
      'isMe': false,
      'sender': 'Cô Nguyễn Kiều Oanh (GVCN)',
      'text': 'Tuần này con học tập rất chăm chỉ, bài kiểm tra 15 phút môn Toán đạt 9.0 điểm, đứng top đầu của lớp đấy ạ.',
      'time': '08:31',
    },
    {
      'isMe': true,
      'sender': 'Phụ huynh (Mẹ)',
      'text': 'Dạ vâng, cảm ơn cô giáo nhiều ạ! Gia đình cũng luôn nhắc nhở cháu học bài và làm bài tập đầy đủ trước khi đến lớp.',
      'time': '08:45',
    },
    {
      'isMe': true,
      'sender': 'Phụ huynh (Mẹ)',
      'text': 'Thứ Sáu tuần này lớp mình có lịch dã ngoại trải nghiệm thực tế không cô nhỉ?',
      'time': '08:46',
    },
    {
      'isMe': false,
      'sender': 'Cô Nguyễn Kiều Oanh (GVCN)',
      'text': 'Dạ có phụ huynh nhé, nhà trường đã gửi thông báo chi tiết trong mục Thông báo của ứng dụng. Học sinh sẽ tập trung lúc 07:15 tại sân trường ạ.',
      'time': '09:00',
    },
  ];

  void _sendMessage() {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'isMe': true,
        'sender': 'Phụ huynh (Mẹ)',
        'text': text,
        'time': 'Vừa xong',
      });
      _textController.clear();
    });

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    // Auto reply simulation
    Future.delayed(const Duration(seconds: 1), () {
      if (!mounted) return;
      setState(() {
        _messages.add({
          'isMe': false,
          'sender': widget.teacherName ?? 'Cô Nguyễn Kiều Oanh (GVCN)',
          'text': 'Dạ cô đã nhận được tin nhắn của gia đình rồi ạ. Chúc gia đình một ngày tốt lành!',
          'time': 'Vừa xong',
        });
      });

      Future.delayed(const Duration(milliseconds: 100), () {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tName = widget.teacherName ?? 'Cô Nguyễn Kiều Oanh';
    final tRole = widget.role ?? 'Giáo viên Chủ nhiệm - Lớp 10A1';

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        titleSpacing: 0,
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          color: AppColors.textPrimary,
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: AppColors.primary.withValues(alpha: 0.1),
              child: const Icon(Icons.person, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tName,
                    style: AppTypography.titleSmall.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    tRole,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone_outlined, color: AppColors.primary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Đang kết nối cuộc gọi thoại tới $tName (024.3825.1001)...'),
                  backgroundColor: AppColors.primary,
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Message stream
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(AppSpacing.space4x),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg['isMe'] as bool;

                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.78,
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: isMe ? AppColors.primary : Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: Radius.circular(isMe ? 16 : 4),
                        bottomRight: Radius.circular(isMe ? 4 : 16),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment:
                          isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg['text'],
                          style: AppTypography.bodyMedium.copyWith(
                            color: isMe ? Colors.white : AppColors.textPrimary,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              msg['time'],
                              style: AppTypography.bodySmall.copyWith(
                                color: isMe
                                    ? Colors.white.withValues(alpha: 0.7)
                                    : AppColors.textSecondary,
                                fontSize: 10,
                              ),
                            ),
                            if (isMe) ...[
                              const SizedBox(width: 4),
                              Icon(
                                Icons.done_all,
                                size: 12,
                                color: Colors.white.withValues(alpha: 0.8),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Message input bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.attach_file, color: AppColors.textSecondary),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Đính kèm ảnh bài tập hoặc văn bản')),
                      );
                    },
                  ),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F3F4),
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _textController,
                        onSubmitted: (_) => _sendMessage(),
                        decoration: const InputDecoration(
                          hintText: 'Nhập tin nhắn trao đổi...',
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  CircleAvatar(
                    backgroundColor: AppColors.primary,
                    radius: 20,
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                      onPressed: _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

