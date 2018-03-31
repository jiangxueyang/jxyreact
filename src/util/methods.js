export const Url = {
    queryParse(url){
        url = (url || window.location.href).trim();
        let res = {};
        let queryArr = url.split('?');
        if(queryArr.length >1){
            let queryString = queryArr[1];
            let arr = queryString.split('&');
            arr.forEach(e=>{
                let values = e.split('=');
                if(values.length === 2){
                    res[values[0]] = decodeURIComponent(values[1]);
                }
            })
        }
        return res;
        
    },
    get(name){
        let url = window.location.href;
        let query = this.queryParse(url);
        return query[name];
    }
}