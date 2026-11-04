import { Avatar, Button, Flex, Modal, Tag } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { useAppContext } from "../../../../../../contexts/AppContext"
import { useStudentStudentContactContext } from "../../../../../../contexts/school-only/students/contacts/StudentStudentContactContext"
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext"
import { ToFullNameByLocale } from "../../../../../../utils/locale-helpers"
import GCard from "../../../../../atoms/g-card"
import GText from "../../../../../atoms/g-text"
import GTitle from "../../../../../atoms/g-title"
import { CheckOutlined, CloseOutlined, DeleteOutlined, FormOutlined, ResetOutlined, ThunderboltOutlined, UserOutlined } from "../../../../../atoms/svg/outlined-icons"
import TitleSegmentRow from "../../../../../atoms/title-segment-row"

export default function StudentContactCardDetail() {
  const { authority } = useAppContext()
  const { data: student } = useStudentDetailContext()
  const {
    contact, is_main_contact, can_grant_access,
    setEditMode, loading,
    activateStudentContact, deleteStudentContact
  } = useStudentStudentContactContext()
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)

  async function handleActivateContact(first_activate: boolean = true) {
    if (!contact) return
    const res = await activateStudentContact(contact.id, first_activate)
    if (res) {
      setOpen1(false)
      setOpen2(false)
    }
  }
  async function handleDeleteContact() {
    if (!contact) return
    const res = await deleteStudentContact(contact.id)
    if (res) {
      setOpen3(false)
    }
  }
  if (!contact) return null
  return <GCard key={contact.id}>
    <Flex vertical gap={12} flex='auto'>
      <Flex flex='auto' justify="space-between" gap={12} wrap='wrap-reverse'>
        <Flex gap={12} align="center">
          <Avatar size={40} icon={<UserOutlined />} style={{ minWidth: 40 }} />
          <Flex vertical gap={4}>
            <GTitle level={5}>{ToFullNameByLocale(contact.firstName, contact.lastName)}</GTitle>
            {is_main_contact || can_grant_access ?
              <Flex gap={8} wrap>
                {is_main_contact && <Tag color="magenta">Người liên hệ chính</Tag>}
                {can_grant_access && <Tag color="geekblue">Tài khoản ứng dụng Gedu</Tag>}
              </Flex> : null
            }
          </Flex>
        </Flex>
        {authority?.can_touch_student && <Flex gap={8} flex='auto' justify="end">
          <Button size="small" icon={<FormOutlined />} onClick={() => setEditMode(true)} />
          <Button size="small" icon={<DeleteOutlined />}
            disabled={is_main_contact || can_grant_access}
            onClick={() => setOpen3(true)}
          />
          {can_grant_access && contact.status == 1 ?
            <ActiveModal student={student} contact={contact}
              loading={loading} open={open1} setOpen={setOpen1}
              handle={handleActivateContact} />
            : null
          }
          {can_grant_access && contact.status == 2 ?
            <ResetModal student={student} contact={contact}
              loading={loading} open={open2} setOpen={setOpen2}
              handle={() => handleActivateContact(false)} />
            : null
          }
          {open3 ?
            <DeleteModal student={student} contact={contact}
              loading={loading} setOpen={setOpen3}
              handle={handleDeleteContact} /> : null
          }
        </Flex>}
      </Flex>
      <Flex vertical gap={8}>
        <TitleSegmentRow type="secondary" title='Mối quan hệ với học sinh'>
          <GText>{contact.relationshipTitle}</GText>
        </TitleSegmentRow>
        <TitleSegmentRow type="secondary" title='Căn cước công dân'>
          <GText>{contact.citizenId}</GText>
        </TitleSegmentRow>
        <TitleSegmentRow type="secondary" title='Năm sinh'>
          <GText>{contact.dateOfBirth ? dayjs(contact.dateOfBirth).format('YYYY') : null}</GText>
        </TitleSegmentRow>
        <TitleSegmentRow type="secondary" title='Nghề nghiệp'>
          <GText>{contact.occupation}</GText>
        </TitleSegmentRow>
        <TitleSegmentRow type="secondary" title='Số điện thoại'>
          <GText>{contact.phone}</GText>
        </TitleSegmentRow>
        <TitleSegmentRow type="secondary" title='Email'>
          <GText>{contact.email}</GText>
        </TitleSegmentRow>
      </Flex>
    </Flex>
  </GCard>
}

