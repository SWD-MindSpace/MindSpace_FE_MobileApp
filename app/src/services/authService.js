// const apiURL = "https://192.168.101.2:7096/api/v1/identity/login";
// const apiURL = "https://127.0.0.1:7096/api/v1/identity/login"  
// const apiURL = "https://localhost:7096/api/v1/identity/login"                      //browser 
const apiURL = "http://10.0.2.2:5021/api/v1/identity/login"                          //android emulator


export const login = async (email, password) => {
    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Email: email,
                Password: password, 
            }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }

        const data = await response.json();
        return data; // Should contain tokens or user details
    } catch (error) {
        throw new Error(error.message);
    }
};

export default { login };