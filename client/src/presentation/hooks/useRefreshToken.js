

const useRefreshToken = () => {
    // const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axiosInstance.get('/refresh', {
            withCredentials: true
        });
        console.log(JSON.stringify(prev));
        console.log(response.data.accessToken);
        // setAuth(prev => {
        //     console.log(JSON.stringify(prev));
        //     console.log(response.data.accessToken);
        //     return {
        //         ...prev,
        //         roles: response.data.roles,
        //         accessToken: response.data.accessToken
        //     }
        // });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;