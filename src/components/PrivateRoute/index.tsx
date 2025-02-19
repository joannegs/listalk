
import { ReactNode, useEffect, useState } from "react";
import { useMutation } from "react-query";
import api from "@/api/http-common";
import { getStorageItem } from "@/utils/localStore";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import { getLists } from "@/api/list/getLists";
import { getCategory } from "@/api/category/getCategory";
import { useDispatch, useSelector } from 'react-redux';
import { setArray } from '@/redux/categories/categoriesSlice';
import type { RootState} from '@/redux/store';

interface category {
    id: string;
    name: string;
}

interface PrivateRouteProps{
    children: ReactNode;
}

const PrivateRoute = (props: PrivateRouteProps) =>{
    const [authorized, setAuthorized] = useState(false);
    const [token, setToken] = useState(getStorageItem("token"));
    const categories: category[] = useSelector((state: RootState) => state.categories);
    const dispatch = useDispatch();
    const {push} = useRouter()
    
    useEffect(() =>{
        api.defaults.headers.authorization = `Bearer ${token}`;
        if(token != undefined){
            mutateCategory();
        }else{
            push(APP_ROUTES.public.home);
        }

    }, []);

    const { status: statusCategory, mutate: mutateCategory } = useMutation(
        async () => {
            return getCategory();
        },
        {
            onSuccess: (res) => {
                dispatch(setArray(res.data));
                setAuthorized(true);
            },

            onError: (error) => {
                push(APP_ROUTES.public.home);
            }
        }
    )


    return(
        <>
            {authorized && props.children}
        </>
    )
}

export default PrivateRoute;