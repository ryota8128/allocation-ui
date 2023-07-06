import FormLogin from '@/components/login/FormLogin'
import { NextPage } from 'next'

interface Props {

}

const login: NextPage<Props> = () => {
    return (
        <div>
            <FormLogin />
        </div>
    )
}

export default login