function ActiveModal({ student, contact, loading, open, setOpen, handle }: any) {
  const contact_name = ToFullNameByLocale(contact.firstName, contact.lastName)
  const student_name = ToFullNameByLocale(student.firstName, student.lastName)
  return <>
    <Button size="small" loading={loading}
      icon={<ThunderboltOutlined />}
      onClick={() => { setOpen(true) }}
    >Kích hoạt tài khoản</Button>
    <Modal
      open={open}
      maskClosable={false}
      title='Xác nhận Kích hoạt Tài khoản Phụ huynh'
      confirmLoading={loading}
      onCancel={() => {
        if (loading) return
        setOpen(false)
      }}
      footer={(_) => (
        <>
          <Button loading={loading}
            icon={<CloseOutlined />}
            onClick={() => setOpen(false)}
          >Huỷ bỏ</Button>
          <Button type="primary" loading={loading}
            icon={<CheckOutlined />}
            onClick={handle}
          >Xác nhận & Kích hoạt</Button>
        </>
      )}
    >
      <Flex vertical gap={16} style={{ padding: '12px 0' }}>
        <Flex vertical gap={12}>
          <GText>Bạn có chắc chắn muốn kích hoạt tài khoản ứng dụng Gedu cho phụ huynh <b>{contact_name}</b> với số điện thoại <b>{contact.phone}</b> không?</GText>
          <GText>Tài khoản sẽ được tạo với mật khẩu mặc định là ngày sinh của học sinh <b>{student_name}</b> theo định dạng <b>DDMMYYYY</b>.</GText>
        </Flex>
        <Flex vertical gap={8}>
          <GText strong>Nội dung Thông báo cho Phụ huynh</GText>
          <GCard vertical type="secondary" gap={12}>
            <GText>Kính gửi Quý Phụ huynh,</GText>
            <GText>Tài khoản ứng dụng Gedu của Quý Phụ huynh đã được kích hoạt.</GText>
            <ul>
              <li><GText>Tên đăng nhập: Số điện thoại đăng ký sử dụng ứng dụng Gedu</GText></li>
              <li><GText>Mật khẩu mặc định: Là ngày sinh của Học sinh viết liền theo định dạng <b>DDMMYYYY</b> (ví dụ: nếu sinh ngày <b>15/08/2018</b>, mật khẩu sẽ là <b>15082018</b>).</GText></li>
            </ul>
            <GText>Vui lòng đăng nhập và đổi mật khẩu ngay trong lần đầu tiên. Trân trọng!</GText>
          </GCard>
        </Flex>
      </Flex>
    </Modal>
  </>
}

function ResetModal({ student, contact, loading, open, setOpen, handle }: any) {
  const contact_name = ToFullNameByLocale(contact.firstName, contact.lastName)
  const student_name = ToFullNameByLocale(student.firstName, student.lastName)
  return <>
    <Button size="small" loading={loading}
      icon={<ResetOutlined />}
      onClick={() => { setOpen(true) }}
    >Đặt lại mật khẩu</Button>
    <Modal
      open={open}
      maskClosable={false}
      title={<>Đặt lại mật khẩu cho phụ huynh {contact_name}?</>}
      confirmLoading={loading}
      onCancel={() => {
        if (loading) return
        setOpen(false)
      }}
      footer={(_) => (
        <>
          <Button loading={loading}
            icon={<CloseOutlined />}
            onClick={() => setOpen(false)}
          >Huỷ bỏ</Button>
          <Button type="primary" loading={loading}
            icon={<CheckOutlined />}
            onClick={handle}
          >Xác nhận & Kích hoạt</Button>
        </>
      )}
    >
      <Flex vertical gap={12} style={{ padding: '12px 0' }}>
        <GText>
          Mật khẩu mới sẽ là ngày sinh của học sinh <b>{student_name}</b> viết liền theo định dạng DDMMYYYY
          (ví dụ: nếu sinh ngày <b>15/08/2018</b>, mật khẩu sẽ là <b>15082018</b>).
          Vui lòng thông báo lại cho phụ huynh.
        </GText>
      </Flex>
    </Modal>
  </>
}

function DeleteModal({ student, contact, loading, setOpen, handle }: any) {
  const contact_name = ToFullNameByLocale(contact.firstName, contact.lastName)
  const student_name = ToFullNameByLocale(student.firstName, student.lastName)
  return <Modal
    open={true}
    maskClosable={false}
    title='Xác nhận Xóa Người giám hộ'
    confirmLoading={loading}
    onCancel={() => {
      if (loading) return
      setOpen(false)
    }}
    footer={(_) => (
      <>
        <Button loading={loading}
          icon={<CloseOutlined />}
          onClick={() => setOpen(false)}
        >Đóng</Button>
        <Button color="danger" variant="solid" loading={loading}
          icon={<CheckOutlined />}
          onClick={handle}
        >Xoá Người giám hộ</Button>
      </>
    )}
  >
    <Flex vertical gap={16} style={{ padding: '12px 0' }}>
      <GText>Bạn có chắc chắn muốn xóa <strong>{contact_name}</strong> (Mối quan hệ: <strong>{contact.relationshipTitle}</strong>) ra khỏi danh sách liên hệ của học sinh <strong>{student_name}</strong> không? </GText>
      <GText>Hành động này sẽ xóa thông tin liên lạc của người này.</GText>
    </Flex>
  </Modal>
}