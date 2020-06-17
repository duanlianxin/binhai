
export default {
        namespaced:true,
        state: {
                list: [],
                isInit: false
        },
        getters: {
                withTree:function(state){
                        var result = [];
                        var temp = null,children= null;
                        state.list.filter(item =>item.func_fid ===0).forEach(item =>{
                                temp = Object.assign({},item);
                                children = state.list.filter(item2=>item2.func_fid === item.func_id);
                                if(children.length >0) {
                                        temp.children = [];
                                        children.forEach(item2 =>temp.children.push(Object.assign({},item2)))
                                }
                                result.push(temp);
                        })

                        return result;
                }
        },
        mutations: {
                _init:function(state,list){
                        state.isInit = true;
                        state.list = list;
                },
                _add:function(state,func){
                        state.list.push(func);
                },
                _update:function(state,func){
                        var i =state.list.findIndex(item =>item.func_id === func.func_id)
                        state.list.splice(i,1,func);
                },
                _remove:function(state,func_id){
                        var i =state.list.findIndex(item =>item.func_id === func_id)
                        state.list.splice(i,1);
                }
        },
        actions:{
                init:function(context){
                        if(context.state.isInit) return;
                        context.rootState.http({
                                url: '/function/all',
                                method:'get'
                        }).then(list =>context.commit('_init',list))
                },
                add:function(context,func){
                        return context.rootState.http({
                                url:'/function/add',
                                method:'post',
                                data:func
                        }).then(func_id =>context.commit('_add',Object.assign({},func,{func_id})))
                },
                update:function(context,func){
                        return context.rootState.http({
                                url:'/function/update',
                                method:'post',
                                data:func
                        }).then(() =>context.commit('_update',Object.assign({},func)))
                },
                remove:function(context,func_id){
                        return context.rootState.http({
                                url:'/function/remove/' +func_id,
                                method:'post'
                        }).then(func_id =>context.commit('_remove',func_id))
                }
        }
}