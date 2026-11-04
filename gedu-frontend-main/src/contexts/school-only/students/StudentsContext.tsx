import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callArrangeStudentClass, callBulkArrangeStudentClass, callTransferStudentClass, useStudents } from "../../../hooks/school-only/students-hook";
import { StudentRow } from "../../../models/student-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as StudentRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  grd: undefined as number | string | undefined,
  clss: undefined as number | string | undefined,
  fetching: true,
  refreshing: true,
  mutate: () => { },
  arrangeStudentClass: (_student_id: number | null, _data: any): any => { },
  transferStudentClass: (_student_id: number | null, _data: any): any => { },
  bulkArrangeStudentClass: (_data: any): any => { }
});
interface Props {
  children: ReactNode
}
export default function StudentsProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [searchParams] = useSearchParams();

  const { page, size, query, grd, clss } = useMemo(() => {
    let page = searchParams.get('page') as any
    let size = searchParams.get('size') as any
    const query = searchParams.get('q') as any
    const grd = searchParams.get('grd') as any
    const clss = searchParams.get('clss') as any
    if (!page || isNaN(+page) || Number(page) < 1) page = 1
    else page = Number(page)
    if (!size || isNaN(+size) || Number(size) < 1) size = PAGINATE_DEFAULT_SIZE
    else size = Number(size)
    if (size > PAGINATE_MAX_SIZE) size = PAGINATE_MAX_SIZE
    return { page, size, query, grd, clss }
  }, [searchParams])
  const { data, total, fetching, refreshing, error, mutate } = useStudents(page, size, query, grd, clss)

  async function arrangeStudentClass(student_id: number | null, _data: any) {
    if (!_data) return
    const { data, error } = await callArrangeStudentClass(student_id, {
      gradeLevel: _data.gradeLevel,
      classId: _data.classId, // NOTE: classId is an array in the form, we only need the first element
    }) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật học sinh', 'error')
      }
    }
    return result
  }

  async function bulkArrangeStudentClass(_data: any) {
    if (!_data) return
    const { data, error } = await callBulkArrangeStudentClass({
      gradeLevel: _data.gradeLevel,
      classId: _data.classId,
      studentIds: _data.studentIds
    }) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật học sinh', 'error')
      }
    }
    return result
  }

  async function transferStudentClass(student_id: number | null, _data: any) {
    if (!_data) return
    const { data, error } = await callTransferStudentClass(student_id, {
      fromClassId: _data.fromClassId?.[0] || _data.fromClassId, // NOTE: classId is an array in the form, we only need the first element
      toClassId: _data.toClassId,
      gradeLevel: _data.gradeLevel,
      note: _data.note || null
    }) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật học sinh', 'error')
      }
    }
    return result
  }

  return <context.Provider value={{
    ___testing: false,
    data, page, size, query, grd, clss, total, fetching, refreshing, mutate,
    arrangeStudentClass,
    transferStudentClass,
    bulkArrangeStudentClass
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useStudentsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStudentsContext wad used outside of StudentsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStudentsContext };
