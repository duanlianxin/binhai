export default {
        namespaced:true,
        state:{
                list:[],
                isInit:false
        },
        getters:{
                getNameById(state){
                        return clsr_id =>state.list.length > 0 ? state.list.find(item =>item.clsr_id ===clsr_id).clsr_name : "";
                }
        },
        mutations: {
                _init:function(state,list){ state.isInit = true; state.list = list;},
                _add:function(state,classroom){ state.list.push(classroom); },
                _update:function(state,classroom){
                        var i =state.list.findIndex(item =>item.clsr_id === classroom.clsr_id);
                        state.list.splice(i,1,classroom);
                },
                _remove:function(state,clsr_id){ var i =state.list.findIndex(item =>item.clsr_id === clsr_id); state.list.splice(i,1);},
                toggleStatus(state,clsr_id){    //教室占用或闲置状态切换
                        var i = state.list.findIndex(item => item.clsr_id === clsr_id);
                        var obj = Object.assign({},state.list[i]);
                        obj.clsr_occupy = obj.clsr_occupy === 1 ? 0 : 1;
                        state.list.splice(i,1,obj);
                }

        },
        actions:{
                init:function(context){
                        if(context.state.isInit) return;
                        context.rootState.http({
                                url: '/classroom/all',
                                method:'get'
                        }).then(list =>context.commit('_init',list))
                },
                add:function(context,classroom){
                        return context.rootState.http({
                                url:'/classroom/add',
                                method:'post',
                                data:classroom
                        }).then(clsr_id =>context.commit('_add',Object.assign({},classroom,{clsr_id})))
                },
                update:function(context,classroom){
                        return context.rootState.http({
                                url:'/classroom/update',
                                method:'post',
                                data:classroom
                        }).then(() =>context.commit('_update',Object.assign({},classroom)))
                },
                remove:function(context,clsr_id){
                        return context.rootState.http({
                                url:'/classroom/remove/' +clsr_id,
                                method:'get'
                        }).then(clsr_id =>context.commit('_remove',clsr_id))
                }
        }
}