<template>
	<el-container class="page-wrapper">
		<el-header>
			<el-button type="text" style="float: right" @click=" logout">退出</el-button>
			<h3>青岛滨海学院管理系统</h3>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<el-menu
					@select="clickMenuHandler"
					:default-active="activeKey"
					background-color="#d3dce6"
					text-color="#000"
					active-text-color="#00D1B9">
					<template v-for="item in getFuncList(0)">
						<el-submenu v-if="item.func_key === ''" :index="item.func_id.toString()">
							<template slot="title">
								<i class="el-icon-setting"></i>
								<span v-text="item.func_name"></span>
							</template>
							<el-menu-item v-for="item2 in getFuncList(item.func_id)" :key="item2.func_id" :index="item2.func_key">
								<i class="el-icon-menu"></i>
								<span v-text="item2.func_name"></span>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-else :index="item.func_key">
							<i class="el-icon-menu"></i>
							<span v-text="item.func_name"></span>
						</el-menu-item>
					</template>
				</el-menu>
			</el-aside>
			<el-main>
				<el-tabs type="card" closable v-model="activeKey" @tab-remove="remove">
					<el-tab-pane :label="getFuncKey(item)" v-for="item in tabs" :key="item" :name="item">
							<component :is="Views[item].component"></component>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
		<el-footer height="30px">&copy;版权所有：青岛滨海学院学生处</el-footer>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import Views from '../../views';
	//组件和仓库一对一映射
	import { createNamespacedHelpers} from 'vuex';
	var { mapState} =createNamespacedHelpers('func')
        export default {
                name:'Home',
	        data(){
		        return {
		                Views,
				tabs: [],
			        activeKey: '',                          //左右互联的驱动数据
			        userFuncList:[],                //当前登录的用户的角色对应的功能列表
		        }
                },
	        computed:{
		        ...mapState(['list']),
	                getFuncList:function(){
		                return func_fid =>this.userFuncList.filter(item=>item.func_fid === func_fid);
                        },
		        getFuncKey:function(){
			        return func_key =>this.userFuncList.find(item=>item.func_key === func_key).func_name;
                        }
	        },
	        methods:{
                        clickMenuHandler(index){
                                this.activeKey = index;
                                if(this.tabs.indexOf(index) === -1) this.tabs.push(index);
                        },
		        remove(name){
                                var i = this.tabs.indexOf(name);
                                this.tabs.splice(i,1);
                                if(this.activeKey === name) this.activeKey =this.tabs[this.tabs.length - 1] || '';

		        },
                        logout(){
		               sessionStorage.clear();
                                this.$message({ message:'退出成功！',type:'success'});
		               this.$router.replace('/login');
                        }
	        },
	        created:function(){
                        //通知字典表仓库准备系统基础字典相关数据
                        this.$store.dispatch('dictionary/init');
                        this.needGetMenu = true;  //标识是否需要重新获取菜单


                },
	        //从不存在到存在会调用，存在以后从没激活到激活也会调用
	        async activated(){
	                //当token过期后 =》‘非刷新操作’ =》触发token过期401，跳到登录=》‘同一用户’再次登录后跳到当前组件，则直接返回什么也不干
		        if((!this.needGetMenu) && sessionStorage.getItem('prev_user') === sessionStorage.getItem('user'))  return;

			//能通过上面那个if判断到下面说明：一定是一个新的用户登录了，要么是用户点击了刷新按钮
		        //重置数据
                        this.userFuncList = [];
		        this.tabs = [];
		        this.activeKey = '';
		        //发送ajax到服务器拿取：当前登录的用户的角色对应的功能列表
                        let data = await this.$http({ url:'/user/getmenu',method:'post'});
                        this.userFuncList =data;
                        this.needGetMenu= false;  //获取完菜单后，要将这个开关标识重置为false
                },
	        deactivated(){}
        };
</script>

<style scoped>
	.page-wrapper {
		height: 100%;
	}
	.el-header {
		background-color: #b3c0d1;
	}
	.el-header>h3 {
		height: 60px;
		line-height: 60px;
		font-size: 24px;
	}
	.el-aside {
		background-color: #d3dce6;
	}
	.el-menu { border: none;}
	.el-main {
		background-color: #e9eef3;
	}
	.el-footer {
		background-color: #b3c0d1;
		text-align: center;
		line-height: 30px;
		font-size: 14px;
	}

	.el-tabs { height: 100%; display: flex; flex-direction: column;}
	 /deep/ .el-tabs__header { flex-shrink: 0}
	/deep/ .el-tabs__content { flex-grow: 1}
	.el-tab-pane { height: 100%;}
</style>