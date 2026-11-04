import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callUpdateASchoolFacilities, useSchoolFacilities, } from "../../../hooks/ed-only/schools-hook";
import { SchoolFacilities } from "../../../models/ed-only/school-model";
import { useLayoutContext } from "../../EDLayoutContext";

const context = createContext({
    ___testing: true,
    data: null as SchoolFacilities | null,
    fetching: true,
    error: null,
    mutate: () => { },
    update_mode: false,
    updateSchoolFacilities: (_value: any): any => { },
    switchUpdateMode: (_mode: boolean) => { },
    loading: false,

});
interface Props {
    children: ReactNode
}


export default function SchoolDetailFacilityProvider({ children }: Props) {
    const { callMessage } = useLayoutContext()
    const { id } = useParams();
    const school_id = useMemo(() => {
        if (!id) return 0
        return Number(id)
    }, [id])
    const [update_mode, setUpdateMode] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const { data, fetching, error, mutate } = useSchoolFacilities(school_id)

    function switchUpdateMode(_mode: boolean) {
        setUpdateMode(_mode)
    }

    async function updateSchoolFacilities(form_value: any): Promise<boolean> {
        if (!form_value || !form_value.id) return false
        setLoading(true)
        console.log(form_value)
        // Biến đổi form_value thành object đúng ở đây
        const schoolFacilities = { ...form_value } as SchoolFacilities

        const { data, error } = await callUpdateASchoolFacilities(school_id, schoolFacilities) as any
        let result = false
        if (data) {
            callMessage('Cập nhật thông tin thành công', 'success')
            result = true
            mutate()
        } else {
            if (error?.message) {
                callMessage(error.message, 'error')
            } else {
                callMessage('Có lỗi trong quá trình cập nhật', 'error')
            }
        }
        setLoading(false)
        return result
    }

    return <context.Provider value={
        {
            ___testing: false,
            data,
            fetching,
            error,
            mutate,
            updateSchoolFacilities,
            update_mode, switchUpdateMode, loading,
        }
    }>

        {children}
    </context.Provider>
}

const useSchoolFacilitiesContext = () => {
    const _context = useContext(context)
    if (_context.___testing)
        console.log('Testing mode is on, useSchoolFacilitiesContext wad used outside of SchoolDetailFacilityProvider');
    return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolFacilitiesContext };
