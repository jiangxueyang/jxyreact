import {action} from 'mobx'
import datetime from 'locutus/php/datetime'
import IS from 'is'
class Filters {
    @action
    formatTime (time,format = 'Y-m-d H:i:s' ) {
        let res = '--';
        if (time) {
            let stamp = datetime.strtotime(time);
            res = datetime.date(format, stamp);
        }
        return res;
    }
    @action
    formatTokey(data,key){
        if(!IS.array(data.slice()) || IS.empty(key)) return {}
        let res = {}
        data.forEach(e=>{
            if(IS.defined(e[key]) && IS.defined(e)) res[e[key]] = e
        })
        return res
    }
    
}

export default Filters