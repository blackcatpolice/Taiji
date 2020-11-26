 

import { useState, useCallback } from 'react'
import { UserInfoClient } from '../apis/API';
import { CurrentUser } from '@/interfaces/userInfo/userInfo'

export default function userInfoModel() {
    const [userInfo, setUser] = useState<CurrentUser | null>()

    const userInfoClient = new UserInfoClient();

    const getUserInfo = useCallback(async () => {
        const res = await userInfoClient.getUserInfo()
        setUser({
            avatar: res?.data['avatar'] || '@/assets/avatar.png',
            name: res?.data['name']
        })

        console.log(userInfo)
    }, []);

    const setInfo = useCallback((user) => {
        setUser(user)
    }, [])

    return {
        userInfo, getUserInfo
    }
}