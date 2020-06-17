//自定义一个函数http，对axios进行封装，然后导出
import axios from 'axios';
import { Loading,Message,MessageBox} from 'element-ui';
import router from '../router'


var alwaysPendingPromise = new Promise(()=>{});
function http(options){
        var loading =Loading.service({                  //开启loading效果
                lock:true,
                text:'Loading',
                spinner:'el-icon-loading',
                background:'rgba(0,0,0,0.7)'
        });
        //让所有ajax请求自动带上token
        options.headers = { Authorization:sessionStorage.getItem('token')};
        return axios(options)
                //做出延时关闭loading的效果
                .then(response =>{
                        return new Promise(resolve => {
                                setTimeout(() =>{
                                        loading.close();                //关闭loading
                                        resolve(response);
                                },1000)
                        })
                })
                .then(response =>{              //排除物理失败
                        if(response.status ===200) return Promise.resolve(response.data);
                        else return promise.reject(new Error(response.statusText));
                })
                .then(result =>{        //排除逻辑失败（这里的代码取决于服务器的开发与封装）
                       switch(result.status) {
                               case 200:
                                       return Promise.resolve(result.data);
                               case 401:        //未登录或登录超时
                                       sessionStorage.removeItem('token');              //避免用户直接看home组件的残留
                                       //isExist401是一个放在sessionStorage中的标记，避免登录超时后的操作多次触发弹窗提示
                                       if(!sessionStorage.getItem('isExist401')) {
                                                sessionStorage.setItem('isExist401',true);
                                                MessageBox({
                                                        title:'提示', message:'您未登录或登录超时，请重新登录', type:'warning',
                                                        showClose:false,                        //不显示关闭按钮
                                                        closeOnClickModal:false,               //点遮罩层关不掉
                                                        closeOnPressEscape:false                //按ESC关不掉
                                                })
                                                        .then(()=>router.replace('/login'));  //跳到登录
                                        }
                                        return alwaysPendingPromise;
                               case 404:        //服务器无法连接
                                       MessageBox({ title:'提示', message:'您和服务器断开了连接',type:'warning'})
                                               .then(()=>{/*没什么好做的*/});
                                       return alwaysPendingPromise;
                               case 199:        //逻辑错误
                               case 500:        //物理错误

                       }
                })
                //物理失败、逻辑失败都会流到这里，我是一个拖地的catch。前面n多的then只要出错都会到我这里来统一处理
                .catch(function(error){
                        Message({ message:error.message,type:'error'});
                        loading.close();           //关闭load请效果
                        return alwaysPendingPromise;
                });
}

export default http;