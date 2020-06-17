
export default {
        namespaced: true,
        state: {
                isInit: false,
                list:[],
        },
        getters: {
                getGroupByKey:function(state){
                        return dic_group_key => state.list.filter(item =>item.dic_group_key === dic_group_key);
                },
                getNameById:function(state){
                        return dic_id => state.list.find(item => item.dic_id === dic_id).dic_name;
                }
        },
        mutations:{
                _init:function(state,list){ state.isInit =true; state.list = list; }
        },
        actions:{
                init:function(context){
                        if(context.state.isInit) return Promise.resolve();
                        return context.rootState.http({
                              url:'/dictionary/all',
                              method:'get'
                      }).then( list => context.commit('_init',list))
                }
        }
}