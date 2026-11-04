INSERT INTO eduhub.campuses (
  org_id,
  code,
  name,
  phone_number,
  address,
  distance_to_main_campus_in_km,
  transportation_methods,
  area_in_sq_meters,
  created_at,
  updated_at
) VALUES
(
  100001,
  'CAMP-01',
  'Điểm trường Thôn A',
  '0123456789',
  'Thôn A, Xã X',
  5.0,
  ARRAY['xe đạp', 'đi bộ'],
  1200,
  NOW(),
  NOW()
),
(
  100001,
  'CAMP-02',
  'Điểm trường Thôn B',
  '0987654321',
  'Thôn B, Xã Y',
  12.0,
  ARRAY['xe buýt'],
  2000,
  NOW(),
  NOW()
) ON CONFLICT ON CONSTRAINT campuses_org_id_code_key DO NOTHING;
