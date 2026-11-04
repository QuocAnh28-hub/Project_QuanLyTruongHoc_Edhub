import type { UploadProps } from 'antd';
import { Button, Flex, Spin, Upload } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../../../contexts/AppContext';
import { useStudentImportContext } from '../../../../../contexts/school-only/students/StudentImportContext';
import { useLayoutContext } from '../../../../../contexts/SchoolLayoutContext';
import { nav_links } from '../../../../../utils/routes';
import { StorageHelper, STORE_KEY_TOKEN } from '../../../../../utils/storage-helpers';
import GCard from '../../../../atoms/g-card';
import GText from '../../../../atoms/g-text';
import GTitle from '../../../../atoms/g-title';
import { CheckCircleFilled, CloseCircleFilled, FileExcelFilled, InfoCircleFilled } from '../../../../atoms/svg/filled-icons';
import { UploadOutlined } from '../../../../atoms/svg/outlined-icons';

const { Dragger } = Upload;
export default function StudentImportDragger() {
  const { callMessage } = useLayoutContext()
  const { importStudents, loading, success } = useStudentImportContext()
  const [upload_status, setUploadStatus] = useState<'none' | 'uploading' | 'done' | 'error'>('none')
  const [error_message, setErrorMessage] = useState('')
  const [percent, setPercent] = useState(0)
  const [file, setFile] = useState<string>('');

  let token = StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.local)
  if (!token) token = StorageHelper.get(STORE_KEY_TOKEN, StorageHelper.types.session)
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    accept: ".xlsx,.csv",
    action: `${import.meta.env.VITE_API_ENDPOINT}/upload/document`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    beforeUpload(file) {
      setFile(file.name);
      setUploadStatus('uploading')
      setPercent(0)
    },
    onChange: async (info) => {
      const { status, response, percent } = info.file;
      if (status === 'uploading') {
        setPercent(Number((percent || 0).toFixed(0)))
      }
      if (status === 'done') {
        setFile(response.response)
        callMessage('Tải file thành công', 'success')
        setUploadStatus('done')
      }
      if (status === 'error') {
        setFile('')
        setUploadStatus('error')
        setPercent(0)
        if (response.errors?.[0]?.code == 400)
          setErrorMessage('File không đúng định dạng')
        else
          setErrorMessage('Có lỗi trong quá trình tải file')
      }

    },
    onRemove() {
      setFile('')
      setUploadStatus('none')
      setPercent(0)
    },
  }

  function handleImportStudents() {
    if (file)
      importStudents(file) as any
  }

  if (success)
    return <ImportSuceeded />

  return <Dragger {...props}>
    {upload_status == 'none' && <ReadyToUpload />}
    {upload_status == 'uploading' && <Uploading file_name={file} percent={percent} />}
    {upload_status == 'done' &&
      <Spin spinning={loading}>
        <ReadyToImport file_name={file} action={handleImportStudents} />
      </Spin>
    }
    {upload_status == 'error' && <Error error_message={error_message} />}
  </Dragger>
}
function ReadyToUpload() {
  return <Flex vertical gap={16} align='center'>
    <UploadOutlined size={48} fill='var(--primary)' />
    <Flex vertical gap={4}>
      <GText>Nhấp hoặc kéo thả tệp để tải lên</GText>
      <GText type='secondary'>Cho phép tải lên một tệp.</GText>
    </Flex>
  </Flex>
}
function Uploading({ file_name, percent }: { file_name: string, percent: number }) {
  return <Flex vertical gap={24} align='center'>
    <InfoCircleFilled fill='var(--primary)' size={72} />
    <GTitle level={4}>Đang tải lên...</GTitle>
    <Flex gap={8}
      style={{
        padding: 12, borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        minWidth: 238
      }}>
      <FileExcelFilled size={32} fill='#22B35E' />
      <Flex vertical align='start'>
        <GText>{file_name}</GText>
        <GText type='secondary'>{percent}%</GText>
      </Flex>
    </Flex>
    <Button type='primary' disabled>Xác nhận tải lên</Button>
  </Flex>
}

function ReadyToImport({ file_name, action }: { file_name: string, action: any }) {
  return <Flex vertical gap={24} align='center'>
    <InfoCircleFilled fill='var(--primary)' size={72} />
    <GTitle level={4}>Đang tải lên...</GTitle>
    <Flex gap={8}
      style={{
        padding: 12, borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        minWidth: 238
      }}>
      <FileExcelFilled size={32} fill='#22B35E' />
      <Flex vertical align='start'>
        <GText>{file_name}</GText>
        <GText type='secondary'>100%</GText>
      </Flex>
    </Flex>
    <Button type='primary'
      onClick={(event) => {
        action()
        event.preventDefault()
        event.stopPropagation()
      }}
    >Xác nhận tải lên</Button>
  </Flex>
}

function Error({ error_message }: { error_message: string }) {
  return <Flex vertical gap={24} align='center'>
    <CloseCircleFilled fill='var(--error)' size={72} />
    <GTitle level={4}>{error_message}</GTitle>
    <Button type='primary'>Tải lại danh sách</Button>
  </Flex>
}
function ImportSuceeded() {
  const { account } = useAppContext()
  return <GCard type='secondary' vertical style={{ width: '100%' }} align='center' justify='center' gap={24}>
    <CheckCircleFilled size={72} fill='var(--success)' />
    <Flex vertical gap={8} align='center'>
      <GTitle level={5}>Chúng tôi sẽ thông báo cho bạn qua Email {account?.user_name} khi tệp đã được xử lý xong.</GTitle>
      <GText>Tệp của bạn đang được xử lý. Bạn có thể theo dõi trạng thái tại Lịch sử Nhập liệu.</GText>
    </Flex>
    <Link to={nav_links.students.route}><Button>Quay lại Hồ sơ Học sinh</Button></Link>
  </GCard>
}