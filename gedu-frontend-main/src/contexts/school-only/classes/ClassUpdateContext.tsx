import { Form, FormInstance } from "antd";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { StudentGradeModel } from "../../../models/enums";
import { GetGradeLevels } from "../../../utils/locale-helpers";
import { useAppContext } from "../../AppContext";

const context = createContext({
    ___testing: true,
    form: undefined as FormInstance<any> | undefined,
    form_result: undefined as FormInstance<any> | undefined,
    initData: (_values: any): any => { },
    input_data: undefined as any | undefined,
    grade_levels: [] as StudentGradeModel[],
});
interface Props {
    children: ReactNode
}
export default function ClassesUpdateProvider({ children }: Props) {
    const { account } = useAppContext()
    const [form] = Form.useForm();
    const [form_result] = Form.useForm();
    const [input_data, setInputData] = useState<any | undefined>(undefined)

    function initData(_values: any) {
        setInputData(_values)
    }

    const grade_levels = useMemo(() => {
        let grade_levels = [] as StudentGradeModel[]
        if (account) {
            grade_levels = GetGradeLevels(account?.additional.can_preschool, account?.additional.can_primary_school, account?.additional.can_lower_secondary_school, account?.additional.can_upper_secondary_school)
        }
        return grade_levels
    }, [account])

    return <context.Provider value={{
        ___testing: false,
        form,
        grade_levels,
        input_data,
        initData,
        form_result,
    }}>
        {children}
    </context.Provider>
}
const useClassesUpdateContext = () => {
    const _context = useContext(context)
    if (_context.___testing)
        console.log('Testing mode is on, useClassesUpdateContext was used outside of ClassesUpdateProvider');
    return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useClassesUpdateContext };
