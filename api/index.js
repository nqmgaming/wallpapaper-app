import axios from "axios";

const API_KEY = `${process.env.API_KEY}`;

const apiUrl = `${process.env.API_URL}?key=${API_KEY}`;

const formatUrl = (params) => {// {q, page, category, order}

    let url = `${apiUrl}&per_page=25&safesearch=true&editor_choice=true`;
    if (!params) {
        return url;
    }

    let paramKeys = Object.keys(params);
    paramKeys.map(key => {
        let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    })
    // console.log(`Final Url API: ${url}`)
    return url;

}

export const apiCall = async (params) => {
    try {

        const response = await axios.get(formatUrl(params))
        const {data} = response;
        return {
            success: true,
            data: data,
        };

    } catch (err) {
        console.error(`Got error: ${err.message}`);
        return {
            success: false,
            msg: err.message
        }
    }
}
